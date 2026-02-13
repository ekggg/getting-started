# Dealing with Time

Time is a critical aspect of many stream widgets, from displaying timestamps to
implementing timeouts and animations. EKG.gg provides several approaches for
working with time in your widgets, each designed to work within the secure,
sandboxed environment.

## Working with Unix timestamps only

The EKG.gg widget VM does not expose the JavaScript `Date` global for security
reasons. All time values are represented as Unix timestamps in milliseconds,
including `ctx.now`, event timestamps, and any time-related data in your
widget state. Design your time logic around these numeric values rather than
attempting to use Date objects or helpers.

## Using `ctx.now` for current time

The most reliable way to get the current time in your widget is through the
`ctx.now` property, which provides a Unix timestamp in milliseconds. This
timestamp is guaranteed to be consistent across all widget executions and
represents the time when the event was processed. Unlike the browser's
`Date.now()`, which isn't available in the sandboxed environment, `ctx.now`
ensures your widget has access to accurate timing information for calculating
durations, implementing timeouts, or displaying timestamps.

## Working without Date helpers

Since the `Date` constructor and methods aren't available, you'll need to
perform time calculations using basic arithmetic on Unix timestamps:

```javascript
// Calculate elapsed time (duration)
const elapsedMs = ctx.now - startTimestamp;
const elapsedSeconds = Math.floor(elapsedMs / 1000);
const elapsedMinutes = Math.floor(elapsedSeconds / 60);

// Check if something happened within the last hour
const oneHourMs = 60 * 60 * 1000;
const isRecent = ctx.now - eventTimestamp < oneHourMs;

// Format relative time display
function formatTimeAgo(timestamp, now) {
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  return `${diffHours}h ago`;
}

// Schedule something for the future
const fiveMinutesLater = ctx.now + 5 * 60 * 1000;
if (ctx.now >= scheduledTime) {
  // Time to execute the scheduled action
}
```

## Implementing time-based logic

When implementing features like message timeouts or fade-out animations, store
timestamp information in your widget's state and calculate elapsed time using
the difference between `ctx.now` and your stored timestamps. For example, to
hide messages after 30 seconds, you might store `{ message: "Hello", shownAt:
ctx.now }` and then check if `ctx.now - messageState.shownAt > 30000` in
subsequent event handlers. This approach works reliably because `ctx.now`
advances consistently with each event.

## Working without timers

Traditional JavaScript timing functions like `setTimeout` and `setInterval`
aren't available in the EKG.gg environment for security reasons. Instead,
design your time-based logic to be event-driven by checking elapsed time
whenever your `.register()` callback is called. This pattern actually results
in more efficient widgets since time calculations only happen when events
occur, rather than continuously running in the background. Consider using
techniques like storing "next action time" in your state and comparing it
against `ctx.now` on each event to trigger time-based behaviors.

## Using the `TICK` event for cleanup

EKG.gg provides a special `TICK` system event that's fired periodically to
help widgets perform cleanup and maintenance tasks. This event is ideal for
removing expired data, cleaning up old messages, or performing other
time-based maintenance without relying on traditional timers. When handling
the `TICK` event, check `ctx.now` against your stored timestamps to determine
what needs to be cleaned up or updated.

```javascript
EKG.widget("TimedMessages")
  .initialState(() => ({ messages: [] }))
  .register((event, state, ctx) => {
    switch (event.type) {
      case "TICK":
        // Remove messages older than 30 seconds
        const messages = state.messages.filter(
          (msg) => ctx.now - msg.timestamp < 30_000,
        );
        return { ...state, messages };

      default:
        return state;
    }
  });
```
