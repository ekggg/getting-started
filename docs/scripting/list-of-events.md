# List of EKG Events

EKG.gg widgets receive events through the `.register()` callback that represent
various activities happening in the stream.

Each event follows a consistent structure with a `type` field that identifies
the event, a `data` field which contains that type's information, a `timestamp`
field which is a Unix timestamp in milliseconds of when the event was fired, and
an `id` property which is unique to that event.

The only exceptions to this are the `TICK` and `RESIZE` events, which are not
real events but rather signals to your widget to update its state.

## Event Summary

| Event                      | Short Description                      |
| -------------------------- | -------------------------------------- |
| `ekg.chat.sent`            | A new chat message was sent.           |
| `ekg.event.deleted`        | A chat message was deleted.            |
| `ekg.user.moderated`       | A user was banned or timed out.        |
| `ekg.tip.sent`             | A tip, cheer, or super chat was sent.  |
| `ekg.reward.redeemed`      | A channel point reward was redeemed.   |
| `ekg.subscription.started` | A user subscribed for the first time.  |
| `ekg.subscription.renewed` | A subscription was renewed/celebrated. |
| `ekg.subscription.gifted`  | A subscription gift event occurred.    |
| `ekg.channel.followed`     | A user followed the channel.           |
| `ekg.audience.transferred` | A raid/viewer transfer occurred.       |
| `ekg.poll.updated`         | A poll was created, updated, or ended. |
| `RESIZE`                   | Widget dimensions changed.             |
| `TICK`                     | Periodic maintenance signal fired.     |

---

## Chat Events

**`ekg.chat.sent`** - Fired whenever a chat message is sent to the stream. This
is the most common event you'll work with and contains rich information about
the author and message content.

| Property          | Required | Type       | Description                                                 |
| ----------------- | -------- | ---------- | ----------------------------------------------------------- |
| `id`              | Yes      | string     | Unique identifier for this chat message                     |
| `userId`          | Yes      | string     | Unique identifier for the message author                    |
| `userDisplayName` | Yes      | string     | Display name of the message author                          |
| `message`         | Yes      | ChatNode[] | Array of rich-text nodes (text, emojis, mentions, links)    |
| `isBroadcaster`   | Yes      | boolean    | Whether the author is the channel broadcaster               |
| `isVip`           | Yes      | boolean    | Whether the author has VIP status                           |
| `isModerator`     | Yes      | boolean    | Whether the author is a channel moderator                   |
| `isSubscriber`    | Yes      | boolean    | Whether the author is subscribed to the channel             |
| `platform`        | Yes      | string     | Platform where the event originated ("twitch" or "youtube") |
| `raw`             | Yes      | object     | Raw event data from the original platform                   |

**`ekg.event.deleted`** - Triggered when a chat message is deleted by a
moderator or the platform.

| Property         | Required | Type   | Description                                                 |
| ---------------- | -------- | ------ | ----------------------------------------------------------- |
| `deletedEventId` | Yes      | string | ID of the event that was deleted                            |
| `platform`       | Yes      | string | Platform where the event originated ("twitch" or "youtube") |
| `raw`            | Yes      | object | Raw event data from the original platform                   |

**`ekg.user.moderated`** - Triggered when a user is banned or timed out,
indicating that all of their messages should be cleared from the widget.

| Property               | Required | Type   | Description                                                             |
| ---------------------- | -------- | ------ | ----------------------------------------------------------------------- |
| `userId`               | Yes      | string | ID of the banned user                                                   |
| `userDisplayName`      | Yes      | string | Display name of the banned user                                         |
| `moderatorId`          | No       | string | ID of the moderator who applied the moderation                          |
| `moderatorDisplayName` | No       | string | Display name of the moderator who applied the moderation                |
| `endsAt`               | No       | number | Unix timestamp (milliseconds) when timeout ends; null for permanent ban |
| `platform`             | Yes      | string | Platform where the event originated ("twitch" or "youtube")             |
| `raw`                  | Yes      | object | Raw event data from the original platform                               |

## Monetary Events

**`ekg.tip.sent`** - Fired when someone sends a monetary tip (Twitch bits or
YouTube Super Chat).

| Property          | Required | Type       | Description                                                 |
| ----------------- | -------- | ---------- | ----------------------------------------------------------- |
| `userId`          | Yes      | string     | Unique identifier for the tip sender                        |
| `userDisplayName` | Yes      | string     | Display name of the tip sender                              |
| `amountCents`     | Yes      | number     | Tip amount in cents (or bits for Twitch)                    |
| `currency`        | Yes      | string     | Currency code (e.g., "USD", "BITS")                         |
| `message`         | No       | ChatNode[] | Optional rich-text message attached to the tip              |
| `level`           | No       | number     | Tip level for color coding (0-7, higher = larger tip)       |
| `platform`        | Yes      | string     | Platform where the event originated ("twitch" or "youtube") |
| `raw`             | Yes      | object     | Raw event data from the original platform                   |

