const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''

  const areAllDigits = (/^\d+$/).test(timestamp)
  const date = new Date(areAllDigits ? Number(timestamp) : timestamp)

  const timeZoneOffset = date.getTimezoneOffset() / -60
  const timeZoneFormatted = `UTC${timeZoneOffset >= 0 ? '+' : ''}${timeZoneOffset}`

  const day = String(date.getDate()).padStart(2, '0')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  let hour = date.getHours()
  const minute = String(date.getMinutes()).padStart(2, '0')
  const ampm = hour >= 12 ? 'PM' : 'AM'

  if (hour > 12) {
    hour -= 12
  }

  hour = String(hour).padStart(2, '0')

  const formattedDate = `${day} ${month} ${year}, ${hour}:${minute}${ampm}`

  return timestamp ? `${formattedDate} (${timeZoneFormatted})` : ''
}

module.exports.formatTimestamp = formatTimestamp
