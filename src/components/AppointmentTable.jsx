import { PiTrashSimpleFill, PiArrowFatLinesRightFill } from 'react-icons/pi'
import propTypes from 'prop-types'
import { toISOTime, formatTime, minutesDuration } from '../utils/dateTime'
import { PiBellSimple, PiBellRingingFill } from 'react-icons/pi'

const AppointmentTable = ({ onReload, apmData }) => {
	const token = sessionStorage.getItem('token')

	const handleRemoveApm = async (id) => {
		const ok = window.confirm(
			'Are you sure you want to remove this appointment?',
		)
		if (!ok) return
		try {
			await fetch(`http://localhost:3002/apm/remove/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			onReload()
		} catch (error) {
			console.error('Error:', error)
		}
		onReload()
	}

	const handleCreateReminder = async (apmId) => {
		const duration = prompt(
			'Enter reminder time in minutes before the appointment',
		)
		if (duration) {
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
							duration,
						}),
					},
				)
				const data = await response.json()
				if (response.status === 201) {
					onReload()
				} else {
					console.log(data)
				}
			} catch (error) {
				console.error('Error:', error)
			}
		}
	}

	const handleRemoveReminder = async (id) => {
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
			onReload()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const handleLeaveGM = async (id) => {
		const ok = window.confirm(
			'Are you sure you want to leave this group meeting?',
		)
		if (!ok) return
		try {
			await fetch(`http://localhost:3002/gmp/out/${id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			onReload()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<div className="relative flex flex-col items-center justify-center gap-5">
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
								onClick={() => onReload()}
							>
								Refresh
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{apmData &&
						apmData.map((apm) => (
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
												handleRemoveReminder(
													apm.reminder.id,
												)
											}
										>
											<PiBellRingingFill />
											<p className="text-sm text-black">
												{apm.reminder.duration} mins
											</p>
										</button>
									) : (
										<button
											className={`flex h-full w-full items-center justify-center gap-2 text-xl text-[#fc9a03] ${apm.isOutdated && 'cursor-not-allowed'}`}
											onClick={() => {
												if (!apm.isOutdated)
													handleCreateReminder(
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
										className={`m-auto flex h-5 w-5 items-center justify-center rounded-full text-xs leading-6 text-white transition-all hover:scale-125 ${!apm.isOutdated && 'opacity-70'} ${apm.own ? 'bg-[#e63946]' : 'bg-[#f4a261]'} `}
										onClick={() => {
											if (apm.own) handleRemoveApm(apm.id)
											else handleLeaveGM(apm.id)
										}}
										title={
											apm.own
												? 'Remove appointment'
												: 'Leave group meeting'
										}
									>
										{apm.own ? (
											<PiTrashSimpleFill />
										) : (
											<PiArrowFatLinesRightFill />
										)}
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}

AppointmentTable.propTypes = {
	onReload: propTypes.func,
	apmData: propTypes.array,
}

export default AppointmentTable
