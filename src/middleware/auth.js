const jwt = require('jsonwebtoken')
const User = require('../models/user')
const constants = require('../constants')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, constants.jwtSecretKey)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        console.log(user);

        if(!user) {
            throw new Error()
        } 
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ error })
    }
}

module.exports = auth