type State =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "number";
      value: number;
    }
  | {
      type: "currency";
      value: number;
      currency: string;
    };

EKG.widget("LatestInfo")
  .initialState<State>((ctx, initialData) => {
    const infoType = ctx.settings.infoType;

    if (infoType === "followerName" && initialData.latestFollower) {
      return {
        type: "text",
        text: initialData.latestFollower.data.followerDisplayName,
      };
    }

    if (infoType === "subscriberName" && initialData.latestSubscriber) {
      return {
        type: "text",
        text: initialData.latestSubscriber.data.subscriberDisplayName,
      };
    }

    if (infoType === "tipperName" && initialData.latestTip) {
      return {
        type: "text",
        text: initialData.latestTip.data.tipperDisplayName,
      };
    }

    if (infoType === "tipAmount" && initialData.latestTip) {
      return {
        type: "currency",
        value: initialData.latestTip.data.amountCents,
        currency: initialData.latestTip.data.currency,
      };
    }

    return { type: "text", text: ctx.settings.placeholderText };
  })
  .register((event, state, ctx) => {
    const infoType = ctx.settings.infoType;

    if (event.type === "ekg.channel.followed" && infoType === "followerName") {
      return { type: "text", text: event.data.followerDisplayName };
    }

    if (
      event.type === "ekg.subscription.started" &&
      infoType === "subscriberName"
    ) {
      return { type: "text", text: event.data.subscriberDisplayName };
    }

    if (event.type === "ekg.tip.sent" && infoType === "tipperName") {
      return { type: "text", text: event.data.tipperDisplayName };
    }

    if (event.type === "ekg.tip.sent" && infoType === "tipAmount") {
      return {
        type: "currency",
        value: event.data.amountCents,
        currency: event.data.currency,
      };
    }

    if (
      event.type === "ekg.subscription.gifted" &&
      infoType === "giftSubberName"
    ) {
      return {
        type: "text",
        text: event.data.gifterDisplayName ?? "Anonymous",
      };
    }

    if (
      event.type === "ekg.subscription.gifted" &&
      infoType === "giftSubCount"
    ) {
      return { type: "number", value: event.data.giftCount };
    }

    return state;
  });
