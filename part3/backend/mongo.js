const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.4w5s8sj.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', phoneSchema)

if (process.argv.length > 3) {

	const person = new Person({
		name: process.argv[3],
		number: process.argv[4]
	})

	person.save().then(result => {
		console.log('person saved!')
		mongoose.connection.close()
	})
}

Person
	.find({})
	.then(result => {
		result.forEach(person => {
			console.log(person)
		})
		mongoose.connection.close()
	})