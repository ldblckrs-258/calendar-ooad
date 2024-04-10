const models = require('../models')

function createAccount(req, res) {
	const user = {
		fullName: req.body.fullName,
		email: req.body.email,
		password: req.body.password,
	}

	models.User.findOne({ where: { email: user.email } }).then((data) => {
		if (data) {
			res.status(400).json({
				message: 'Email already exists',
			})
			return
		}

		models.User.create(user)
			.then((data) => {
				res.status(201).json({
					message: 'User created',
					data: data,
				})
			})
			.catch((err) => {
				res.status(500).send({
					message:
						err.message ||
						'Some error occurred while creating the User.',
				})
			})
	})
}

function getAll(req, res) {
	models.User.findAll()
		.then((data) => {
			res.status(200).json({
				message: 'All Users',
				data: data,
			})
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					'Some error occurred while retrieving users.',
			})
		})
}

function authenticate(req, res) {
	const email = req.body.email
	const password = req.body.password

	models.User.findOne({ where: { email: email } })
		.then((data) => {
			if (data.password === password) {
				res.status(200).json({
					message: 'User authenticated',
					data: data,
				})
			} else {
				res.status(401).json({
					message: 'Unauthorized',
				})
			}
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					'Some error occurred while authenticating user.',
			})
		})
}

function remove(req, res) {
	const id = req.params.id
	models.User.destroy({
		where: { id: id },
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: 'User was deleted successfully!',
				})
			} else {
				res.send({
					message: `Cannot delete User with id=${id}. Maybe User was not found!`,
				})
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Could not delete User with id=' + id,
			})
		})
}

module.exports = {
	createAccount: createAccount,
	getAll: getAll,
	authenticate: authenticate,
	remove: remove,
}
