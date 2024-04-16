import { monthCalendar, formatTime } from '../utils/dateTime'
import { useState } from 'react'
import propTypes from 'prop-types'
import '../styles/Calendar.css'
import { PiCalendarCheckFill } from 'react-icons/pi'

const Calendar = ({ pickedDate, apmData }) => {
	const weeksList = monthCalendar(pickedDate.month, pickedDate.year)
	console.log(weeksList)
	const currentDate = new Date()
	const isThisMonth =
		currentDate.getMonth() + 1 == pickedDate.month &&
		currentDate.getFullYear() == pickedDate.year
	console.log(apmData)
	return (
		<div className="calendar flex flex-col">
			<table className="mx-auto w-[800px]">
				<thead>
					<tr className="h-12 border-b-2 border-blue-500 text-[#22223b]">
						<th className="text-[#c1121f]">Sun</th>
						<th>Mon</th>
						<th>Tue</th>
						<th>Wed</th>
						<th>Thu</th>
						<th>Fri</th>
						<th className="text-[#e76f51]">Sat</th>
					</tr>
				</thead>
				<tbody className="bg-white text-center text-xl font-semibold">
					{weeksList.map((week, index) => (
						<tr
							key={index}
							className={`${index === 0 ? 'first-week' : ''} ${index === weeksList.length - 1 ? 'last-week' : ''}`}
						>
							{week.map((item, index) => (
								<td
									key={index}
									className={`${!item.isThisMonth ? 'bg-[#eeeeee] text-[#bbbbbb]' : 'hover:bg-[#dff7ff]'} ${item.day == currentDate.getUTCDate() && isThisMonth && 'bg-[#89c2d9]'} `}
								>
									{item.day}
									<div className="absolute right-1 top-1 flex w-full justify-end overflow-hidden text-lg">
										{apmData.map((apm) => {
											if (
												apm.date ==
													new Date(
														pickedDate.year,
														pickedDate.month - 1,
														item.day + 1,
													)
														.toISOString()
														.slice(0, 10) &&
												item.isThisMonth
											) {
												return (
													<button
														key={apm.id}
														className={`${apm.startTime <= '12:00' ? 'text-[#2a9d8f]' : 'text-[#f4a261]'}`}
														title={`${apm.title} at ${apm.location} from ${formatTime(apm.startTime)} to ${formatTime(apm.endTime)}`}
													>
														<PiCalendarCheckFill />
													</button>
												)
											}
										})}
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

Calendar.propTypes = {
	pickedDate: propTypes.object,
	apmData: propTypes.array,
}

export default Calendar
