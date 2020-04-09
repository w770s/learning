
export const month = () => {
  var day = []
  for (var i = 1; i < 13; i++) {
    day.push({
      value: i,
      label: i + ' 个 月',
      time: 60 * 60 * 24 * 30 * i * 1000
    })
  }
  return day
}
export const days = () => {
  var day = []
  for (var i = 1; i < 31; i++) {
    day.push({
      value: i,
      label: i + ' 天',
      time: 60 * 60 * 24 * i * 1000
    })
  }
  return day
}

