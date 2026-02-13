# Runtime CSS Features

EKG runtime adds a few CSS-specific behaviors that are easy to miss.

## CSS is templated

Your widget CSS is compiled as a Handlebars template before being applied.

Available values in CSS templates:

- `settings`
- `assets`

Example:

```css
.card {
  background-image: url("{{assets.background}}");
  color: {{settings.textColor}};
}
```

## `ekg-removed` exit transitions

You can keep removed elements in the DOM long enough for transitions to finish.

Usage:

```hbs
<div class="message" ekg-removed="fade-out slide-down">
  ...
</div>
```

When the element is removed from state:

1. Runtime adds classes from `ekg-removed`
2. Runtime waits for transition end/cancel
3. Runtime removes the element

If no transition starts, runtime removes the element after a short fallback delay.

## `ekg-size` dynamic sizing variables

Add `ekg-size` to an element to receive size CSS variables after each render:

- `--width`
- `--height`

Example:

```css
.responsive {
  font-size: clamp(14px, calc(var(--width) / 20), 36px);
}
```

```hbs
<div class="responsive" ekg-size>
  {{title}}
</div>
```

## Audio volume handling

If template output includes an `<audio volume="N">`, runtime maps `N` (0-100)
to the DOM audio volume range (0-1) and starts playback when ready.

This is used by the `playAudio` partial, but works for direct `<audio>` nodes too.

## Isolation and CSP notes

Widgets render inside a sandboxed iframe with strict CSP.

Practical implications:

- styles are isolated to your widget
- scripts in template output are blocked
- network exfiltration via arbitrary resource loading is restricted
- use uploaded assets/CDN-backed files for images/fonts/media
