# Using TypeScript

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
If you're building anything beyond a simple counter widget, TypeScript will save
you time catching bugs before they happen and give you excellent autocomplete
for the entire EKG API.

## Why TypeScript?

Widget development involves working with events, state, and context objects that
all have specific shapes. When you're handling a `ChatSent` event, you need to
know that it has an `authorDisplayName` property, not `username` or `sender`.
TypeScript catches these mistakes as you write code rather than when you're
testing your widget live.

**Already comfortable with TypeScript?**

The EKG.gg platform provides a complete set of type definitions. The devkit
generates widget-specific types based on your manifest, giving you full
autocomplete for your settings and assets.

**New to TypeScript?**

Think of TypeScript as JavaScript with guardrails. You write the same code, but
your editor will warn you when you try to access a property that doesn't exist
or pass the wrong type of value to a function.

## Setting up TypeScript with the devkit

The easiest way to write TypeScript widgets is to use the EKG devkit. It handles
all the compilation and type generation for you automatically.

```
npm create ekg my-widget
```

You can also use `pnpm create ekg` or `bun create ekg`. Once the project is
created, you'll have a fully configured TypeScript environment ready to go.

### What the devkit provides

When you run `npm run dev`, the devkit does several things for you:

1. **Downloads type definitions** - Fetches the latest EKG type definitions from
   the platform and stores them in the `.runtime` folder
2. **Generates widget-specific types** - Creates an `ekg.d.ts` file in your
   project root that includes types based on your manifest's settings and assets
3. **Compiles your TypeScript** - Uses tsdown to compile your widget script to
   JavaScript that the QuickJS VM can execute
4. **Hot reloads on changes** - Watches your files and recompiles automatically
   when you make changes

### Project structure

A typical TypeScript widget project looks like this:

```
my-widget/
├── manifest.json     # Widget metadata, settings, and assets
├── script.ts         # Your TypeScript widget logic
├── template.hbs      # Handlebars template
├── styles.css        # Widget styles
├── ekg.d.ts          # Generated types (don't edit manually)
└── .runtime/         # Downloaded runtime files
```

> [!WARNING]
> The `ekg.d.ts` file is regenerated based on your manifest every time you run
> the devkit. Don't edit this file manually as your changes will be lost.

## The EKG namespace

All EKG types live in the `EKG` namespace. The core types you'll work with are:

**`EKG.Event`** - A union of all possible event types your widget can receive.
This includes `ChatSent`, `ChannelFollowed`, `TipSent`, `SubscriptionStarted`,
and others.

**`EKG.WidgetContext`** - The context object passed to your callbacks containing
`settings`, `assets`, `now`, `size`, and `random()`.

**`EKG.WidgetAssets`** - An interface for your widget's assets, populated by the
devkit based on your manifest.

**`EKG.WidgetSettings`** - An interface for your widget's settings, populated by
the devkit based on your manifest.

## Writing a typed widget

Here's a complete example of a typed widget that displays recent followers:

```ts
// script.ts
type State = {
  followers: Array<{
    name: string;
    timestamp: number;
  }>;
};

EKG.widget("RecentFollowers")
  .initialState<State>((ctx) => ({ followers: [] }))
  .register((event, state, ctx) => {
    switch (event.type) {
      case "ekg.channel.followed":
        const newFollower = {
          name: event.data.followerDisplayName,
          timestamp: event.timestamp,
        };
        return {
          ...state,
          followers: [...state.followers, newFollower].slice(-5),
        };

      default:
        return null;
    }
  });
```

Notice how we define a `State` type and use it to annotate our callbacks. This
gives us full autocomplete when working with state and catches errors if we try
to access properties that don't exist.

## Working with events

Each event type has its own interface with properly typed properties. When you
use a switch statement on `event.type`, TypeScript automatically narrows the
type:

```ts
.register((event, state, ctx) => {
  switch (event.type) {
    case "ekg.chat.sent":
      // TypeScript knows event is ChatSent here
      const message = event.data.message; // ChatNode[]
      const author = event.data.authorDisplayName; // string
      const isMod = event.data.isModerator; // boolean
      break;

    case "ekg.tip.sent":
      // TypeScript knows event is TipSent here
      const amount = event.data.amountCents; // number
      const currency = event.data.currency; // string
      break;
  }
  return state;
});
```

This type narrowing prevents you from accidentally accessing `event.data.amount`
on a chat event or `event.data.message` on a follow event.

## Typed settings and assets

When the devkit reads your manifest, it generates interfaces for your specific
settings and assets. Given this manifest:

```json
{
  "settings": {
    "maxMessages": {
      "type": "integer",
      "default": 50
    },
    "backgroundColor": {
      "type": "color",
      "default": "#1a1a1a"
    }
  },
  "assets": {
    "alertSound": {
      "type": "sound",
      "file": "alert.wav"
    }
  }
}
```

The devkit generates:

```ts
declare namespace EKG {
  interface WidgetSettings {
    maxMessages: number;
    backgroundColor: string;
  }
  interface WidgetAssets {
    alertSound: string;
  }
}
```

Now `ctx.settings.maxMessages` is typed as `number` and your editor will
autocomplete setting names as you type.

## Available event types

The `EKG.Event` union includes the following event types:

| Event Type                  | Interface             | Description                          |
| --------------------------- | --------------------- | ------------------------------------ |
| `ekg.channel.followed`      | `ChannelFollowed`     | A user followed the channel          |
| `ekg.chat.sent`             | `ChatSent`            | A chat message was sent              |
| `ekg.event.deleted`         | `EventDeleted`        | An event was deleted by a moderator  |
| `ekg.subscription.gifted`   | `SubscriptionGifted`  | A subscription was gifted            |
| `ekg.subscription.renewed`  | `SubscriptionRenewed` | A subscription was renewed           |
| `ekg.subscription.started`  | `SubscriptionStarted` | A new subscription started           |
| `ekg.tip.sent`              | `TipSent`             | A monetary tip was sent              |
| `ekg.user.messages_cleared` | `UserMessagesCleared` | A user's messages were cleared       |
| `RESIZE`                    | `ResizeEvent`         | The widget container was resized     |
| `TICK`                      | `TickEvent`           | A periodic tick event for animations |

## Utility functions

The EKG namespace also provides utility functions through `EKG.utils`:

```ts
// Convert chat nodes to plain text
const text = EKG.utils.chatToText(event.data.message);
```

This is useful when you need to work with chat content as a string rather than
as a structured array of nodes.

## Common patterns

### Handling chat nodes

Chat messages come as an array of `ChatNode` objects which can be text, emoji,
links, or mentions. Here's how to work with them:

```ts
function processMessage(nodes: EKG.ChatNode[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
          return node.text;
        case "emoji":
          return node.code;
        case "mention":
          return `@${node.mentionedDisplayName}`;
        case "link":
          return node.href;
      }
    })
    .join("");
}
```

### Type guards for events

If you need to check event types outside of a switch statement, you can create
type guards:

```ts
function isChatEvent(event: EKG.Event): event is EKG.ChatSent {
  return event.type === "ekg.chat.sent";
}

// Usage
if (isChatEvent(event)) {
  // event is now typed as ChatSent
}
```

## Regenerating types

If you add new settings or assets to your manifest, run `npm run sync` (or
`ekg sync`) to regenerate your `ekg.d.ts` file. The devkit will also
automatically do this when you start the dev server.

## Further reading

- [List of EKG events](./list-of-events.md)
- [Using the ctx object](./the-ctx-object.md)
- [Understanding the VM](./understanding-the-vm.md)
