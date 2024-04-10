const http = require('http')
const app = require('./app')
const port = 3002

const server = http.createServer(app)

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
