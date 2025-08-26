# List of EKG.gg View Helpers

EKG.gg provides several built-in Handlebars helpers to make building widget
templates easier and more powerful. These helpers are automatically available
in all widget templates and handle common tasks like conditional rendering,
loops, and formatting.

## Conditional Helpers

**`{{#eq a b}}`** - Renders the block if `a` equals `b` (using loose equality).
Use the `{{else}}` block for the false case.

```hbs
{{#eq role "broadcaster"}}💻{{else}}👤{{/eq}}
```
*Input: `role = "broadcaster"` → Output: `💻`*  
*Input: `role = "viewer"` → Output: `👤`*

**`{{#in value option1 option2 ...}}`** - Renders the block if `value` is found
in the list of options. Useful for checking if a value matches any of several
possibilities.

```hbs
{{#in userType "mod" "vip" "subscriber"}}⭐{{else}}👤{{/in}}
```
*Input: `userType = "mod"` → Output: `⭐`*  
*Input: `userType = "viewer"` → Output: `👤`*

## Utility Helpers

**`{{#repeat count}}`** - Repeats the enclosed block `count` number of times.
Perfect for creating visual indicators based on numeric values.

```hbs
{{#repeat subTier}}❤️{{/repeat}}
```
*Input: `subTier = 3` → Output: `❤️❤️❤️`*  
*Input: `subTier = 0` → Output: `` (empty)*

## Formatting Helpers

**`{{formatDate date [format]}}`** - Formats dates using internationalized
formatting. Format options include "short", "medium", "long", and "full".
Defaults to "short" format.

```hbs
{{formatDate createdAt "medium"}}
```
*Input: `createdAt = 1724686200000` → Output: `Aug 26, 2024`*

**`{{formatTime date [format]}}`** - Formats times using internationalized
formatting. Same format options as formatDate but focuses on time display.

```hbs
{{formatTime messageTime "short"}}
```
*Input: `messageTime = 1724686200000` → Output: `3:30 PM`*

**`{{formatAgo date [style]}}`** - Shows relative time (e.g., "2 hours ago").
Style options are "short", "long", or "narrow".

```hbs
{{formatAgo messageTime "short"}}
```

**`{{formatNumber number [notation]}}`** - Formats numbers with
locale-appropriate separators. Notation options include "standard",
"scientific", "engineering", and "compact".

```hbs
{{formatNumber viewCount "compact"}}
```
*Input: `viewCount = 1234567` → Output: `1.2M`*  
*Input: `viewCount = 1234` → Output: `1.2K`*

**`{{formatCurrency amount currency}}`** - Formats monetary amounts with proper
currency symbols and decimal places. Currency should be a 3-letter code like
"USD" or "EUR". Also has special handling for "BITS" currency.

```hbs
{{formatCurrency donationAmount "USD"}}
```
*Input: `donationAmount = 500, currency = "USD"` → Output: `$5`*
*Input: `donationAmount = 1000, currency = "BITS"` → Output: `1000 bits`*

## Built-in Partials

**`{{> renderChat chatNodes}}`** - Renders chat message content with proper
handling for emojis, mentions, links, and text. This partial automatically
handles escaping and styling for all supported chat node types. Pass an array
of chat nodes from your widget state.

```hbs
{{> renderChat message}}
```
*Input: Chat nodes with text, emoji, and mention → Output: `Hello <img data-type="emoji" src="..."/> <span data-type="mention">@streamer</span>!`*
