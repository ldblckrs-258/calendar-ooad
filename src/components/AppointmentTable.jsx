import { useState, useEffect } from 'react'
import AddApm from './AddApm'
import { formatDate } from '../utils/dateTime'

function AppointmentTable() {
	const [userAppointments, setUserAppointments] = useState([])
	// const [groupMeeting, setGroupMeeting] = useState()
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
			const response = await fetch(
				`http://localhost:3002/apm/remove/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			const data = await response.json()
			console.log(data)
			fetchAppointments()
		} catch (error) {
			console.error('Error:', error)
		}
		fetchAppointments()
	}

	const handleGroupToggle = async (id, state) => {
		try {
			const response = await fetch(
				`http://localhost:3002/apm/update/${id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ isGroup: !state }),
				},
			)
			const data = await response.json()
			console.log(data)
			fetchAppointments()
		} catch (error) {
			console.error('Error:', error)
		}
		fetchAppointments()
	}

	return (
		<div className="flex flex-col items-center justify-center gap-10">
			<table className="w-[700px] bg-white">
				<thead>
					<tr>
						<th className="bg-gray-200 p-2">Title</th>
						<th className="bg-gray-200 p-2">Start time</th>
						<th className="bg-gray-200 p-2">End time</th>
						<th className="bg-gray-200 p-2">Group?</th>
						<th className="bg-gray-200 p-2">
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
					{userAppointments.map((apm) => (
						<tr key={apm.id}>
							<td className="border p-2">{apm.name}</td>
							<td className="border p-2">
								{formatDate(apm.startTime)}
							</td>
							<td className="border p-2">
								{formatDate(apm.endTime)}
							</td>
							<td className="border p-2">
								<div className="flex justify-center">
									<input
										className="m-auto"
										type="checkbox"
										checked={apm.isGroup}
										onChange={() =>
											handleGroupToggle(
												apm.id,
												apm.isGroup,
											)
										}
									/>
								</div>
							</td>
							<td className="border p-2">
								<button
									className="m-auto flex h-5 w-5 items-end justify-center rounded-md bg-red-500 text-sm leading-6 text-white"
									onClick={() => {
										handleRemove(apm.id)
									}}
								>
									x
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<AddApm />
		</div>
	)
}

export default AppointmentTable