## Reward Events

**`ekg.reward.redeemed`** - Fired when a Twitch channel point reward is
redeemed.

_This event is currently emitted for Twitch only._

| Property          | Required | Type       | Description                                                 |
| ----------------- | -------- | ---------- | ----------------------------------------------------------- |
| `userId`          | Yes      | string     | ID of the user who redeemed the reward                      |
| `userDisplayName` | Yes      | string     | Display name of the user who redeemed the reward            |
| `message`         | No       | ChatNode[] | Optional rich-text message attached to the redemption       |
| `rewardId`        | Yes      | string     | Reward ID from Twitch                                       |
| `redeemedAt`      | Yes      | number     | Unix timestamp (milliseconds) when the reward was redeemed  |
| `platform`        | Yes      | string     | Platform where the event originated ("twitch" or "youtube") |
| `raw`             | Yes      | object     | Raw event data from the original platform                   |

## Subscription Events

**`ekg.subscription.started`** - Triggered when someone subscribes to the
channel for the first time.

| Property          | Required | Type   | Description                                                 |
| ----------------- | -------- | ------ | ----------------------------------------------------------- |
| `userId`          | Yes      | string | Unique identifier for the new subscriber                    |
| `userDisplayName` | Yes      | string | Display name of the new subscriber                          |
| `platform`        | Yes      | string | Platform where the event originated ("twitch" or "youtube") |
| `raw`             | Yes      | object | Raw event data from the original platform                   |

**`ekg.subscription.renewed`** - Fired when someone celebrates a subscription
milestone or renews their subscription.

| Property           | Required | Type       | Description                                                 |
| ------------------ | -------- | ---------- | ----------------------------------------------------------- |
| `userId`           | Yes      | string     | Unique identifier for the subscriber                        |
| `userDisplayName`  | Yes      | string     | Display name of the subscriber                              |
| `monthsSubscribed` | Yes      | number     | Total number of months subscribed                           |
| `message`          | No       | ChatNode[] | Optional rich-text message from the subscriber              |
| `platform`         | Yes      | string     | Platform where the event originated ("twitch" or "youtube") |
| `raw`              | Yes      | object     | Raw event data from the original platform                   |

**`ekg.subscription.gifted`** - Triggered when someone gifts subscriptions to
other users.

| Property               | Required | Type    | Description                                                            |
| ---------------------- | -------- | ------- | ---------------------------------------------------------------------- |
| `userId`               | No       | string  | Unique identifier for the gift giver (null when anonymous)             |
| `userDisplayName`      | No       | string  | Display name of the gift giver (null when anonymous)                   |
| `giftCount`            | Yes      | number  | Number of subscriptions gifted (1 for individual, N for community)     |
| `tier`                 | Yes      | string  | Subscription tier (e.g., "Tier 1", "Tier 2", "Tier 3")                 |
| `isAnonymous`          | Yes      | boolean | Whether the gifter chose to remain anonymous                           |
| `recipientId`          | No       | string  | Recipient ID for individual gifts (null for community gifts)           |
| `recipientDisplayName` | No       | string  | Recipient display name for individual gifts (null for community gifts) |
| `platform`             | Yes      | string  | Platform where the event originated ("twitch" or "youtube")            |
| `raw`                  | Yes      | object  | Raw event data from the original platform                              |

## Follow Events

**`ekg.channel.followed`** - Fired when someone follows the channel.

| Property          | Required | Type   | Description                                                 |
| ----------------- | -------- | ------ | ----------------------------------------------------------- |
| `userId`          | Yes      | string | Unique identifier for the new follower                      |
| `userDisplayName` | Yes      | string | Display name of the new follower                            |
| `followedAt`      | Yes      | number | Unix timestamp (milliseconds) when the follow occurred      |
| `platform`        | Yes      | string | Platform where the event originated ("twitch" or "youtube") |
| `raw`             | Yes      | object | Raw event data from the original platform                   |

## Audience Events

**`ekg.audience.transferred`** - Fired when another channel raids/transfers
viewers into the stream.

_This event is currently emitted for Twitch only._

| Property          | Required | Type   | Description                                                 |
| ----------------- | -------- | ------ | ----------------------------------------------------------- |
| `userId`          | Yes      | string | ID of the channel/user that sent viewers                    |
| `userDisplayName` | Yes      | string | Display name of the channel/user that sent viewers          |
| `viewerCount`     | Yes      | number | Number of viewers transferred                               |
| `platform`        | Yes      | string | Platform where the event originated ("twitch" or "youtube") |
| `raw`             | Yes      | object | Raw event data from the original platform                   |

## Poll Events

**`ekg.poll.updated`** - Fired when a poll is created, receives new votes, or
ends. This event is sent for each stage of the poll lifecycle, so you'll receive
multiple events for the same poll as it progresses.

