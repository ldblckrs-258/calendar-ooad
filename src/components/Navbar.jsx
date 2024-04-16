import { useState } from 'react'
import PropTypes from 'prop-types'

Navbar.propTypes = {
	userName: PropTypes.string,
	onSignin: PropTypes.func,
	onLogin: PropTypes.func,
	onLogout: PropTypes.func,
}

function Navbar({ userName, onSignin, onLogin, onLogout }) {
	const [showMenu, setShowMenu] = useState(false)
	return (
		<nav className="fixed top-0 z-10 flex w-full items-center justify-between bg-white px-10 py-3">
			<div className="flex items-center gap-5">
				<h1 className="text-2xl font-semibold">Calendar</h1>
				<button
					className="lg:hidden"
					onClick={() => setShowMenu(!showMenu)}
				>
					{showMenu ? 'Close' : 'Menu'}
				</button>
			</div>
			<ul
				className={`justify-center gap-5 lg:flex ${showMenu ? 'block' : 'hidden'}`}
			>
				{userName == '' && (
					<li>
						<button
							className="rounded bg-[#64CCDC] px-3 py-1 text-white"
							onClick={onSignin}
						>
							Sign-in
						</button>
					</li>
				)}
				{userName == '' && (
					<li>
						<button
							className="rounded bg-[#52B69A] px-3 py-1 text-white"
							onClick={onLogin}
						>
							Login
						</button>
					</li>
				)}
				<li>
					{userName != '' && (
						<button
							className="rounded bg-[#FD8672] px-3 py-1 text-white"
							onClick={onLogout}
						>
							Log out
						</button>
					)}
				</li>
				{userName != '' && (
					<li className="flex items-center font-semibold text-sky-950">
						<a>{userName}</a>
					</li>
				)}
			</ul>
		</nav>
	)
}

export default Navbar
