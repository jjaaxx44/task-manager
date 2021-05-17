const mongoose = require('mongoose')
const chalk = require('chalk')

const errChalk = chalk.white.bgRed
const statusChalk = chalk.greenBright.bgBlue
const log = console.log

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

const me = new User({
    name: 'jax',
    age: 36
})

me.save().then( (result) => {
    log(statusChalk(result))
}).catch((error) => {
    log(errChalk(error))
})