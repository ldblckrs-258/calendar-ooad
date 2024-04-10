const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.use(bodyParser.json())
app.use(cors())

const userRoute = require('./routes/users')
app.use('/users', userRoute)
module.exports = app
