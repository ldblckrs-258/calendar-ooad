import './App.css'
import { useState, useEffect } from 'react'
import {
	LoginForm,
	SigninForm,
	UserTable,
	AppointmentTable,
	Navbar,
} from './components/Components'
import userInfor from './classes/userInfor'

function App() {
	const [user, setUser] = useState(new userInfor(0, '', ''))
	const [popup, setPopup] = useState(0)

	useEffect(() => {
		authenticateUser()
	}, [])

	async function authenticateUser() {
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
						new userInfor(
							json.data.id,
							json.data.fullName,
							json.data.email,
						),
					)
				}
				sessionStorage.setItem('token', json.token)
			} else {
				throw new Error('Not authenticated')
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}

	function logout() {
		setUser(new userInfor(0, '', ''))
		fetch('http://localhost:3002/users/logout', {
			credentials: 'include',
		})
			.then((response) => response.json())
			.then(window.location.reload())
	}

	return (
		<div className="flex w-full flex-wrap items-center justify-center gap-10 p-5 pt-20">
			<Navbar
				userName={user.fullName}
				onSignin={() => setPopup(1)}
				onLogin={() => setPopup(2)}
				onLogout={logout}
			/>

			{user.id == 0 ? <UserTable /> : <AppointmentTable />}
			{popup !== 0 && (
				<div
					className="item-center fixed left-0 top-0 flex h-dvh w-dvw justify-center bg-[#00000050] p-16"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setPopup(0)
						}
					}}
				>
					{popup === 1 && <SigninForm />}
					{popup === 2 && <LoginForm />}
				</div>
			)}
		</div>
	)
}

export default App
