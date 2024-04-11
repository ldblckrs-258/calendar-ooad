const formatDate = (dateString) => {
	const date = new Date(dateString)
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	let hour = date.getHours()
	const minute = String(date.getMinutes()).padStart(2, '0')
	const postMeridiem = hour >= 12 ? 'CH' : 'SH'
	hour = String(hour % 12 || 12).padStart(2, '0')
	// const second = String(date.getSeconds()).padStart(2, '0')

	const formattedDate = `${day}/${month}/${year}`
	const formattedTime = `${hour}:${minute} ${postMeridiem}`
	return `${formattedDate} - ${formattedTime}`
}

const fixTime = (dateTime) => {
	return dateTime + ':00.000Z'
}

export { formatDate, fixTime }
