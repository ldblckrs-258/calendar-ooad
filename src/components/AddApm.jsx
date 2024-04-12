import { useState } from 'react'
import { fixTime, formatTime } from '../utils/dateTime'

function AddApm() {
	const currentDate = new Date()
	currentDate.setHours(currentDate.getHours() + 7)
	const [newApm, setNewApm] = useState({
		title: '',
		location: '',
		date: currentDate.toISOString().slice(0, 10),
		startTime: currentDate.toISOString().slice(11, 16),
		endTime: new Date(currentDate.getTime() + 30 * 60000)
			.toISOString()
			.slice(11, 16),
		isGroup: false,
	})

	const token = sessionStorage.getItem('token')

	const createApm = async () => {
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
				setPopup(1)
			} else if (response.status === 409) {
				setConflict(data.data)
				setPopup(2)
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const handleSubmit = async (e) => {
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

		await createApm()
	}

	const replaceApm = async (id) => {
		try {
			await fetch(`http://localhost:3002/apm/remove/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
		} catch (error) {
			console.error('Error:', error)
		}

		await createApm()
		setConflict('')
	}

	const [popup, setPopup] = useState(0)
	const [conflict, setConflict] = useState()

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
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={newApm.isGroup}
						onChange={(e) => {
							setNewApm({ ...newApm, isGroup: e.target.checked })
						}}
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
			{popup !== 0 && (
				<div className="fixed left-0 top-0 flex h-dvh w-dvw items-center justify-center bg-[#00000050]">
					<div className="min-w-[450px] rounded bg-white px-10 py-5">
						<h1 className="mb-5 w-full text-center text-xl font-semibold">
							Notice
						</h1>

						{popup === 1 && (
							<div className="flex flex-col gap-5">
								<p className="w-full text-center text-base ">
									New appointment added successfully!
								</p>
								<button
									className="w-[100px] self-center rounded bg-[#64CCDC] px-3 py-2 text-white"
									onClick={() => window.location.reload()}
								>
									Close
								</button>
							</div>
						)}

						{popup === 2 && (
							<div className="flex flex-col gap-5">
								<p className="w-full text-center text-base ">
									Conflict with existing appointment!
								</p>
								<table className="w-full bg-white text-sm">
									<thead>
										<tr>
											<th className="bg-gray-200 p-2">
												Title
											</th>
											<th className="bg-gray-200 p-2">
												Location
											</th>
											<th className="bg-gray-200 p-2">
												Date
											</th>
											<th className="bg-gray-200 p-2">
												Start time
											</th>
											<th className="bg-gray-200 p-2">
												End time
											</th>
										</tr>
									</thead>
									<tbody>
										<tr
											key={conflict.id}
											className="bg-[#fcd3cc]"
										>
											<td className="border p-2">
												{conflict.title}
											</td>
											<td className="border p-2">
												{conflict.location}
											</td>
											<td className="border p-2">
												{conflict.date}
											</td>
											<td className="border p-2">
												{formatTime(conflict.startTime)}
											</td>
											<td className="border p-2">
												{formatTime(conflict.endTime)}
											</td>
										</tr>
										<tr
											key={newApm.id}
											className="bg-[#c6f7ff]"
										>
											<td className="border p-2">
												{newApm.title}
											</td>
											<td className="border p-2">
												{newApm.location}
											</td>
											<td className="border p-2">
												{newApm.date}
											</td>
											<td className="border p-2">
												{formatTime(newApm.startTime)}
											</td>
											<td className="border p-2">
												{formatTime(newApm.endTime)}
											</td>
										</tr>
									</tbody>
								</table>
								<div className="flex justify-around">
									<button
										className="w-[100px] self-center rounded bg-[#64CCDC] px-3 py-2 text-white"
										onClick={() => {
											replaceApm(conflict.id)
										}}
									>
										Replace
									</button>
									<button
										className="w-[100px] self-center rounded bg-[#FD8672] px-3 py-2 text-white"
										onClick={() => setPopup(0)}
									>
										Close
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default AddApm
