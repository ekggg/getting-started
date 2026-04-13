EKG.schedule('Weekly Schedule').register((data, ctx) => {
  const days = data.days.map((day) => ({
    ...day,
    isOff: day.events.length === 0,
  }))

  const hasAnyHandle = Boolean(
    ctx.settings.twitterHandle || ctx.settings.youtubeHandle || ctx.settings.twitchHandle,
  )

  return {
    days,
    firstDate: data.days[0]?.date,
    lastDate: data.days[data.days.length - 1]?.date,
    hasAnyHandle,
  }
})
