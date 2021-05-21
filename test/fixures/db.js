const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
	_id: userOneId,
	name: 'testUser',
	email: 'test@email.com',
	password: 'testPass',
	tokens: [{
		token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET_KEY)
	}]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
	_id: userTwoId,
	name: 'testUser2',
	email: 'test2@email.com',
	password: 'testPass2',
	tokens: [{
		token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET_KEY)
	}]
}

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Task one description',
	completed: false,
	owner: userOneId
}

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Task two description',
	completed: true,
	owner: userOneId
}

const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: 'Task three description',
	completed: true,
	owner: userTwoId
}

const populateBD = async () => {
	await User.deleteMany()
	await Task.deleteMany()

	await new User(userOne).save()
	await new User(userTwo).save()

	await new Task(taskOne).save()
	await new Task(taskTwo).save()
	await new Task(taskThree).save()
}

module.exports = {
	userTwoId,
	userTwo,
	taskOne,
	taskTwo,
	taskThree,
	userOne,
	userOneId,
	populateBD
}