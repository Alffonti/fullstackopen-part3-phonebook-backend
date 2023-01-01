const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const Person = require('./models/person')

const app = express()

morgan.token('data', function (req, res) {
	return JSON.stringify(req.body)
})

app.use(express.json())

app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :res[content-length] :data'
	)
)

app.use(cors())

app.use(express.static('build'))

app.get('/info', (request, response) => {
	Person.find({}).then(persons => {
		response.send(
			`
			<p>Phonebook has info for ${persons.length} people</p>
			<p>${new Date()}</p>
		`
		)
	})
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number missing',
		})
	}

	// const isName = Person.exists({ name: body.name })
	// console.log(isName)
	// if (isName) {
	// 	return response.status(400).json({
	// 		error: 'name must be unique',
	// 	})
	// }

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person
		.save()
		.then(savedPerson => response.json(savedPerson))
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id

	Person.findByIdAndDelete(id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	const id = request.params.id

	Person.findById(id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.statusMessage = `A person with an id of ${id} doesn't exist`
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	Person.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then(updtatedPerson => {
			response.json(updtatedPerson)
		})
		.catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
