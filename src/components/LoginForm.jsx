import { useState } from 'react'

function LoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!email || password.length < 6) {
			setMessage('Please fill all fields')
			return
			// eslint-disable-next-line no-useless-escape
		} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			setMessage('Please enter a valid email address')
			return
		}

		setMessage('')
		setLoading(true)
		fetch('http://localhost:3002/users/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message === 'User authenticated') {
					console.log('User is authenticated')
					window.location.reload()
				} else {
					alert('Invalid email or password')
				}
				setLoading(false)
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="my-auto flex w-[400px] flex-col items-center gap-5 rounded-md border border-gray-200 bg-white px-5 py-10 shadow-md"
			>
				<h1 className="text-xl font-semibold">Welcome back !</h1>
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
					className="w-full rounded-md bg-[#52B69A] px-2 py-1 text-white"
					type="submit"
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Login'}
				</button>
			</form>
		</>
	)
}

export default LoginForm
