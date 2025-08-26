# Scripting best practices

Writing effective event handlers is crucial for creating responsive and
maintainable widgets. The `handleEvent` function is the heart of your widget's
functionality, so following these best practices will ensure your widgets
perform well and are easy to debug.

## Keep it pure and predictable

Your `handleEvent` function should be a pure function that follows the pattern
`state + event = newState`. This means the function should not have side
effects and should always produce the same output given the same inputs. Avoid
modifying global variables or performing any operations that depend on external
state. This predictability makes your widgets extremely easy to test and
enables powerful debugging features like time-travel debugging.

## Always return new state objects

EKG.gg detects state changes by comparing object references, so you must return
a new state object when you want to trigger a re-render. Avoid mutating the
existing state directly with operations like `state.count++` or
`state.messages.push(newMessage)`. Instead, use the spread operator or other
immutable update patterns: `return { ...state, count: state.count + 1 }` or
`return { ...state, messages: [...state.messages, newMessage] }`. This ensures
your widget will re-render when expected.

## Handle unknown event types gracefully

Your widget will receive many different event types, and new event types may be
added over time. Always include a default case in your event handler that
returns the current state unchanged for unknown event types. This prevents your
widget from breaking when new events are introduced to the platform. Structure
your handlers using switch statements with explicit default cases to make this
pattern clear and maintainable.

## Sometime you need to optimize for performance

Remember that your `handleEvent` function will be called frequently as events
stream in. Keep your logic efficient and avoid expensive operations like deep
array searches or complex calculations on every event. Consider caching
computed values in your state or only updating specific parts of your state
when relevant events occur.
