# EKG.gg markup best practices

Writing maintainable and performant Handlebars templates is crucial for
creating great widgets. EKG.gg's templating system is built on Handlebars with
some custom helpers and security restrictions that make your widgets both
powerful and safe.

## Keep templates simple and readable

Your templates should be easy to understand at a glance. Use meaningful class
names, break complex layouts into inline partials, and avoid deep nesting when
possible. Remember that someone (including future you) will need to maintain
this code. If you find yourself writing complex logic in your template,
consider moving that logic into your widget's state handling instead.

## Use inline partials for reusable components

When you have repeated markup patterns, create inline partials using
`{{#*inline "partialName"}}` to keep your templates DRY. This is especially
useful for list items, message components, or any UI element that appears
multiple times. Inline partials also help with performance since they're
compiled once and reused.

## Leverage EKG.gg's built-in helpers

EKG.gg provides several powerful helpers like `{{#eq}}`, `{{#in}}`,
`{{#repeat}}`, and formatting helpers for dates, numbers, and currencies. These
helpers are optimized and internationalized, so prefer them over creating your
own string manipulation logic. The `{{> renderChat}}` partial is specifically
designed for displaying chat messages with proper emoji, mention, and link
handling.

## No direct writing of HTML

EKG.gg has removed the `{{{ }}}` triple-bracket syntax to prevent XSS attacks,
so never try to output raw HTML strings from your state. Instead, structure
your state to work with Handlebars' built-in helpers and EKG.gg's provided
helpers.
