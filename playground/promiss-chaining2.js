require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('60a1e96891d61217da080ae2').then(() => {
//     return Task.countDocuments({ completed: false})
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// })

const deleteTaskAndCount = async (_id) => {
	await Task.findByIdAndDelete(_id)
	const count = await Task.countDocuments( {completed: false})
	return count
}

deleteTaskAndCount('60a20b11840e5d1f922a1d14').then((count) => {
	console.log(count)
}).catch((error) => {
	console.log(error)
})