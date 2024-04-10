import './App.css'
import { useState, useEffect } from 'react'

function Signin() {
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!fullName || !email || password.length < 6) {
			setMessage('Please fill all fields')
			return
		} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			setMessage('Please enter a valid email address')
			return
		}

		setMessage('')
		setLoading(true)
		fetch('http://localhost:3002/users/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ fullName, email, password }),
		})
			.then((res) => res.json())
			.then((data) => {
				setLoading(false)
				setMessage(data.message)
				if (data.status === 201) {
					setFullName('')
					setEmail('')
					setPassword('')
				}
			})
			.catch((error) => {
				setLoading(false)
				setMessage('An error occurred: ', error)
			})
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="flex w-[400px] flex-col items-center gap-5 rounded-md border border-gray-200 p-5 shadow-md"
			>
				<h1 className="text-xl font-semibold">Signin form</h1>
				<input
					className="w-full rounded-md border border-gray-200 px-3 py-[6px] text-sm"
					type="text"
					placeholder="Full Name"
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
				/>
				<input
					className="w-full rounded-md border border-gray-200 px-3 py-1 text-sm"
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					title="Please enter a valid email address"
				/>
				<input
					className="w-full rounded-md border border-gray-200 px-3 py-1 text-sm"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{message && <p>{message}</p>}
				<button
					className="w-full rounded-md bg-blue-500 px-2 py-1 text-white"
					type="submit"
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Submit'}
				</button>
			</form>
		</>
	)
}

function UserList() {
	const [data, setData] = useState([])
	const fetchUsers = () => {
		fetch('http://localhost:3002/users/all')
			.then((res) => res.json())
			.then((data) => setData(data.data))
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const handleRemove = (id) => {
		fetch(`http://localhost:3002/users/remove/${id}`)
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
			})
			.catch((error) => {
				console.error('Error:', error)
			})
		fetchUsers()
	}
	return (
		<table className="w-[700px]">
			<thead>
				<tr>
					<th className="bg-gray-200 p-2">Full Name</th>
					<th className="bg-gray-200 p-2">Email</th>
					<th className="bg-gray-200 p-2">Password</th>
					<th className="bg-gray-200 p-2">Created At</th>
					<th className="bg-gray-200 p-2">
						<button
							className="m-auto flex items-end justify-center rounded-md text-sm leading-6 text-sky-500 hover:underline"
							onClick={() => fetchUsers()}
						>
							Refresh
						</button>
					</th>
				</tr>
			</thead>
			<tbody>
				{data.map((user) => (
					<tr key={user.id}>
						<td className="border p-2">{user.fullName}</td>
						<td className="border p-2">{user.email}</td>
						<td className="border p-2">{user.password}</td>
						<td className="border p-2">{user.createdAt}</td>
						<td className="border p-2">
							<button
								className="m-auto flex h-5 w-5 items-end justify-center rounded-md bg-red-500 text-sm leading-6 text-white"
								onClick={() => {
									handleRemove(user.id)
								}}
							>
								x
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

function App() {
	const [update, setUpdate] = useState(false)
	return (
		<div className="flex w-full items-center justify-center gap-10 p-5">
			<Signin onUpdate={() => setUpdate((current) => !current)} />
			<UserList
				onUpdate={() => setUpdate((current) => !current)}
				update={update}
			/>
		</div>
	)
}

export default App
