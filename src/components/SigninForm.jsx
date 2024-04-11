/* eslint-disable no-useless-escape */
import { useState } from 'react'

function SigninForm() {
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
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
		try {
			const response = await fetch('http://localhost:3002/users/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ fullName, email, password }),
			})
			setLoading(false)
			const data = await response.json()
			if (response.status !== 201) {
				setMessage(data.message)
				return
			} else {
				alert('User created successfully')
				window.location.reload()
			}
		} catch (error) {
			setLoading(false)
			setMessage('An error occurred: ' + error)
		}
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="my-auto flex w-[400px] flex-col items-center gap-5 rounded-md border border-gray-200 bg-white p-5 shadow-md"
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
					className="w-full rounded-md bg-[#64CCDC] px-2 py-1 text-white"
					type="submit"
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Submit'}
				</button>
			</form>
		</>
	)
}

export default SigninForm
