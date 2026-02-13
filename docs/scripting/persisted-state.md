# Persisted State

Sometimes your widget needs to remember things across page reloads or scene
changes. A chat widget might need to preserve the message history when a
streamer switches between scenes. A goal tracker might need to keep the donation
total even if OBS restarts. That's where persisted state comes in.

## When to use persisted state

Persisted state is useful when your widget has data that would be painful to
lose. Consider a widget that tracks subscriber milestones throughout a stream:

```js
// Without persistence, switching scenes resets everything
EKG.widget("SubMilestones")
  .initialState(() => ({
    totalSubs: 0,
    milestones: [], // { count: 100, reachedAt: 1234567890 }
  }))
  .register((event, state, ctx) => {
    if (event.type === "ekg.subscription.started") {
      const newTotal = state.totalSubs + 1;
      const newMilestones = [...state.milestones];

      if (newTotal % 100 === 0) {
        newMilestones.push({
          count: newTotal,
          reachedAt: ctx.now,
        });
      }

      return {
        ...state,
        totalSubs: newTotal,
        milestones: newMilestones,
      };
    }
    return state;
  });
```

If a streamer switches from their "Just Chatting" scene to their "Gaming" scene
and both scenes have this widget, without persistence the subscriber count would
reset to zero. With persistence, the count survives the scene change.

## The persistence API

EKG.gg provides two chainable methods for persistence: `.persist()` and
`.restore()`. These methods go between `.initialState()` and `.register()` in
your widget chain.

```js
EKG.widget("MyWidget")
  .initialState(() => ({
    /* ... */
  }))
  .persist((state) => ({
    /* what to save */
  }))
  .restore((state, persisted) => ({
    /* how to restore */
  }))
  .register((event, state, ctx) => {
    /* ... */
  });
```

**`.persist(fn)`** takes your current state and returns an object containing
only the data you want to save. You don't need to persist everything—just the
important bits.

**`.restore(fn)`** takes the initial state and whatever was previously
persisted, then returns the restored state. The `persisted` argument may be
empty or partial, so always provide fallbacks.

## A complete example

Let's add persistence to our milestone tracker:

```js
EKG.widget("SubMilestones")
  .initialState(() => ({
    totalSubs: 0,
    milestones: [],
    // UI state we don't need to persist
    isAnimating: false,
    lastEventId: null,
  }))
  .persist((state) => ({
    // Only persist the data that matters
    totalSubs: state.totalSubs,
    milestones: state.milestones,
  }))
  .restore((state, persisted) => ({
    ...state,
    // Restore with fallbacks for missing data
    totalSubs: persisted.totalSubs || 0,
    milestones: persisted.milestones || [],
  }))
  .register((event, state, ctx) => {
    if (event.type === "ekg.subscription.started") {
      const newTotal = state.totalSubs + 1;
      const newMilestones = [...state.milestones];

      if (newTotal % 100 === 0) {
        newMilestones.push({
          count: newTotal,
          reachedAt: ctx.now,
        });
      }

      return {
        ...state,
        totalSubs: newTotal,
        milestones: newMilestones,
        isAnimating: true,
        lastEventId: event.id,
      };
    }
    return state;
  });
```

Notice how we only persist `totalSubs` and `milestones`, not the UI state like
`isAnimating`. There's no point in saving transient visual state—it should
reset to its default when the widget reloads anyway.

## When persistence happens

EKG.gg persists your widget's data in two situations:

1. **Periodically** - Your data is saved at regular intervals while the widget
   is running
2. **Before page close** - When the browser tab or OBS scene is about to unload,
   your data is saved one final time

This means there's a small window where very recent changes might not be
persisted if something unexpected happens (like a browser crash). For most
widgets this is fine—losing a few seconds of data during a crash is acceptable.

> [!NOTE]
> Don't rely on persistence for split-second accuracy. If your widget absolutely
> cannot lose a single event, consider designing it to be resilient to restarts
> instead.

## Understanding widget lifecycle

Here's something important to understand: **your widget only runs when it's
visible in the current scene**. When a streamer switches to a scene that doesn't
include your widget, your widget stops completely. It doesn't receive events, it
doesn't update state, it simply doesn't exist until it's back on screen.

This has implications for what persistence can and cannot do:

**Persistence helps with:**

- Switching between scenes that both contain your widget
- Refreshing the browser source
- Restarting OBS (if the widget was on the active scene before shutdown)

**Persistence cannot help with:**

- Events that happen while your widget isn't on screen
- Keeping a running tally of things that happen during scenes without your
  widget

Let's look at an example. Say you have a "bits goal" widget that tracks progress
toward a bits target:

```js
EKG.widget("BitsGoal")
  .initialState(() => ({
    currentBits: 0,
    goalBits: 10000,
  }))
  .persist((state) => ({
    currentBits: state.currentBits,
  }))
  .restore((state, persisted) => ({
    ...state,
    currentBits: persisted.currentBits || 0,
  }))
  .register((event, state, ctx) => {
    if (event.type === "ekg.tip.sent") {
      // Note: This only catches tips while the widget is on screen
      return {
        ...state,
        currentBits: state.currentBits + event.data.amountCents,
      };
    }
    return state;
  });
```

If this widget is only on the streamer's "Starting Soon" scene, and someone
donates bits while they're on their "Gaming" scene, the widget will never see
that event. Persistence saves what the widget knows, but it can't save what the
widget never saw.

> [!TIP]
> For widgets that need to track totals across an entire stream, consider
> placing them on every scene, even if marked not visible. A `display: none` widget
> still receives events and persists state.

## What to persist (and what not to)

A good rule of thumb: persist data, not UI state.

**Good candidates for persistence:**

- Counters and totals
- Lists of items (recent followers, chat history)
- User achievements or milestones
- Configuration derived from events

**Bad candidates for persistence:**

- Animation states (`isAnimating`, `currentFrame`)
- Temporary flags (`shouldPlaySound`, `hasNewMessage`)
- Cached calculations that can be recomputed
- References to specific events by ID (the events won't exist after reload)

Here's a chat widget example showing what to persist:

```js
EKG.widget("ChatBox")
  .initialState(() => ({
    // Persist these
    messages: [],

    // Don't persist these
    pendingAnimation: null,
    scrollPosition: 0,
  }))
  .persist((state) => ({
    messages: state.messages.slice(-50), // Keep last 50 messages
  }))
  .restore((state, persisted) => ({
    ...state,
    messages: persisted.messages || [],
  }))
  .register((event, state, ctx) => {
    // ... handle chat events
  });
```

Notice the `.slice(-50)` in the persist function. This is a good practice for
list data—you probably don't need to persist hundreds of messages, and keeping
the persisted data small ensures fast saves and restores.

## Handling partial or missing data

The `persisted` argument in `.restore()` might be empty (on first load) or
partial (if your persist schema changed). Always write defensive restore
functions:

```js
.restore((state, persisted) => ({
  ...state,
  // Always provide fallbacks
  count: persisted.count ?? 0,
  items: persisted.items ?? [],
  // Handle schema changes gracefully
  config: {
    ...state.config,
    ...(persisted.config || {}),
  },
}))
```

Using `??` (nullish coalescing) instead of `||` is safer here because it only
falls back when the value is `null` or `undefined`, not when it's `0` or an
empty string.

## Further reading

- [Using the ctx object](./the-ctx-object.md)
- [Scripting best practices](./best-practicies.md)
- [List of EKG events](./list-of-events.md)
