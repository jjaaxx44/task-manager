const mongoose = require('mongoose')
const chalk = require('chalk')

const errChalk = chalk.white.bgRed
const statusChalk = chalk.greenBright.bgBlue

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true, 
    // useUnifiedTopology: true, 
    useCreateIndex: true
})