const ANIMATION_DURATION = 500;

type Supporter = {
  name: string;
  timestamp: number;
  animatingUntil: number;
  isAnimating: boolean;
};

type TipSupporter = Supporter & {
  amount: number;
  currency: string;
};

type GiftSupporter = Supporter & {
  giftCount: number;
  tier: string;
  detail: string;
};

type ResubSupporter = Supporter & {
  months: number;
  detail: string;
};

type State = {
  latestFollower: Supporter | null;
  latestSubscriber: Supporter | null;
  latestTip: TipSupporter | null;
  latestGiftSub: GiftSupporter | null;
  latestResub: ResubSupporter | null;
};

function updateAnimationState<T extends Supporter>(
  supporter: T | null,
  now: number
): T | null {
  if (!supporter) return null;
  const isAnimating = now < supporter.animatingUntil;
  if (isAnimating === supporter.isAnimating) return supporter;
  return { ...supporter, isAnimating };
}

EKG.widget("LatestSupporters")
  .initialState<State>((ctx, initialData) => ({
    latestFollower: initialData.latestFollower
      ? {
          name: initialData.latestFollower.data.followerDisplayName,
          timestamp: initialData.latestFollower.data.followedAt,
          animatingUntil: ctx.now + ANIMATION_DURATION,
          isAnimating: true,
        }
      : null,
    latestSubscriber: initialData.latestSubscriber
      ? {
          name: initialData.latestSubscriber.data.subscriberDisplayName,
          timestamp: initialData.latestSubscriber.timestamp,
          animatingUntil: ctx.now + ANIMATION_DURATION,
          isAnimating: true,
        }
      : null,
    latestTip: initialData.latestTip
      ? {
          name: initialData.latestTip.data.tipperDisplayName,
          timestamp: initialData.latestTip.timestamp,
          amount: initialData.latestTip.data.amountCents,
          currency: initialData.latestTip.data.currency,
          animatingUntil: ctx.now + ANIMATION_DURATION,
          isAnimating: true,
        }
      : null,
    latestGiftSub: null,
    latestResub: null,
  }))
  .register((event, state, ctx) => {
    switch (event.type) {
      case "ekg.channel.followed": {
        const isNew =
          !state.latestFollower ||
          state.latestFollower.name !== event.data.followerDisplayName;
        return {
          ...state,
          latestFollower: {
            name: event.data.followerDisplayName,
            timestamp: event.data.followedAt,
            animatingUntil: isNew
              ? ctx.now + ANIMATION_DURATION
              : state.latestFollower?.animatingUntil ?? 0,
            isAnimating: isNew,
          },
        };
      }

      case "ekg.subscription.started": {
        const isNew =
          !state.latestSubscriber ||
          state.latestSubscriber.name !== event.data.subscriberDisplayName;
        return {
          ...state,
          latestSubscriber: {
            name: event.data.subscriberDisplayName,
            timestamp: event.timestamp,
            animatingUntil: isNew
              ? ctx.now + ANIMATION_DURATION
              : state.latestSubscriber?.animatingUntil ?? 0,
            isAnimating: isNew,
          },
        };
      }

      case "ekg.tip.sent": {
        const isNew =
          !state.latestTip ||
          state.latestTip.name !== event.data.tipperDisplayName ||
          state.latestTip.timestamp !== event.timestamp;
        return {
          ...state,
          latestTip: {
            name: event.data.tipperDisplayName,
            timestamp: event.timestamp,
            amount: event.data.amountCents,
            currency: event.data.currency,
            animatingUntil: isNew
              ? ctx.now + ANIMATION_DURATION
              : state.latestTip?.animatingUntil ?? 0,
            isAnimating: isNew,
          },
        };
      }

      case "ekg.subscription.gifted": {
        const gifterName = event.data.isAnonymous
          ? "Anonymous"
          : event.data.gifterDisplayName;
        const isNew =
          !state.latestGiftSub ||
          state.latestGiftSub.name !== gifterName ||
          state.latestGiftSub.timestamp !== event.timestamp;
        const giftCount = event.data.giftCount;
        return {
          ...state,
          latestGiftSub: {
            name: gifterName,
            timestamp: event.timestamp,
            giftCount,
            tier: event.data.tier,
            detail: giftCount + " gifted",
            animatingUntil: isNew
              ? ctx.now + ANIMATION_DURATION
              : state.latestGiftSub?.animatingUntil ?? 0,
            isAnimating: isNew,
          },
        };
      }

      case "ekg.subscription.renewed": {
        const isNew =
          !state.latestResub ||
          state.latestResub.name !== event.data.subscriberDisplayName ||
          state.latestResub.timestamp !== event.timestamp;
        const months = event.data.monthsSubscribed;
        return {
          ...state,
          latestResub: {
            name: event.data.subscriberDisplayName,
            timestamp: event.timestamp,
            months,
            detail: months + " months",
            animatingUntil: isNew
              ? ctx.now + ANIMATION_DURATION
              : state.latestResub?.animatingUntil ?? 0,
            isAnimating: isNew,
          },
        };
      }

      case "TICK": {
        const latestFollower = updateAnimationState(state.latestFollower, ctx.now);
        const latestSubscriber = updateAnimationState(state.latestSubscriber, ctx.now);
        const latestTip = updateAnimationState(state.latestTip, ctx.now);
        const latestGiftSub = updateAnimationState(state.latestGiftSub, ctx.now);
        const latestResub = updateAnimationState(state.latestResub, ctx.now);

        // Only return new state if something changed
        if (
          latestFollower === state.latestFollower &&
          latestSubscriber === state.latestSubscriber &&
          latestTip === state.latestTip &&
          latestGiftSub === state.latestGiftSub &&
          latestResub === state.latestResub
        ) {
          return state;
        }

        return {
          ...state,
          latestFollower,
          latestSubscriber,
          latestTip,
          latestGiftSub,
          latestResub,
        };
      }

      default:
        return state;
    }
  });
