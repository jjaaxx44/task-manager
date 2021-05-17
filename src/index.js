const express = require('express')
const constants = require('./constants')

const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(constants.statusChalk('Server is up on port ' + port));
})