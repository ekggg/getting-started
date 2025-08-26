# EKG.gg styling best practices

Writing effective CSS for EKG.gg widgets requires understanding the unique
environment where your styles will run and following patterns that make your
widgets both performant and maintainable.

## Target OBS compatibility

Your styles will ultimately run in OBS browser sources, which use an older
version of Chromium (version 128). This means you have access to most modern
CSS features, but should avoid cutting-edge properties that might not be
supported. Always test your widgets in OBS or Chrome 128 to ensure
compatibility, and use resources like CanIUse to verify feature support.

## Use CSS custom properties for customization

Keep your CSS organized and maintainable by using CSS custom properties (CSS
variables) for colors, spacing, and other repeated values. This makes it easy
for streamers to customize your widget through settings by using Handlebars
expressions in your CSS. For example, `:root { --primary-color: {{withFallback
settings.primaryColor "#ccc"}} }` allows users to customize colors while
providing sensible defaults.

## Leverage modern CSS features safely

Take advantage of modern CSS features that are well-supported, including CSS
nesting, CSS Grid, Flexbox, and the `oklab()` color space for better color
manipulation. Use `color-mix()` for creating color variations and gradients.
These features help create more sophisticated and visually appealing widgets
with less code.

## Remember iframe isolation

Your widgets run in isolated iframes, so you don't need to worry about CSS
specificity conflicts with other widgets. However, you should still use
meaningful class names and avoid overly generic selectors. Consider the
performance impact of your styles, especially for widgets that update
frequently like live chat displays.
