const request = require('supertest')
const User = require('../src/models/user')
const app = require('../src/app')
const { populateBD, userOne, userOneId } = require('./fixures/db')

// beforeEach(() => {
// 	populateBD()
// })
//Above will not word
beforeEach(populateBD)

afterEach(() => {

})

test('Should signup new user', async () => {
	const response = await request(app).post('/users').send({
		name: 'jax',
		email: '444.jax@gmail.com',
		password: 'testpass'
	}).expect(201)

	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	expect(response.body).toMatchObject({
		user: {
			name: 'jax',
			email: '444.jax@gmail.com'
		},
		token: user.tokens[0].token
	})

	expect(user.password).not.toBe('testpass')
})

test('login existing user', async () => {
	const response = await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: userOne.password
		})
		.expect(200)

	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	expect(response.body.token).toBe(user.tokens[1].token)
})

test('sould not login wrong credentials', async () => {
	await request(app)
		.post('/users/login').send({
			email: userOne.email,
			password: 'asdf'
		})
		.expect(400)
})

test('sould get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({})
		.expect(200)
})

test('sould not get profile for unauthenticated user', async () => {
	await request(app)
		.get('/users/me')
		.send({})
		.expect(401)
})

test('sould delete account for user', async () => {
	await request(app)
		.delete('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({})
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user).toBeNull()
})

test('sould not delete account for unauthenticated user', async () => {
	await request(app)
		.delete('/users/me')
		.send({})
		.expect(401)
})

test('sould upload avatar', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.attach('avatar', './test/fixures/avatar.png')
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user.avatar).toEqual(expect.any(Buffer))
})

test('sould update valid user field', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({ name: 'updated name' })
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user.name).toEqual('updated name')
})

test('sould not update invalid user field', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
		.send({ location: 'new location' })
		.expect(404)
})
