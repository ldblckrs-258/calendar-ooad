import { useState } from 'react'
import { fixTime } from '../utils/dateTime'

function AddApm() {
	const [title, setTitle] = useState('')
	const [startTime, setStartTime] = useState('')
	const [endTime, setEndTime] = useState('')
	const [isGroup, setIsGroup] = useState(false)

	const token = sessionStorage.getItem('token')

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!title || !startTime || !endTime) {
			alert('Please fill all fields')
			return
		}

		if (startTime >= endTime) {
			alert('Start time must be before end time')
			return
		}

		let start = fixTime(startTime)
		let end = fixTime(endTime)

		try {
			const response = await fetch('http://localhost:3002/apm/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: title,
					startTime: start,
					endTime: end,
					isGroup,
				}),
			})
			const data = await response.json()
			console.log(data)
			alert('Appointment created successfully')
			window.location.reload()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="my-auto flex w-[400px] flex-col items-center gap-5 rounded-md border border-gray-200 bg-white p-5 shadow-md"
		>
			<h1 className="text-xl font-semibold">New Appointment</h1>
			<input
				className="w-full rounded-md border border-gray-200 px-3 py-[6px] text-sm"
				type="text"
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				required
			/>
			<input
				className="w-full rounded-md border border-gray-200 px-3 py-1 text-sm"
				type="datetime-local"
				value={startTime}
				onChange={(e) => {
					setStartTime(e.target.value)
					console.log(startTime)
				}}
				required
			/>
			<input
				className="w-full rounded-md border border-gray-200 px-3 py-1 text-sm"
				type="datetime-local"
				value={endTime}
				onChange={(e) => setEndTime(e.target.value)}
				required
			/>
			<label className="flex items-center gap-2">
				<input
					type="checkbox"
					checked={isGroup}
					onChange={(e) => setIsGroup(e.target.checked)}
				/>
				<span>Group Meeting</span>
			</label>
			<button
				type="submit"
				className="w-full rounded-md bg-blue-500 px-3 py-1 text-white"
			>
				Add
			</button>
		</form>
	)
}

export default AddApm
