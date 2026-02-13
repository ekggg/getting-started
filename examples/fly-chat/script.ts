type Message = {
  id: string;
  userId: string;
  displayName: string;
  message: EKG.ChatNode[];
  position: number;
  size: number;
  duration: number;
  removeAt: number;
};

type State = {
  messages: Message[];
};

EKG.widget("FlyChat")
  .initialState<State>((_ctx) => ({
    messages: [],
  }))
  .register((event, state, ctx) => {
    switch (event.type) {
      case "ekg.chat.sent":
        return addMessage(event, state, ctx);
      case "ekg.event.deleted":
        return deleteMessage(event, state, ctx);
      case "ekg.user.messages_cleared":
        return deleteMessages(event, state, ctx);
      case "TICK":
        return cleanup(event, state, ctx);
    }
    return state;
  });

const addMessage = (
  event: EKG.ChatSent,
  state: State,
  ctx: EKG.WidgetContext,
) => {
  // ignore bot users
  const bots = [
    "105166207", // StreamLabs
    "100135110", // StreamElements
    "19264788", // Nightbot
    "237719657", // Fossabot
    "216527497", // SoundAlerts
  ];
  if (bots.includes(event.data.authorId)) return state;

  // Filter out commands
  const messageText = EKG.utils.chatToText(event.data.message);
  if (messageText.startsWith("!")) return state;

  const between = (min: number, max: number) =>
    min + (max - min) * ctx.random();

  // Add the message
  const duration = between(
    ctx.settings.minDuration * 1000,
    ctx.settings.maxDuration * 1000,
  );
  const size = between(ctx.settings.minFontSize, ctx.settings.maxFontSize);
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        id: event.id,
        userId: event.data.authorId,
        displayName: event.data.authorDisplayName,
        message: event.data.message,
        position: ctx.random(),
        size,
        duration,
        removeAt: ctx.now + duration + 200,
      },
    ],
  };
};

const deleteMessage = (
  { data }: EKG.EventDeleted,
  state: State,
  _ctx: EKG.WidgetContext,
) => {
  return {
    ...state,
    messages: state.messages.filter((m) => m.id !== data.deletedEventId),
  };
};

const deleteMessages = (
  { data }: EKG.UserMessagesCleared,
  state: State,
  _ctx: EKG.WidgetContext,
) => {
  return {
    ...state,
    messages: state.messages.filter((m) => m.userId !== data.userId),
  };
};

const cleanup = (
  _event: EKG.TickEvent,
  state: State,
  ctx: EKG.WidgetContext,
) => {
  return {
    ...state,
    messages: state.messages.filter((m) => m.removeAt >= ctx.now),
  };
};
