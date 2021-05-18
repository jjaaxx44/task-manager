const chalk = require('chalk')
const errChalk = chalk.white.bgRed
const statusChalk = chalk.greenBright.bgBlue
const jwtSecretKey = 'thisisademokey'

module.exports = {
	errChalk: errChalk,
	statusChalk: statusChalk,
	jwtSecretKey: jwtSecretKey
}