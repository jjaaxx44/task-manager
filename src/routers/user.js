const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
	const user = new User(req.body)
	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({ user, token })
	} catch (e) {
		res.status(400).send(e)
	}
})

router.post('/users/login', async (req, res) => {
	const email = req.body.email
	const password = req.body.password
	try {
		const user = await User.findByCredentials(email, password)
		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch (e) {
		res.status(400).send()
	}
})

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
		await req.user.save()
		res.send()
	} catch (e) {
		res.status(500).send()
	}
})

router.post('/users/logoutall', auth, async (req, res) => {
	try {
		req.user.tokens = []
		await req.user.save()
		res.send()
	} catch (e) {
		res.status(500).send()
	}
})

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['name', 'email', 'password', 'age']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidOperation) {
		return res.status(404).send('invalid updates')
	}
	try {
		// const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
		//above will not run middleware for password hashing, so instead use below
		const user = req.user
		updates.forEach((update) => user[update] = req.body[update])
		await user.save()
		res.send(user)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove()
		res.send(req.user)
	} catch (e) {
		res.status(500).send(e)
	}
})

module.exports = router