const cal = ts => {
  ts = new Date(ts)
  const year = ts.getUTCFullYear()
  const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = ts.getUTCDate().toString().toString().padStart(2, '0')
  const hour = ts.getUTCHours()
  return { year, month, day, hour }
}

const hour = (ts, ext='.json.br') => {
  const { year, month, day, hour } = cal(ts)
  const filename = `${year}-${month}-${day}-${hour}${ext}`
  return `${year}/${month}/${day}/${filename}`
}
const day = (ts, ext='.json.br') => {
  const { year, month, day } = cal(ts)
  const filename = `${year}-${month}-${day}${ext}`
  return `${year}/${month}/${filename}`
}

exports.hour = hour
exports.day = day
