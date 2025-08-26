# Understanding the VM

EKG.gg runs widget JavaScript in a secure virtual machine (VM) built on
QuickJS, a lightweight JavaScript engine. This architecture ensures that
third-party widget code cannot harm streamers' computers or interfere with
other widgets, while still providing the flexibility developers need to create
powerful streaming experiences.

## Security through isolation

The QuickJS virtual machine creates a completely isolated environment where
your widget code executes. Unlike running code directly in the browser, the VM
has no access to the DOM, network requests, file system, or browser APIs that
could be exploited maliciously. Your widget cannot make HTTP requests, access
local storage, manipulate other widgets, or perform any operations outside of
its designated sandbox. This isolation protects streamers from potentially
malicious code while ensuring that widgets can't accidentally interfere with
each other or the broader EKG.gg platform.

## Available javascript features

While the VM provides a secure environment, it still supports core ECMAScript
features that widget developers need. You have access to standard ECMAScript
data types, control structures, functions, objects, and arrays. Modern features
like arrow functions, destructuring, template literals, and the spread operator
all work as expected. The VM includes essential globals like `Math` (without
the security-sensitive `Math.random()`), and `console` for logging. However,
browser-specific APIs like `fetch`, `XMLHttpRequest`, `localStorage`, or DOM
manipulation methods are intentionally unavailable.

## Seeded random numbers for consistency

The `ctx.random()` function provides pseudorandom numbers that are seeded based
on the current event, ensuring reproducible behavior. This is particularly
useful when you need time-based randomness that remains consistent during
development and debugging. Unlike browser's `Math.random()`, which isn't
available in the VM, `ctx.random()` generates predictable sequences that make
your widgets easier to test and debug while still providing the randomness you
need for features like random animations or varied display timings.

## Performance and limitations

The QuickJS VM is designed to be fast and lightweight, but there are some
performance considerations to keep in mind. Complex computations or large data
manipulations may run slower than they would in a native browser environment.
The VM also has memory limitations to prevent runaway scripts from consuming
excessive resources. These constraints encourage writing efficient, focused
widget code that processes events quickly and maintains reasonable state sizes.
Most typical widget use cases processing chat messages, updating counters,
managing simple animations perform excellently within these boundaries.
