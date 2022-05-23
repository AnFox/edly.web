export function msToTime (ms) {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / 1000 / 60) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const milliseconds = ms - (days * 1000 * 60 * 60 * 24) - (hours * 1000 * 60 * 60) - (minutes * 60 * 1000) - (seconds * 1000)
  return {
    milliseconds,
    seconds,
    minutes,
    hours,
    days
  }
}

export function toReadTime (time) {
  let ms = time.milliseconds.toString()
  if (ms.length > 3) {
    ms = +time.milliseconds.toString().slice(ms.length - 3, ms.length - 1)
  }
  return {
    hours: time.hours,
    minutes: time.minutes < 10 ? `0${time.minutes}` : time.minutes < 1 ? '00' : time.minutes,
    seconds: time.seconds < 10 ? `0${time.seconds}` : time.seconds < 1 ? '00' : time.seconds,
    milliseconds: ms < 100 ? ms < 10 ? `00${ms}` : `0${ms}` : ms
  }
}
