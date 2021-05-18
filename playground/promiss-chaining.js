require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('60a20a2cc61c7a1ef565044b', {
//     age: 1
// }).then((user) => {
//     console.log(user);
//     return User.countDocuments( {age: 1} )
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAndCount = async (_id, age) => {
	// const user = await User.findByIdAndUpdate(_id, { age })
	const count = await User.countDocuments({ age })
	return count
}

updateAndCount('60a20a2cc61c7a1ef565044b', 36).then((count) => {
	console.log(count)
})