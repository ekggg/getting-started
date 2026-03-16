# List of Asset Types

Widget assets are defined in `manifest.json` under `assets`. These are static
files bundled with a widget version (not user-configurable settings).

Each asset entry supports:

- `type` (required): `image`, `audio`, `font`, or `video`
- `file` (required): filename in your widget directory

## Runtime values (`ctx.assets`)

At runtime, `ctx.assets.<key>` is always a string, but the meaning depends on
type:

- `image` -> URL string
- `audio` -> URL string
- `font` -> `font-family` name string (not a file URL)
- `video` -> URL string

## `image`

```json
{
  "logo": {
    "type": "image",
    "file": "logo.png"
  }
}
```

Runtime value:

- `ctx.assets.logo` is a URL you can use in `src`, `background-image`, etc.

## `audio`

```json
{
  "alertSound": {
    "type": "audio",
    "file": "alert.mp3"
  }
}
```

Runtime value:

- `ctx.assets.alertSound` is a URL you can use in
  `<audio src="{{ assets.alertSound }}">` or
  `{{> playAudio src=assets.alertSound }}`.

## `font`

```json
{
  "displayFont": {
    "type": "font",
    "file": "my-font.otf"
  }
}
```

Runtime value:

- `ctx.assets.displayFont` is a `font-family` value.
- Use it directly in CSS, for example `font-family: {{ assets.displayFont }}`.

## `video`

```json
{
  "introClip": {
    "type": "video",
    "file": "intro.mp4"
  }
}
```

Runtime value:

- `ctx.assets.introClip` is a URL you can use in
  `<video src="{{ assets.introClip }}">`.
