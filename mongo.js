const mongoose = require('mongoose')

mongoose.set('strictQuery', false) //https://stackoverflow.com/questions/74747476

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	)
	process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstackopen:${password}@cluster0.1w99zcl.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	mongoose.connect(url).then(result => {
		console.log('connected')

		Person.find({}).then(result => {
			console.log('phonebook:')
			result.forEach(person => console.log(`${person.name} ${person.number}`))
			mongoose.connection.close()
		})
	})
}

if (process.argv.length > 3) {
	mongoose
		.connect(url)
		.then(result => {
			console.log('connected')

			const person = new Person({
				name,
				number,
			})

			return person.save()
		})
		.then(result => {
			console.log(`added ${name} number ${number} to phonebook`)
			return mongoose.connection.close()
		})
		.catch(err => console.log(err))
}
