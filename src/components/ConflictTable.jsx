import { formatTime } from '../utils/dateTime'
import propTypes from 'prop-types'

ConflictTable.propTypes = {
	conflict: propTypes.object,
	newApm: propTypes.object,
	onClose: propTypes.func,
	onReplace: propTypes.func,
	onCreate: propTypes.func,
	popup: propTypes.number,
}

function ConflictTable({
	conflict,
	newApm,
	onClose,
	onReplace,
	popup,
	onCreate,
}) {
	return (
		<div className="flex flex-col gap-5">
			<p className="w-full text-center text-base ">
				{(popup === 2 || popup === 4) &&
					'Conflict with existing appointment!'}
				{popup === 3 && 'Group meeting match found!'}
			</p>
			<table className="w-full bg-white text-sm">
				<thead>
					<tr>
						<th className="bg-gray-200 p-2">Title</th>
						<th className="bg-gray-200 p-2">Location</th>
						<th className="bg-gray-200 p-2">Date</th>
						<th className="bg-gray-200 p-2">Start time</th>
						<th className="bg-gray-200 p-2">End time</th>
					</tr>
				</thead>
				<tbody>
					<tr key={conflict.id} className="bg-[#fcd3cc]">
						<td className="border p-2">{conflict.title}</td>
						<td className="border p-2">{conflict.location}</td>
						<td className="border p-2">{conflict.date}</td>
						<td className="border p-2">
							{formatTime(conflict.startTime)}
						</td>
						<td className="border p-2">
							{formatTime(conflict.endTime)}
						</td>
					</tr>
					<tr key={newApm.id} className="bg-[#c6f7ff]">
						<td className="border p-2">{newApm.title}</td>
						<td className="border p-2">{newApm.location}</td>
						<td className="border p-2">{newApm.date}</td>
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
					className="min-w-[120px] self-center rounded bg-[#64CCDC] px-3 py-2 text-white"
					onClick={() => {
						onReplace()
					}}
				>
					{popup === 2 && 'Replace'}
					{popup === 3 && 'Join'}
					{popup === 4 && 'Remove & Join'}
				</button>
				<button
					className="min-w-[120px] self-center rounded bg-[#FD8672] px-3 py-2 text-white"
					onClick={() => {
						onClose()
					}}
				>
					Cancel
				</button>
				{onCreate && (
					<button
						className="min-w-[120px] self-center rounded bg-[#52B69A] px-3 py-2 text-white"
						onClick={() => {
							onCreate()
						}}
					>
						Create
					</button>
				)}
			</div>
		</div>
	)
}

export default ConflictTable
