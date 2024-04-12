import { useState, useEffect } from 'react'
function UserTable() {
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

	const handleRemove = async (id) => {
		const ok = window.confirm('Are you sure you want to delete this user?')
		if (!ok) return
		try {
			const response = await fetch(
				`http://localhost:3002/users/remove/${id}`,
			)
			const data = await response.json()
			console.log(data)
			fetchUsers()
		} catch (error) {
			console.error('Error:', error)
		}
	}
	return (
		<table className="w-[700px] bg-white">
			<thead>
				<tr>
					<th className="bg-gray-200 p-2">Id</th>
					<th className="bg-gray-200 p-2">Full Name</th>
					<th className="bg-gray-200 p-2">Email</th>
					<th className="bg-gray-200 p-2">Password</th>
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
				{data &&
					data.map((user) => (
						<tr key={user.id}>
							<td className="border p-2 text-center">
								{user.id}
							</td>
							<td className="border p-2">{user.fullName}</td>
							<td className="border p-2">{user.email}</td>
							<td className="border p-2">{user.password}</td>
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

export default UserTable
