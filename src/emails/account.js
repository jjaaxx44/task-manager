const mailgun = require('mailgun-js')
const DOMAIN = 'sandbox88a4e586f3034237942b87d88de5ea5e.mailgun.org'

const apiKey = '3f24683248585c8c464ee8a0f7eed775-6ae2ecad-2e9698c6'
const mg = mailgun({apiKey: apiKey, domain: DOMAIN})


const sendWelcomeEmail = (email, name) => {
	const data = {
		from: 'abhishek.chaudhari44@gmail.com',
		to: email,
		subject: 'Task - thanks for joining',
		text: `Welcome to the app, ${name}. Let us know how you get along with the app`
		//note quote above is different to support ${name}
	}
	mg.messages().send(data)//, function (error, body) {})
}

const cancellationEmail = (email, name) => {
	const data = {
		from: 'abhishek.chaudhari44@gmail.com',
		to: email,
		subject: 'Task - sad to see you leave',
		text: `Goodbye, ${name}. Is there anything that we could have done better? Do let us know.`
		//note quote above is different to support ${name}
	}
	mg.messages().send(data)//, function (error, body) {})
}


module.exports = {
	sendWelcomeEmail,
	cancellationEmail
}