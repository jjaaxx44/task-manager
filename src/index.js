const app = require('./app')
const port = process.env.PORT
const constants = require('./constants')

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(constants.statusChalk('Server is up on port ' + port))
})