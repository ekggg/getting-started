EKG.widget("SubCount")
  .initialState((_ctx, initialData) => {
    return { count: 0, startedAt: initialData.latestStreamStart?.timestamp };
  })
  .persist((state) => ({ count: state.count, startedAt: state.startedAt }))
  .restore((state, persisted) => {
    // Only restore the count if a stream hasn't gone live since the count was persisted
    const currentStreamStartedAt = state.startedAt ?? 0;
    const persistedStreamStartedAt = persisted?.startedAt ?? 0;
    if (persistedStreamStartedAt >= currentStreamStartedAt) {
      return {
        count: persisted?.count ?? state.count,
        startedAt: persisted?.startedAt,
      };
    }

    return state;
  })
  .register((event, state, _ctx) => {
    switch (event.type) {
      case "ekg.stream.started":
        // Reset the count when a new stream starts
        return { count: 0, startedAt: event.data.startedAt };
      case "ekg.subscription.started":
        return { ...state, count: state.count + 1 };
      case "ekg.subscription.renewed":
        return { ...state, count: state.count + 1 };
      case "ekg.subscription.gifted":
        return { ...state, count: state.count + event.data.giftCount };
      default:
        return state;
    }
  });
