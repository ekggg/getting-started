# List of EKG.gg View Helpers

EKG.gg provides several built-in Handlebars helpers to make building widget
templates easier and more powerful. These helpers are automatically available in
all widget templates and handle common tasks like conditional rendering, loops,
and formatting.

## Template context

Every render receives:

- widget `state`
- `settings`
- `assets`

So you can do both `{{count}}` and `{{settings.theme}}` in the same template.

## Conditional Helpers

**`{{#eq a b}}`** - Renders the block if `a` equals `b` (using loose equality).
Use the `{{else}}` block for the false case.

```hbs
{{#eq role "broadcaster"}}💻{{else}}👤{{/eq}}
```

_Input: `role = "broadcaster"` → Output: `💻`_

_Input: `role = "viewer"` → Output: `👤`_

**`{{#in value option1 option2 ...}}`** - Renders the block if `value` is found
in the list of options. Useful for checking if a value matches any of several
possibilities.

```hbs
{{#in userType "mod" "vip" "subscriber"}}⭐{{else}}👤{{/in}}
```

_Input: `userType = "mod"` → Output: `⭐`_

_Input: `userType = "viewer"` → Output: `👤`_

## Utility Helpers

**`{{#repeat count}}`** - Repeats the enclosed block `count` number of times.
Perfect for creating visual indicators based on numeric values.

```hbs
{{#repeat subTier}}❤️{{/repeat}}
```

_Input: `subTier = 3` → Output: `❤️❤️❤️`_

_Input: `subTier = 0` → Output: `` (empty)_

**`{{concat a b c ...}}`** - Concatenates values into one string.

```hbs
{{concat "Hello, " username "!"}}
```

_Input: `username = "EKG"` → Output: `Hello, EKG!`_

**`{{toJSON value}}`** - Pretty-prints JSON (2-space indentation). Useful for
debugging.

```hbs
<pre>{{toJSON settings}}</pre>
```

## Formatting Helpers

**`{{formatDate date [format]}}`** - Formats dates using internationalized
formatting. Format options include "short", "medium", "long", and "full".
Defaults to "short" format.

```hbs
{{formatDate createdAt "medium"}}
```

_Input: `createdAt = 1724686200000` → Output: `Aug 26, 2024`_

**`{{formatTime date [format]}}`** - Formats times using internationalized
formatting. Same format options as formatDate but focuses on time display.

```hbs
{{formatTime messageTime "short"}}
```

_Input: `messageTime = 1724686200000` → Output: `3:30 PM`_

**`{{formatAgo date [style]}}`** - Shows relative time (e.g., "2 hours ago").
Style options are "short", "long", or "narrow".

```hbs
{{formatAgo messageTime "short"}}
```

_Input: `messageTime = Date.now() - 2 * 60 * 60 * 1000` → Output: `2 hr. ago`_

**`{{formatNumber number [notation]}}`** - Formats numbers with
locale-appropriate separators. Notation options include "standard",
"scientific", "engineering", and "compact".

```hbs
{{formatNumber viewCount "compact"}}
```

_Input: `viewCount = 1234567` → Output: `1.2M`_

_Input: `viewCount = 1234` → Output: `1.2K`_

**`{{formatCurrency amount currency}}`** - Formats monetary amounts with proper
currency symbols and decimal places. Currency should be a 3-letter code like
"USD" or "EUR". Also has special handling for "BITS" currency.

```hbs
{{formatCurrency donationAmount "USD"}}
```

_Input: `donationAmount = 500, currency = "USD"` → Output: `$5`_

_Input: `donationAmount = 1000, currency = "BITS"` → Output: `1000 bits`_

## Built-in Partials

**`{{> renderChat chatNodes}}`** - Renders chat message content with proper
handling for emojis, mentions, links, and text. This partial automatically
handles escaping and styling for all supported chat node types. Pass an array of
chat nodes from your widget state.

Rendered nodes include useful attributes for use in your CSS:

- links: `data-type="link"`
- emoji: `data-type="emoji"`, `data-emojiid="..."`
- mention: `data-type="mention"`, `data-userid="..."`

```hbs
{{> renderChat message}}
```

_Input: Chat nodes with text, emoji, and mention → Output:
`Hello <img data-type="emoji" src="..."/> <span data-type="mention">@streamer</span>!`_

**`{{> playAudio audio}}`** - Renders a hidden `<audio>` element.

Supported fields:

- `src` (required)
- `loop` (optional)
- `volume` (optional 0-100)

```hbs
{{! Given state.audio = { src: assets.alert, loop: false, volume: 80 } }}
{{> playAudio audio}}
```

## EKG Custom Attributes

**`ekg-removed`** - Adds classes to an element right before it is removed, to
support exit transitions.

When the element is about to be removed:

1. EKG adds classes from `ekg-removed`
2. EKG waits for transition end/cancel
3. EKG removes the element

If no transition starts, EKG removes the element after a short fallback delay.

```hbs
<div class="message" ekg-removed="fade-out slide-down">
  ...
</div>
```

**`ekg-size`** - Adds `--width` and `--height` CSS variables after each render.

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

**`<audio volume="N">`** - Sets audio volume to `N` (0-100) after the audio is
ready.

```hbs
<audio src="{{assets.alert}}" volume="80"></audio>
```
