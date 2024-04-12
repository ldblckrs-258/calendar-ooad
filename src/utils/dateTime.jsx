const formatTime = (timeString) => {
	const [hour, minute] = timeString.split(':')
	const hourInt = parseInt(hour)
	const minuteInt = parseInt(minute)
	const ampm = hourInt >= 12 ? 'CH' : 'SA'
	const hour12 = hourInt % 12 || 12
	return `${hour12.toString().padStart(2, '0')}:${minuteInt.toString().padStart(2, '0')} ${ampm}`
}

const fixTime = (dateTime) => {
	return dateTime + ':00.000Z'
}

const toISOTime = (date, time) => {
	const [hour, minute] = time.split(':')
	const thisDate = new Date(date)
	thisDate.setHours(hour, minute)
	return thisDate.toISOString()
}

const minutesDuration = (start, end) => {
	const startTime = new Date(start)
	const endTime = new Date(end)
	const duration = endTime - startTime
	const minutes = Math.floor(duration / (1000 * 60))
	return minutes
}

const timeBefore = (time, minutes) => {
	const timeDate = new Date(time)
	timeDate.setMinutes(timeDate.getMinutes() - minutes)
	return timeDate.toISOString()
}

export { formatTime, fixTime, toISOTime, minutesDuration, timeBefore }
