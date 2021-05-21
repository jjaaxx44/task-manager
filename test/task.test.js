const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')

const {
	userTwo,
	taskOne,
	userOne,
	populateBD
} = require('./fixures/db')

beforeEach(populateBD)

test('should create task for user', async () => {
	const response = await request(app)
		.post('/tasks')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({
			description: 'from test'
		}).expect(201)

	const task = await Task.findById(response.body._id)
	expect(task.description).toEqual('from test')
	expect(task.completed).toEqual(false)
})

test('Should get task for user one', async () => {
	const response = await request(app)
		.get('/tasks')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send()
		.expect(200)

	const tasks = response.body
	expect(tasks.length).toEqual(2)
})

test('Should not delete task for other user', async () => {
	await request(app)
		.delete('/tasks/' + taskOne._id.toString())
		.set('Authorization', 'Bearer ' + userTwo.tokens[0].token)
		.send()
		.expect(404)

	const task = await Task.findById(taskOne._id)
	expect(task).not.toBeNull()

})
