const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({ _id: 'test123' }, 'testKey', { expiresIn: '1 seconds'})
    console.log(token)

    console.log(jwt.verify(token, 'testKey'))
}

myFunction()