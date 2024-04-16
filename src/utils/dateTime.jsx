export const formatTime = (timeString) => {
	const [hour, minute] = timeString.split(':')
	const hourInt = parseInt(hour)
	const minuteInt = parseInt(minute)
	const ampm = hourInt >= 12 ? 'CH' : 'SA'
	const hour12 = hourInt % 12 || 12
	return `${hour12.toString().padStart(2, '0')}:${minuteInt.toString().padStart(2, '0')} ${ampm}`
}

export const fixTime = (dateTime) => {
	return dateTime + ':00.000Z'
}

export const toISOTime = (date, time) => {
	const [hour, minute] = time.split(':')
	const thisDate = new Date(date)
	thisDate.setHours(hour, minute)
	return thisDate.toISOString()
}

export const minutesDuration = (start, end) => {
	const startTime = new Date(start)
	const endTime = new Date(end)
	const duration = endTime - startTime
	const minutes = Math.floor(duration / (1000 * 60))
	return minutes
}

export const timeBefore = (time, minutes) => {
	const timeDate = new Date(time)
	timeDate.setMinutes(timeDate.getMinutes() - minutes)
	return timeDate.toISOString()
}

export const getDaysInMonth = (month, year) => {
	return new Date(year, month, 0).getDate()
}

export const segmentIntoWeeks = (month, year) => {
	const daysInMonth = getDaysInMonth(month, year)
	const weeks = []
	let week = []
	for (let i = 1; i <= daysInMonth; i++) {
		week.push({
			day: i,
			isThisMonth: true,
		})
		if (new Date(year, month - 1, i).getDay() === 6 || i === daysInMonth) {
			weeks.push(week)
			week = []
		}
	}
	return weeks
}

export const monthCalendar = (month, year) => {
	const weeks = segmentIntoWeeks(month, year)
	const calendar = weeks.map((week, index) => {
		if (index === 0 && week.length < 7) {
			const prevDay = getDaysInMonth(month - 1, year)
			const remain = 7 - week.length
			for (let i = 0; i < remain; i++) {
				week.unshift({
					day: prevDay - i,
					isThisMonth: false,
				})
			}
		} else if (index === weeks.length - 1 && week.length < 7) {
			const remain = 7 - week.length
			for (let i = 0; i < remain; i++) {
				week.push({
					day: i + 1,
					isThisMonth: false,
				})
			}
		}
		return week
	})
	return calendar
}

export const listMonths = () => {
	return [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]
}
