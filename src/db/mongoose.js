const mongoose = require('mongoose')
const validator = require('validator')
const constants = require('../constants')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be valid number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().inclues('password')) {
                throw new Error('Password should not contain "password"')
            }
        }
    }
})

// const me = new User({
//     name: 'abhi  ',
//     email: 'A@A.com  '
// })

// me.save().then((result) => {
//     console.log(constants.statusChalk(result))
// }).catch((error) => {
//     console.log(constants.errChalk(error))
// })


const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// const task = new Task({
//     description: 'eat lunch',
//     completed: false
// }).save().then((result) => {
//     console.log(constants.statusChalk(result))
// }).catch((error) => {
//     console.log(constants.errChalk(error))
// })
