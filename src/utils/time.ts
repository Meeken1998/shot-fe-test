function d(t: number) {
  return ` ${parseInt(t.toString()).toString()} `
}

export function getDateDiffV2(diffValue: number) {
  if (diffValue < 0) {
    return ''
  }
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const monthC = diffValue / month
  const weekC = diffValue / (7 * day)
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute

  let result = ''

  if (monthC >= 1) {
    result = '' + d(monthC) + 'mon'
  }
  else if (weekC >= 1) {
    result = '' + d(weekC) + 'week'
  }
  else if (dayC >= 1) {
    result = '' + d(dayC) + 'day'
  }
  else if (hourC >= 1) {
    result = '' + d(hourC) + 'h'
  }
  else if (minC >= 1) {
    result = '' + d(minC) + 'm'
  }
  else {
    result = d(minC * 60) + 's'
  }
  return result.trim()
}

export function getDateDiff(timestamp: number) {
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const diffValue = Math.abs(new Date().getTime() - new Date(timestamp).getTime())
  if (diffValue < 0) {
    return
  }
  const monthC = diffValue / month
  const weekC = diffValue / (7 * day)
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute
  let result = ''

  if (monthC >= 1) {
    result = '' + d(monthC) + '月前'
  }
  else if (weekC >= 1) {
    result = '' + d(weekC) + '周前'
  }
  else if (dayC >= 1) {
    result = '' + d(dayC) + '天前'
  }
  else if (hourC >= 1) {
    result = '' + d(hourC) + '小时前'
  }
  else if (minC >= 1) {
    result = '' + d(minC) + '分钟前'
  }
  else {
    result = '刚刚'
  }

  if (timestamp > Date.now()) {
    result = result.replace('前', '后')
  }
  return result
}

export function msToSecond(ms: number) {
  return Math.ceil(ms / 1000)
}