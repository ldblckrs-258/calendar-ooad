import { useState, useEffect } from 'react'
import AddApm from './AddApm'
import {
	toISOTime,
	formatTime,
	minutesDuration,
	timeBefore,
} from '../utils/dateTime'
import {
	PiPlusCircleBold,
	PiBellSimple,
	PiBellRingingFill,
} from 'react-icons/pi'

function AppointmentTable() {
	const [userAppointments, setUserAppointments] = useState([])
	const [createPopup, setCreatePopup] = useState(false)
	const currentDate = new Date()
	currentDate.setHours(currentDate.getHours() + 7)
	const token = sessionStorage.getItem('token')

	useEffect(() => {
		fetchAppointments()
	}, [])

	const fetchAppointments = async () => {
		try {
			const response = await fetch(`http://localhost:3002/apm/all`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			const data = await response.json()
			setUserAppointments(data.data)
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const handleRemove = async (id) => {
		try {
			await fetch(`http://localhost:3002/apm/remove/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			fetchAppointments()
		} catch (error) {
			console.error('Error:', error)
		}
		fetchAppointments()
	}

	const createReminder = async (apmId, apmTime) => {
		const mins = prompt(
			'Enter reminder time in minutes before the appointment',
		)
		if (mins) {
			const time = timeBefore(apmTime, mins)
			try {
				const response = await fetch(
					`http://localhost:3002/reminder/insert`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							apmId,
							time,
						}),
					},
				)
				const data = await response.json()
				if (response.status === 201) {
					window.location.reload()
				} else {
					console.log(data)
				}
			} catch (error) {
				console.error('Error:', error)
			}
		}
	}

	const removeReminder = async (id) => {
		const ok = window.confirm(
			'Are you sure you want to remove this reminder?',
		)
		if (!ok) return
		try {
			await fetch(`http://localhost:3002/reminder/remove/${id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			window.location.reload()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<div className="relative flex flex-col items-center justify-center gap-5">
			<button
				className="absolute left-[-100px] top-1 flex items-center justify-center gap-2 rounded bg-blue-500 px-3 py-1 text-white"
				onClick={() => setCreatePopup(true)}
			>
				<PiPlusCircleBold /> New
			</button>
			<table className="w-[1000px]  bg-white">
				<thead>
					<tr className="*:border *:border-[#aaaaaa] *:bg-gray-200 *:p-2">
						<th>Title</th>
						<th>Location</th>
						<th>Date</th>
						<th>Start time</th>
						<th>End time</th>
						<th>Group?</th>
						<th>Reminder</th>
						<th>
							<button
								className="m-auto flex items-end justify-center rounded-md text-sm leading-6 text-sky-500 hover:underline"
								onClick={() => fetchAppointments()}
							>
								Refresh
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{userAppointments &&
						userAppointments.map((apm) => (
							<tr
								className={`
									${
										toISOTime(apm.date, apm.startTime) <
										new Date().toISOString()
											? 'bg-red-100'
											: ''
									} relative ${!apm.own && 'bg-[#f9ebff]'} *:border-[#aaaaaa]
								`}
								key={apm.id}
							>
								<td className="border p-2">{apm.title}</td>
								<td className="border p-2">{apm.location}</td>
								<td className="border p-2 text-center">
									{apm.date}
								</td>
								<td className="border p-2 text-center">
									{formatTime(apm.startTime)}
								</td>
								<td className="border p-2 text-center">
									{formatTime(apm.endTime)}
								</td>
								<td className="border p-2">
									<div className="flex justify-center">
										<input
											className="m-auto"
											type="checkbox"
											checked={apm.isGroup}
											readOnly
										/>
									</div>
								</td>
								<td className="border p-2">
									{apm.reminder ? (
										<button
											className="flex h-full w-full items-center justify-center gap-2 text-xl text-[#fc9a03]"
											onClick={() =>
												removeReminder(apm.reminder.id)
											}
										>
											<PiBellRingingFill />
											<p className="text-sm text-black">
												{minutesDuration(
													apm.reminder.time,
													toISOTime(
														apm.date,
														apm.startTime,
													),
												)}{' '}
												mins
											</p>
										</button>
									) : (
										<button
											className={`flex h-full w-full items-center justify-center gap-2 text-xl text-[#fc9a03] ${apm.isOutdated && 'cursor-not-allowed'}`}
											onClick={() => {
												if (!apm.isOutdated)
													createReminder(
														apm.id,
														toISOTime(
															apm.date,
															apm.startTime,
														),
													)
											}}
										>
											<PiBellSimple />
										</button>
									)}
								</td>
								<td className="border p-2">
									<button
										className={`m-auto flex h-5 w-5 items-end justify-center rounded-md text-sm leading-6 text-white ${apm.isOutdated ? 'bg-red-500' : 'bg-red-300'} ${!apm.own && 'cursor-not-allowed'}`}
										onClick={() => {
											if (apm.own) handleRemove(apm.id)
										}}
										title={
											apm.own
												? 'Remove appointment'
												: 'Not your appointment'
										}
									>
										x
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
			{createPopup && (
				<div
					className="fixed left-0 top-0 flex h-dvh w-dvw items-center justify-center bg-[#00000050]"
					onMouseDown={(e) => {
						if (e.target === e.currentTarget) setCreatePopup(false)
					}}
				>
					<AddApm />
				</div>
			)}
		</div>
	)
}

export default AppointmentTable
