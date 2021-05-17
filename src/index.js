const { response } = require('express')
const express = require('express')
const constants = require('./constants')
require('./db/mongoose')
const { ObjectID } = require('bson')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(constants.statusChalk('Server is up on port ' + port));
})