# Widget Runtime Lifecycle

This page documents the runtime behavior of widgets in EKG itself.

## Registration chain

A widget script should register through the chain API:

```js
EKG.widget("MyWidget")
  .initialState((ctx, initialData) => ({ ... }))
  .persist((state) => ({ ... }))
  .restore((state, persisted) => ({ ... }))
  .register((event, state, ctx) => state);
```

Order at startup:

1. Script executes in QuickJS
2. `.initialState()` runs (if provided)
3. `.restore()` runs (if provided)
4. `.register()` handler receives events

`.persist()` and `.restore()` are optional but must appear in that order when used.

## `initialData`

`initialState(ctx, initialData)` receives cached "latest" stream info:

- `initialData.latestFollower`
- `initialData.latestSubscriber`
- `initialData.latestTip`

These are useful for bootstrapping alert widgets before the next live event arrives.

## Event flow

Widgets receive:

- platform events (chat, tip, follow, subscription, etc.)
- `RESIZE` when container size changes
- `TICK` heartbeat events

Runtime details:

- `TICK` is currently emitted every 100ms
- `RESIZE` payload is `{ width, height }` in `event.data`

## State replacement rules

The event handler is called as:

```js
(event, state, ctx) => newState
```

State update behavior:

- returning a truthy value replaces current state
- returning a falsy value keeps previous state

This means `null`, `undefined`, `false`, `0`, and `""` all keep the old state.

## Persistence cadence

In EKG runtime, widget persisted state is requested:

- every 15 seconds while mounted
- once more when widget is destroyed/unmounted

Use `.persist()` to keep payloads small and `.restore()` to handle missing fields.

## Deterministic context values

`ctx` includes runtime values:

- `ctx.now`: current timestamp at event processing time
- `ctx.random()`: seeded PRNG

Seeding behavior:

- `initialState` context is seeded by widget name
- event contexts are seeded by event id

This enables stable replay/debug behavior for randomness-dependent widgets.

## Hot reload and replay

For re-initialization, EKG tracks a rolling history of recent non-`TICK` events
and replays them into widgets. Keep handlers pure so replay behaves predictably.
