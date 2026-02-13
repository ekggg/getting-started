# Enter and exit animations

Creating smooth enter and exit animations for your EKG.gg widgets enhances the
viewer experience and helps draw attention to important events like new
donations, chat messages, or alerts. Since widgets run in iframe environments,
you have full control over animations without worrying about conflicts with
other widgets on the page.

## Use CSS transitions and keyframes

CSS transitions and animations work perfectly in EKG.gg widgets. Use CSS
`@keyframes` for complex animations and `transition` properties for simple
state changes. For enter animations, consider using `transform` properties like
`translateY()` or `scale()` combined with `opacity` changes for smooth,
performant effects. Remember that animating `transform` and `opacity`
properties is more performant than animating layout properties like `width` or
`height`.

## Coordinate exit animations with state

For exit animations, you'll need to coordinate between your widget's JavaScript
state management and CSS without using JavaScript timeouts (which aren't
available in the VM). Instead of using `setTimeout`, store timestamps in your
state and use the `TICK` event or subsequent events to check elapsed time. For
example, when triggering an exit animation, store the animation start time and
duration in your state, then remove the item once enough time has passed based
on `ctx.now`.

## Implement time-based removal patterns

Since `setTimeout` isn't available, use event-driven patterns for animation
cleanup. Store animation metadata like `{ item: data, exitingAt: ctx.now,
exitDuration: 300 }` in your state, then check during each event if `ctx.now -
exitingAt > exitDuration` to determine when to actually remove items. This
ensures animations complete before elements disappear from the DOM.

## Keep animations purposeful

Keep animations short and purposeful - typically 200-500ms for enter/exit
effects. Consider that streamers may have many widgets active simultaneously,
so overly long or distracting animations can become overwhelming. Test your
animations at different speeds and consider providing settings to let streamers
adjust animation duration or disable them entirely for accessibility reasons.

## Runtime hooks that make this easier

For production-grade enter/exit behavior, use runtime features described in
`./runtime-css-features.md`:

- `ekg-removed` attribute for transition-aware removal
- `ekg-size` attribute for width/height CSS variables
