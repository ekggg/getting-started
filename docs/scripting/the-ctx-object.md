# Using the ctx Object

The context object (`ctx`) is your widget's gateway to information about its
runtime environment and user configuration. This object is passed to both your
`.initialState()` function and every `.register()` call, providing essential data
that your widget needs to function properly.

## Available properties

The `ctx` object contains several key properties that give your widget access
to its environment. The `settings` property contains all user-configured
settings for your widget, allowing users to customize behavior, colors, and
other preferences. The `assets` property provides access to developer-uploaded
images and other media files. The `now` property gives you the current
timestamp in milliseconds, essential for time-based functionality. The `size`
property contains the current dimensions of your widget on the page, and the
`random()` function provides seeded pseudorandom numbers for consistent
behavior.

## Accessing user settings

User settings are one of the most important aspects of the context object,
allowing your widgets to be customized by streamers. Access settings using
`ctx.settings.settingName`, where `settingName` matches the keys defined in
your widget's manifest file. For example, if you defined a setting called
`primaryColor`, you can access it with `ctx.settings.primaryColor`. Always
provide sensible defaults in your code since settings may be undefined if users
haven't configured them yet. The settings object is automatically validated
against your schema, so you can trust that the values will be of the correct
type.

## Working with assets

The `ctx.assets` object provides access to images and other media files you've
uploaded with your widget. Asset URLs are automatically generated and provided
under the keys you defined in your manifest file. For example, if you defined
an asset called `background-img` in your manifest, you can access its URL with
`ctx.assets["background-img"]`. These URLs are secure and optimized for
streaming use, so you can safely use them in your HTML templates or CSS without
worrying about external dependencies.

## Responsive widget sizing

The `ctx.size` property contains the current width and height of your widget
container, allowing you to create responsive layouts that adapt to different
screen sizes and OBS configurations. Access the dimensions with
`ctx.size.width` and `ctx.size.height`, both provided in pixels. Your widget
will automatically receive resize events when the container size changes,
giving you the opportunity to recalculate layouts or adjust content based on
available space. This is particularly important for widgets that need to work
well across different streaming setups and screen resolutions.

## Deterministic random numbers

The `ctx.random()` function provides seeded pseudorandom numbers that are
deterministic based on the current event ID and call number. Unlike
`Math.random()`, this function will return the same "random" value when called
with the same event context and sequence position. This deterministic behavior
is essential for maintaining consistent widget rendering across features like
event replay and time-travel debugging.

For example, if your widget uses random colors or positions during an event,
replaying that same event will produce identical visual results. This
consistency ensures that debugging sessions are reproducible and that widget
behavior remains predictable when events are processed multiple times.