| Property   | Required | Type         | Description                                                 |
| ---------- | -------- | ------------ | ----------------------------------------------------------- |
| `pollId`   | Yes      | string       | Unique identifier for the poll                              |
| `title`    | Yes      | string       | The poll question/title                                     |
| `isClosed` | Yes      | boolean      | Whether the poll has ended                                  |
| `options`  | Yes      | PollOption[] | Array of poll options with vote counts                      |
| `platform` | Yes      | string       | Platform where the event originated ("twitch" or "youtube") |
| `raw`      | Yes      | object       | Raw event data from the original platform                   |

### PollOption

| Property | Required | Type   | Description                         |
| -------- | -------- | ------ | ----------------------------------- |
| `title`  | Yes      | string | The title/text of the poll option   |
| `votes`  | Yes      | number | The number of votes for this option |

---

## System Events

In addition to platform events, EKG sends system events that help widgets manage
their internal state and respond to changes in their environment.

**`RESIZE`** - Fired when the widget's dimensions change.

| Property | Required | Type   | Description                            |
| -------- | -------- | ------ | -------------------------------------- |
| `width`  | Yes      | number | The new width of the widget in pixels  |
| `height` | Yes      | number | The new height of the widget in pixels |

**`TICK`** - Fired periodically for cleanup and maintenance tasks.

_The tick event has no properties_

### Usage Examples

```javascript
EKG.widget("MyWidget")
  .initialState((ctx) => ({
    messages: [],
    width: ctx.size.width,
    height: ctx.size.height,
    showCompactMode: ctx.size.width < 300,
  }))
  .register((event, state, ctx) => {
    switch (event.type) {
      case "RESIZE":
        // Update widget layout based on new dimensions
        return {
          ...state,
          width: event.data.width,
          height: event.data.height,
          showCompactMode: event.data.width < 300,
        };

      case "TICK":
        // Remove old messages after 30 seconds
        const messages = state.messages.filter(
          (msg) => ctx.now - msg.timestamp < 30_000,
        );
        return { ...state, messages };

      default:
        return state;
    }
  });
```

> [!NOTE]  
> System events do not include `platform` or `raw` properties since they
> originate from EKG itself, not from external streaming platforms.

---

## ChatNodes

Chat messages contain rich-text content represented as an array of `ChatNode`
objects. Each node has a `type` field that determines its structure:

### TextChatNode

Represents plain text content.

| Property | Required | Type   | Description      |
| -------- | -------- | ------ | ---------------- |
| `type`   | Yes      | string | Always "text"    |
| `text`   | Yes      | string | The text content |

### EmojiChatNode

Represents platform specific and custom emojis (from BTTV, FFZ, 7TV, etc.).

| Property   | Required | Type   | Description                              |
| ---------- | -------- | ------ | ---------------------------------------- |
| `type`     | Yes      | string | Always "emoji"                           |
| `id`       | Yes      | string | Unique identifier for the emoji          |
| `code`     | Yes      | string | The text code used to trigger this emoji |
| `authorId` | No       | string | ID of who created this emoji             |
| `src`      | No       | string | Download URL for the emoji image         |
| `srcSet`   | No       | string | Source set URL for the emoji image       |

### LinkChatNode

Represents clickable links with nested content.

| Property | Required | Type                              | Description                                                            |
| -------- | -------- | --------------------------------- | ---------------------------------------------------------------------- |
| `type`   | Yes      | string                            | Always "link"                                                          |
| `href`   | Yes      | string                            | The URL the link points to                                             |
| `nodes`  | Yes      | (TextChatNode \| EmojiChatNode)[] | Array of TextChatNode and EmojiChatNode objects representing link text |

### MentionChatNode

Represents user mentions (e.g., @username).

| Property               | Required | Type   | Description                            |
| ---------------------- | -------- | ------ | -------------------------------------- |
| `type`                 | Yes      | string | Always "mention"                       |
| `mentionedId`          | Yes      | string | The ID of the mentioned user           |
| `mentionedDisplayName` | Yes      | string | The display name of the mentioned user |

### Usage Recommendation

While you can directly access and modify ChatNode arrays, **we recommend using
the `{{> renderChat message}}` Handlebars helper in your templates instead**.
This helper properly renders the rich-text content with appropriate styling,
emoji images, clickable links, and mention formatting.

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
EKG.widget("BadgeWidget").register((event, state, _ctx) => {
  if (event.data.platform === "twitch" && event.type === "ekg.chat.sent") {
    // Access Twitch-specific badge information
    const badges = event.data.raw.badges;
    const userColor = event.data.raw.color;
    // Use badges and userColor as needed...
  }
  return state;
});
```

Use the `raw` property sparingly and only when the normalized event properties
don't meet your needs, as it couples your widget to specific platform
implementations.
