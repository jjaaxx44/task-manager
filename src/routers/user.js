const express = require('express');

const router = new express.Router();

const User = require('../models/user');

const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send('nothing found');
    } else {
      res.send(user);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// eslint-disable-next-line consistent-return
router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(404).send('invalid updates');
  }

  const { id } = req.params;
  try {
    // const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true})
    // above will not run middleware for password hashing, so instead use below
    const user = await User.findByIdAndUpdate(id);

    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();

    if (!user) {
      return res.status(404).send('user not found');
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send('user not found');
    } else {
      res.send(user);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
