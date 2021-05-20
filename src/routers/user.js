const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, cancellationEmail } = require('../emails/account')

router.post('/users', async (req, res) => {
	const user = new User(req.body)
	try {
		await user.save()
		sendWelcomeEmail(user.email, user.name)
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
		cancellationEmail(req.user.email, req.user.name)
		res.send(req.user)
	} catch (e) {
		res.status(500).send(e)
	}
})

const upload = multer({
	// dest: 'avatars',//saves to file system, if not provided pass data through function
	//can be used as req.file.buffer
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
			return cb(new Error('File must be an image'))
		}
		cb(undefined, true)
	}
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	const modifiedBuffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
	req.user.avatar = modifiedBuffer
	await req.user.save()
	res.send()
}, (error, req, res, next) => {
	res.status(400).send({
		error: error.message
	})
	next()
})

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined
	await req.user.save()
	res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id)

		if(!user || !user.avatar) {
			throw new Error()
		}
		res.set('Content-Type','image/png')
		res.send(user.avatar)
	} catch (error) {
		res.status(404).send()
	}
})
module.exports = router