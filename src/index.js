const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const constants = require('./constants')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(constants.statusChalk('Server is up on port ' + port))
})