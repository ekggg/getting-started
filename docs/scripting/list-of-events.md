# List of EKG Events

EKG.gg widgets receive events through the `handleEvent` function that represent
various activities happening in the stream. 

Each event follows a consistent structure with a `type` field that identifies
the event, a `data` field which contains that type's information, a `timestamp`
field which is a unix timestamp in milliseconds of when the event was fired,
and an `id` property which is unique to that event.

---

## Chat Events

**`ekg.chat.sent`** - Fired whenever a chat message is sent to the stream. This
is the most common event you'll work with and contains rich information about
the author and message content.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `id` | Yes | string | Unique identifier for this chat message |
| `authorId` | Yes | string | Unique identifier for the message author |
| `authorDisplayName` | Yes | string | Display name of the message author |
| `message` | Yes | ChatNode[] | Array of rich-text nodes (text, emojis, mentions, links) |
| `isBroadcaster` | Yes | boolean | Whether the author is the channel broadcaster |
| `isVip` | Yes | boolean | Whether the author has VIP status |
| `isModerator` | Yes | boolean | Whether the author is a channel moderator |
| `isSubscriber` | Yes | boolean | Whether the author is subscribed to the channel |
| `platform` | Yes | string | Platform where the event originated ("twitch" or "youtube") |
| `raw` | Yes | object | Raw event data from the original platform |

**`ekg.message.deleted`** - Triggered when a chat message is deleted by a
moderator or the platform.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `deletedMessageId` | Yes | string | ID of the message that was deleted |
| `platform` | Yes | string | Platform where the event originated ("twitch" or "youtube") |
| `raw` | Yes | object | Raw event data from the original platform |

## Monetary Events

**`ekg.tip.sent`** - Fired when someone sends a monetary tip (Twitch bits or
YouTube Super Chat).

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `tipperId` | Yes | string | Unique identifier for the tipper |
| `tipperDisplayName` | Yes | string | Display name of the tipper |
| `amountCents` | Yes | number | Tip amount in cents (or bits for Twitch) |
| `currency` | Yes | string | Currency code (e.g., "USD", "BITS") |
| `message` | No | ChatNode[] | Optional rich-text message attached to the tip |
| `level` | No | number | Tip level for color coding (0-7, higher = larger tip) |
| `platform` | Yes | string | Platform where the event originated ("twitch" or "youtube") |
| `raw` | Yes | object | Raw event data from the original platform |

## Subscription Events  

**`ekg.subscription.started`** - Triggered when someone subscribes to the
channel for the first time.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `subscriberId` | Yes | string | Unique identifier for the new subscriber |
| `subscriberDisplayName` | Yes | string | Display name of the new subscriber |
| `platform` | Yes | string | Platform where the event originated ("twitch" or "youtube") |
| `raw` | Yes | object | Raw event data from the original platform |

**`ekg.subscription.renewed`** - Fired when someone celebrates a subscription
milestone or renews their subscription.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `subscriberId` | Yes | string | Unique identifier for the subscriber |
| `subscriberDisplayName` | Yes | string | Display name of the subscriber |
| `monthsSubscribed` | Yes | number | Total number of months subscribed |
| `message` | No | ChatNode[] | Optional rich-text message from the subscriber |
| `platform` | Yes | string | Platform where the event originated ("twitch" or "youtube") |
| `raw` | Yes | object | Raw event data from the original platform |

**`ekg.subscription.gifted`** - Triggered when someone gifts subscriptions to
other users.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `gifterId` | Yes | string | Unique identifier for the gift giver |
| `gifterDisplayName` | Yes | string | Display name of the gift giver |
| `giftCount` | Yes | number | Number of subscriptions gifted (1 for individual, N for community) |
| `tier` | Yes | string | Subscription tier (e.g., "Tier 1", "Tier 2", "Tier 3") |
| `isAnonymous` | Yes | boolean | Whether the gifter chose to remain anonymous |
| `recipientId` | No | string | Recipient ID for individual gifts (null for community gifts) |
| `recipientDisplayName` | No | string | Recipient display name for individual gifts (null for community gifts) |
| `platform` | Yes | string | Platform where the event originated ("twitch" or "youtube") |
| `raw` | Yes | object | Raw event data from the original platform |

## Follow Events

