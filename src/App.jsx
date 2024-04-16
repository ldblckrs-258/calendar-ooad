import './styles/App.css'
import { useState, useEffect } from 'react'
import {
	LoginForm,
	SigninForm,
	UserTable,
	AppointmentTable,
	Navbar,
} from './components/Components'
import userInfo from './classes/userInfo'
import Calendar from './components/Calendar'
import { listMonths } from './utils/dateTime'
import { PiPlusCircleBold } from 'react-icons/pi'
import AddApm from './components/AddApm'

function App() {
	const [user, setUser] = useState(new userInfo(0, '', ''))
	const [popup, setPopup] = useState(0)
	const [calendarDate, setCalendarDate] = useState({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
	})
	const currentDate = new Date()
	currentDate.setHours(currentDate.getHours() + 7)

	const [viewMode, setViewMode] = useState('calendar')
	const [userAppointments, setUserAppointments] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			await handleAuthenticate()
			if (user.id !== 0) {
				await handleGetApms()
			}
		}
		fetchData()
	}, [user.id, calendarDate])

	async function handleAuthenticate() {
		try {
			const response = await fetch(
				'http://localhost:3002/users/authenticate',
				{
					credentials: 'include',
				},
			)
			if (response.ok) {
				const json = await response.json()
				if (json.data) {
					setUser(
						new userInfo(
							json.data.id,
							json.data.fullName,
							json.data.email,
						),
					)
				}
				sessionStorage.setItem('token', json.token)
			} else {
				console.log('Not logged in')
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}

	async function handleLogout() {
		try {
			const response = await fetch('http://localhost:3002/users/logout', {
				credentials: 'include',
			})
			await response.json()
			window.location.reload()
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const handleGetApms = async () => {
		try {
			const response = await fetch(`http://localhost:3002/apm/all`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
				body: JSON.stringify({
					month: calendarDate.month || currentDate.getMonth() + 1,
					year: calendarDate.year || currentDate.getFullYear(),
				}),
			})

			const data = await response.json()
			setUserAppointments(data.data)
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const handleUpdated = async () => {
		setPopup(0)
		handleGetApms
	}
	return (
		<div className="flex w-full flex-col flex-wrap items-center justify-center gap-4 p-5 pt-20">
			<Navbar
				userName={user.fullName}
				onSignin={() => setPopup(1)}
				onLogin={() => setPopup(2)}
				onLogout={handleLogout}
			/>
			{user.id !== 0 && (
				<div
					className={`relative flex items-center justify-between ${
						viewMode == 'calendar' ? 'w-[800px]' : 'w-[1000px]'
					}`}
				>
					<button
						className="absolute left-[-100px] top-0 flex items-center justify-center gap-2 rounded bg-blue-500 px-3 py-1 text-white"
						onClick={() => setPopup(3)}
					>
						<PiPlusCircleBold /> New
					</button>
					<select
						className="rounded-md border border-blue-500 px-2 py-1"
						value={viewMode}
						onChange={(e) => setViewMode(e.target.value)}
					>
						<option value="calendar">Calendar</option>
						<option value="table">Table</option>
					</select>
					<div className="flex items-center justify-center gap-3">
						<select
							className="rounded-md border border-blue-500 px-2 py-1"
							value={calendarDate.month}
							onChange={(e) =>
								setCalendarDate({
									...calendarDate,
									month: e.target.value,
								})
							}
							onWheel={(e) => {
								const delta = Math.sign(e.deltaY)
								const newMonth =
									parseInt(calendarDate.month) + delta
								if (newMonth >= 1 && newMonth <= 12) {
									setCalendarDate({
										...calendarDate,
										month: newMonth.toString(),
									})
								}
							}}
						>
							{listMonths().map((month, index) => (
								<option key={index} value={index + 1}>
									{month}
								</option>
							))}
						</select>
						<input
							className="w-[80px] rounded-md border border-blue-500 px-2 py-1"
							type="number"
							value={calendarDate.year}
							onChange={(e) =>
								setCalendarDate({
									...calendarDate,
									year: e.target.value,
								})
							}
						/>
					</div>
				</div>
			)}
			{viewMode === 'table' && user.id !== 0 && (
				<AppointmentTable
					apmData={userAppointments}
					onReload={handleGetApms}
				/>
			)}
			{viewMode === 'calendar' && user.id !== 0 && (
				<Calendar
					pickedDate={calendarDate}
					apmData={userAppointments}
				/>
			)}
			{user.id === 0 && <UserTable />}
			{popup !== 0 && (
				<div
					className="fixed left-0 top-0 z-10 flex h-dvh w-dvw items-center justify-center bg-[#00000050] p-16"
					onMouseDown={(e) => {
						if (e.target === e.currentTarget) {
							setPopup(0)
						}
					}}
				>
					{popup === 1 && <SigninForm />}
					{popup === 2 && <LoginForm />}
					{popup === 3 && <AddApm onUpdated={handleUpdated} />}
				</div>
			)}
		</div>
	)
}

export default App
