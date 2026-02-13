# List of EKG.gg View Helpers

EKG.gg widgets use Handlebars templates with built-in helpers and partials.

## Template context

Every render receives:

- widget `state`
- `settings`
- `assets`

So you can do both `{{count}}` and `{{settings.theme}}` in the same template.

## Conditional helpers

### `{{#eq a b}}...{{else}}...{{/eq}}`

Renders the block when `a == b` (loose equality).

### `{{#in value option1 option2 ...}}...{{else}}...{{/in}}`

Renders the block when `value` appears in the provided options.

## Utility helpers

### `{{#repeat count}}...{{/repeat}}`

Repeats the block `count` times.

### `{{concat a b c ...}}`

Concatenates values into one string.

### `{{toJSON value}}`

Pretty-prints JSON (2-space indentation). Useful for debugging in devkit.

## Formatting helpers

Formatting uses locale-aware Intl formatters.

Locale source:

- `settings.locale` when it exists and is a string
- otherwise `navigator.language`

### `{{formatDate date [style]}}`

Date formatter. `style`: `short` (default), `medium`, `long`, `full`.

### `{{formatTime date [style]}}`

Time formatter. `style`: `short` (default), `medium`, `long`, `full`.

### `{{formatAgo date [style]}}`

Relative formatter. `style`: `short` (default), `long`, `narrow`.

### `{{formatNumber number [notation]}}`

Number formatter. `notation`: `standard` (default), `scientific`,
`engineering`, `compact`.

### `{{formatCurrency amount currency}}`

Formats monetary amounts.

- `amount` should be integer minor units from events (ex: cents)
- `currency` should be a 3-letter code (ex: `USD`)
- `BITS` has special rendering: `N bits`

## Built-in partials

### `{{> renderChat chatNodes}}`

Renders chat nodes (`text`, `emoji`, `mention`, `link`) safely.

Rendered nodes include useful attributes:

- links: `data-type="link"`
- emoji: `data-type="emoji"`, `data-emojiid="..."`
- mention: `data-type="mention"`, `data-userid="..."`

### `{{> playAudio audio}}`

Renders a hidden `<audio>` element.

Expected shape:

```hbs
{{! Given state.audio = { src: assets.alert, loop: false, volume: 80 } }}
{{> playAudio audio}}
```

Supported fields:

- `src` (required)
- `loop` (optional)
- `volume` (optional 0-100)

## Notes

- EKG wraps rendered template output in a root `<div>` internally.
- CSS files are also Handlebars templates and can read `settings` and `assets`.
