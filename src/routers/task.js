const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
	const task = new Task(req.body)
	try {
		await task.save()
		res.status(201).send('added ' + task)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({})
		res.send(tasks)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.get('/tasks/:id', async (req, res) => {
	const _id = req.params.id

	try {
		const task = await Task.findById(_id)
		if (!task) {
			return res.status(404).send('nothing found')
		}
		res.send(task)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.patch('/tasks/:id', async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ['description', 'completed']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidOperation) {
		return res.status(404).send('invalid updates')
	}

	const _id = req.params.id
	try {
		// const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
        
		//above will not run middleware, so instead use below,
		//in current example there is no middleware like used in user model for hashing, 
		// but code is updated as user just in case

		const task = await Task.findById(_id)
		task.forEach((update) => task[update] = req.body[update])
		await task.save()
		if (!task) {
			return res.status(404).send('user no found')
		}
		res.send(task)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/tasks/:id', async (req, res) => {
	const _id = req.params.id
	try {
		const task = await Task.findByIdAndDelete(_id)
		if (!task) {
			return res.status(404).send('task not found')
		}
		res.send(task)
	} catch (e) {
		res.status(500).send(e)
	}
})

module.exports = router