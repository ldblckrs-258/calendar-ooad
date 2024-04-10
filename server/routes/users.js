const express = require('express')
const userController = require('../controllers/user.controller')

const router = express.Router()

router.post('/create', userController.createAccount)
router.get('/all', userController.getAll)
router.post('/authenticate', userController.authenticate)
router.get('/remove/:id', userController.remove)
module.exports = router
