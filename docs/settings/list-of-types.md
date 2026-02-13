# List of Setting Types

Widget settings are defined in your `manifest.json` under `settings`.

All setting entries support:

- `type` (required)
- `name` (required)
- `description` (optional)

## String

```json
{
  "type": "string",
  "name": "Title",
  "default": "Recent Follows",
  "choices": {
    "Recent Follows": "Recent Follows",
    "New Followers": "New Followers"
  }
}
```

Fields:

- `default` string (optional)
- `choices` object mapping value -> label (optional)

## String Array

```json
{
  "type": "string_array",
  "name": "Blocked Words",
  "default": ["spoiler", "leak"]
}
```

Fields:

- `default` string[] (optional)

## Integer

```json
{
  "type": "integer",
  "name": "Message Limit",
  "default": 20,
  "min": 1,
  "max": 100,
  "choices": {
    "10": "Small",
    "20": "Medium",
    "50": "Large"
  }
}
```

Fields:

- `default` integer (optional)
- `min` integer (optional)
- `max` integer (optional)
- `choices` object mapping value -> label (optional)

## Integer Array

```json
{
  "type": "integer_array",
  "name": "Thresholds",
  "default": [100, 500, 1000],
  "min": 1,
  "max": 100000
}
```

Fields:

- `default` integer[] (optional)
- `min` integer applied per item (optional)
- `max` integer applied per item (optional)

## Decimal

```json
{
  "type": "decimal",
  "name": "Scale",
  "default": 1.25,
  "min": 0.5,
  "max": 3,
  "choices": {
    "1": "Normal",
    "1.25": "Large",
    "1.5": "XL"
  }
}
```

Fields:

- `default` number (optional)
- `min` number (optional)
- `max` number (optional)
- `choices` object mapping value -> label (optional)

## Decimal Array

```json
{
  "type": "decimal_array",
  "name": "Opacity Stops",
  "default": [0.2, 0.5, 1],
  "min": 0,
  "max": 1
}
```

Fields:

- `default` number[] (optional)
- `min` number applied per item (optional)
- `max` number applied per item (optional)

## Boolean

```json
{
  "type": "boolean",
  "name": "Show Badges",
  "default": true
}
```

Fields:

- `default` boolean (optional)

## Color

```json
{
  "type": "color",
  "name": "Accent",
  "default": "#60a5fa",
  "choices": {
    "#60a5fa": "Blue",
    "#f472b6": "Pink",
    "#34d399": "Green"
  }
}
```

Fields:

- `default` hex color string (optional)
- `choices` object mapping value -> label (optional)

Accepted format is hex color (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`).

## Color Array

```json
{
  "type": "color_array",
  "name": "Palette",
  "default": ["#ff0000", "#00ff00", "#0000ff"]
}
```

Fields:

- `default` hex color string[] (optional)

## Font

```json
{
  "type": "font",
  "name": "Font",
  "default": "Inter",
  "custom": {
    "my-font.otf": "My Font"
  }
}
```

Fields:

- `default` string (optional)
- `custom` object mapping uploaded asset filename -> display label (optional)

At runtime the selected value exposed in `ctx.settings` is a string.

## Image

```json
{
  "type": "image",
  "name": "Background Image",
  "default": "bg.png"
}
```

Fields:

- `default` uploaded image filename (optional)

## Audio

```json
{
  "type": "audio",
  "name": "Alert Sound",
  "default": "alert.wav"
}
```

Fields:

- `default` uploaded audio filename (optional)

## Runtime exposure

Configured values are available in all three widget surfaces:

- Script: `ctx.settings`
- Template: `{{settings.someKey}}`
- CSS template: `{{settings.someKey}}`

In TypeScript projects, `ekg.d.ts` is generated from your manifest, giving typed
`EKG.WidgetSettings` and `EKG.WidgetAssets`.