**`ekg.channel.followed`** - Fired when someone follows the channel.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `followerId` | Yes | string | Unique identifier for the new follower |
| `followerDisplayName` | Yes | string | Display name of the new follower |
| `followedAt` | Yes | number | Unix timestamp (seconds) when the follow occurred |
| `platform` | Yes | string | Platform where the event originated ("twitch" or "youtube") |
| `raw` | Yes | object | Raw event data from the original platform |

## Moderation Events

**`ekg.user.moderated`** - Triggered when a user is banned or timed out.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `moderatedUserId` | Yes | string | Unique identifier for the moderated user |
| `moderatedUserDisplayName` | Yes | string | Display name of the moderated user |
| `actionType` | Yes | string | Type of moderation action ("ban" or "timeout") |
| `durationSeconds` | No | number | Duration in seconds (null for permanent bans) |
| `platform` | Yes | string | Platform where the event originated ("twitch" or "youtube") |
| `raw` | Yes | object | Raw event data from the original platform |

## System Events

In addition to platform events, EKG sends system events that help widgets
manage their internal state and respond to changes in their environment.

**`RESIZE`** - Fired when the widget's dimensions change.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `width` | Yes | number | The new width of the widget in pixels |
| `height` | Yes | number | The new height of the widget in pixels |

**`TICK`** - Fired periodically for cleanup and maintenance tasks.

_The tick event has no properties_

### Usage Examples

```javascript
function handleEvent(event, state, ctx) {
  switch (event.type) {
    case "RESIZE":
      // Update widget layout based on new dimensions
      return {
        ...state,
        width: event.data.width,
        height: event.data.height,
        showCompactMode: event.data.width < 300
      };
      
    case "TICK":
      // Remove old messages after 30 seconds
      const messages = state.messages.filter(msg => 
        ctx.now - msg.timestamp < 30_000
      );
      return { ...state, messages };
      
    default:
      return state;
  }
}
```

> [!NOTE]
> System events do not include `platform` or `raw` properties since
> they originate from EKG itself, not from external streaming platforms.

---

## ChatNodes 

Chat messages contain rich-text content represented as an array of `ChatNode`
objects. Each node has a `type` field that determines its structure:

### TextChatNode

Represents plain text content.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `type` | Yes | string | Always "text" |
| `text` | Yes | string | The text content |

### EmojiChatNode

Represents platform specific and custom emojis (from BTTV, FFZ, 7TV, etc.).

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `type` | Yes | string | Always "emoji" |
| `id` | Yes | string | Unique identifier for the emoji |
| `code` | Yes | string | The text code used to trigger this emoji |
| `authorId` | No | string | ID of who created this emoji |
| `src` | No | string | Download URL for the emoji image |
| `srcSet` | No | string | Source set URL for the emoji image |

### LinkChatNode

Represents clickable links with nested content.

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `type` | Yes | string | Always "link" |
| `href` | Yes | string | The URL the link points to |
| `nodes` | Yes | (TextChatNode | EmojiChatNode)[] | Array of TextChatNode and EmojiChatNode objects representing the link text |

### MentionChatNode
Represents user mentions (e.g., @username).

| Property | Required | Type | Description |
|----------|----------|------|-------------|
| `type` | Yes | string | Always "mention" |
| `mentionedId` | Yes | string | The ID of the mentioned user |
| `mentionedDisplayName` | Yes | string | The display name of the mentioned user |

### Usage Recommendation

While you can directly access and modify ChatNode arrays, **we recommend using
the `{{> renderMessage message}}` Handlebars helper in your templates
instead**. This helper properly renders the rich-text content with appropriate
styling, emoji images, clickable links, and mention formatting.

## The `platform` and `raw` properties

Every EKG event includes two additional properties that provide access to
platform-specific information:

### `platform`

A string indicating which platform the event originated from. Currently
supported values:
- `"twitch"` - Events from Twitch
- `"youtube"` - Events from YouTube

### `raw`

An object containing the complete, unprocessed event data from the original
platform. This property is useful when you need to access platform-specific
features that aren't directly exposed by EKG's normalized event structure.

**When to use the `raw` property:**
- You need platform-specific data not available in the normalized event
- You want to implement platform-specific features or behavior
- You need access to additional metadata that varies between platforms

**Example usage:**
```javascript
function handleEvent(event) {
  if (event.platform === "twitch" && event.type === "ekg.chat.sent") {
    // Access Twitch-specific badge information
    const badges = event.raw.badges;
    const userColor = event.raw.color;
  }
}
```

Use the `raw` property sparingly and only when the normalized event properties
don't meet your needs, as it couples your widget to specific platform
implementations.
