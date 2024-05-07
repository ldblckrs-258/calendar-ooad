import { useState } from 'react'
import { fixTime } from '../utils/dateTime'
import ConflictTable from './ConflictTable'
import propTypes from 'prop-types'

AddApm.propTypes = {
	onUpdated: propTypes.func,
	initDate: propTypes.string,
}

function AddApm({ onUpdated, initDate = '' }) {
	const currentDate = new Date()
	currentDate.setHours(currentDate.getHours() + 7)
	const [newApm, setNewApm] = useState({
		title: '',
		location: '',
		date: initDate || currentDate.toISOString().slice(0, 10),
		startTime: currentDate.toISOString().slice(11, 16),
		endTime: new Date(currentDate.getTime() + 30 * 60000)
			.toISOString()
			.slice(11, 16),
		isGroup: false,
	})
	const [reminder, setReminder] = useState(undefined)
	const [GM, setGM] = useState()
	const [popup, setPopup] = useState(0)
	const [conflict, setConflict] = useState()
	const token = sessionStorage.getItem('token')

	const handleCreateApm = async () => {
		try {
			const response = await fetch('http://localhost:3002/apm/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title: newApm.title,
					location: newApm.location,
					date: newApm.date,
					startTime: fixTime(newApm.startTime),
					endTime: fixTime(newApm.endTime),
					isGroup: newApm.isGroup,
				}),
			})
			const data = await response.json()
			if (response.status === 200) {
				if (reminder) {
					handleCreateReminder(data.data.id, reminder)
				}
				setPopup(1)
			} else if (response.status === 409) {
				setConflict(data.data)
				setPopup(2)
			} else {
				console.log(data)
			}
		} catch (error) {
			console.error('Error:', error)
			alert('Error occurred, try again later')
			window.location.reload()
		}
	}

	const handleRemoveApm = async (id) => {
		try {
			const fetchData = await fetch(
				`http://localhost:3002/apm/remove/${id}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)
			return fetchData
		} catch (error) {
			console.error('Error:', error)
			alert('Error occurred, try again later')
			window.location.reload()
		}
	}

	const handleReplaceApm = async (id) => {
		try {
			const removeApmData = await handleRemoveApm(id)
			if (removeApmData.status === 404) {
				await fetch(`http://localhost:3002/gmp/out/${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				})
				setPopup(1)
			}
		} catch (error) {
			console.error('Error:', error)
			alert('Error occurred, try again later')
			window.location.reload()
		}

		await handleCreateApm()
	}

	const handleSubmit = async (e) => {
		setGM()
		e.preventDefault()
		if (
			newApm.title === '' ||
			newApm.location === '' ||
			newApm.date === '' ||
			newApm.startTime === '' ||
			newApm.endTime === ''
		) {
			alert('Please fill all fields')
			return
		}

		if (newApm.startTime >= newApm.endTime) {
			alert('Start time must be before end time')
			return
		}

		const GMData = await handleCheckGM()
		setGM(GMData)
		if (GMData) {
			setPopup(3)
		} else {
			handleCreateApm()
		}
	}
	const handleCheckGM = async () => {
		try {
			const response = await fetch('http://localhost:3002/apm/check', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title: newApm.title,
					startTime: newApm.startTime,
					endTime: newApm.endTime,
				}),
			})
			const data = await response.json()
			if (response.status === 200) {
				return data.data
			} else response.status === 404
			return null
		} catch (error) {
			console.error('Error:', error)
			return null
		}
	}

	const handleJoinGM = async (ampId) => {
		try {
			const response = await fetch(
				`http://localhost:3002/gmp/create/${ampId}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)
			const data = await response.json()
			if (response.status === 201) {
				if (reminder) {
					handleCreateReminder(data.data.apmId, reminder)
				}
				setPopup(1)
			} else if (response.status === 409) {
				setConflict(data.data)
				setPopup(4)
			} else {
				console.log(data)
			}
		} catch (error) {
			console.error('Error:', error)
			alert('Error occurred, try again later')
			window.location.reload()
		}
	}

	const handleCreateReminder = async (apmId, duration) => {
		try {
			await fetch(`http://localhost:3002/reminder/insert`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					apmId,
					duration,
				}),
			})
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="my-auto flex w-[400px] flex-col items-center gap-5 rounded-md border border-gray-200 bg-white p-5 shadow-md"
			>
				<h1 className="text-xl font-semibold">New Appointment</h1>
				<div className="flex w-full items-center justify-start gap-5">
					<p className="w-[100px] text-sm">Title:</p>
					<input
						className="w-full rounded-md border border-gray-200 px-3 py-[6px] text-sm"
						type="text"
						placeholder="Appointment title"
						value={newApm.title}
						onChange={(e) =>
							setNewApm({ ...newApm, title: e.target.value })
						}
						required
					/>
				</div>
				<div className="flex w-full items-center justify-start gap-5">
					<p className="w-[100px] text-sm">Location:</p>
					<input
						className="w-full rounded-md border border-gray-200 px-3 py-[6px] text-sm"
						type="text"
						placeholder="Appointment location"
						value={newApm.location}
						onChange={(e) =>
							setNewApm({ ...newApm, location: e.target.value })
						}
						required
					/>
				</div>
				<div className="flex w-full items-center justify-start gap-5">
					<p className="w-[100px] text-sm">Date:</p>
					<input
						className="w-full rounded-md border border-gray-200 px-3 py-1 text-sm"
						type="date"
						value={newApm.date}
						onChange={(e) => {
							setNewApm({ ...newApm, date: e.target.value })
						}}
						required
					/>
				</div>
				<div className="flex w-full items-center justify-start gap-5">
					<p className="w-[100px] text-sm">Start time:</p>
					<input
						className="w-full rounded-md border border-gray-200 px-3 py-1 text-sm"
						type="time"
						value={newApm.startTime}
						onChange={(e) => {
							setNewApm({ ...newApm, startTime: e.target.value })
						}}
						required
					/>
				</div>
				<div className="flex w-full items-center justify-start gap-5">
					<p className="w-[100px] text-sm">End time:</p>
					<input
						className="w-full rounded-md border border-gray-200 px-3 py-1 text-sm"
						type="time"
						value={newApm.endTime}
						onChange={(e) => {
							setNewApm({ ...newApm, endTime: e.target.value })
						}}
						required
					/>
				</div>
				<label className="item-center flex w-full justify-between gap-2">
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={newApm.isGroup}
							onChange={(e) => {
								setNewApm({
									...newApm,
									isGroup: e.target.checked,
								})
							}}
						/>
						<span className="text-sm">Group Meeting</span>
					</div>
					<div className="flex items-center gap-2">
						<p className="text-sm">Reminder</p>
						<input
							className="w-20 rounded-md border border-gray-200 px-3 py-1 text-sm"
							type="number"
							value={reminder}
							onChange={(e) => {
								setReminder(e.target.value)
							}}
							placeholder="None"
						/>
						<p className="text-sm">mins</p>
					</div>
				</label>
				<button
					type="submit"
					className="w-full rounded-md bg-blue-500 px-3 py-1 text-white"
				>
					Add
				</button>
			</form>
			{popup !== 0 && (
				<div className="fixed left-0 top-0 flex h-dvh w-dvw items-center justify-center bg-[#00000050]">
					<div className="min-w-[450px] rounded bg-white px-10 py-5">
						<h1 className="mb-5 w-full text-center text-xl font-semibold">
							Notice
						</h1>

						{popup === 1 && (
							<div className="flex flex-col gap-5">
								<p className="w-full text-center text-base ">
									Successfully!
								</p>
								<button
									className="w-[100px] self-center rounded bg-[#64CCDC] px-3 py-2 text-white"
									onClick={onUpdated}
								>
									Close
								</button>
							</div>
						)}
						{popup === 2 && (
							<ConflictTable
								conflict={conflict}
								newApm={newApm}
								onClose={() => setPopup(0)}
								onReplace={() => handleReplaceApm(conflict.id)}
								popup={popup}
							/>
						)}
						{popup === 3 && (
							<ConflictTable
								conflict={GM}
								newApm={newApm}
								onClose={() => setPopup(0)}
								onReplace={() => handleJoinGM(GM.id)}
								onCreate={() => handleCreateApm()}
								popup={popup}
							/>
						)}
						{popup === 4 && (
							<ConflictTable
								conflict={conflict}
								newApm={GM}
								onClose={() => setPopup(0)}
								onReplace={() => {
									handleRemoveApm(conflict.id)
									handleJoinGM(GM.id)
								}}
								popup={popup}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default AddApm
