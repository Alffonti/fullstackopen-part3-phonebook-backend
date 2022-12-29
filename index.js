const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
]

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
	response.send(
		`
			<p>Phonebook has info for ${persons.length} people</p>
			<p>${new Date()}</p>
		`
	)
})

const generateId = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number missing',
		})
	}

	const isName = persons.find(person => person.name === body.name)
	if (isName) {
		return response.status(400).json({
			error: 'name must be unique',
		})
	}

	const person = {
		id: generateId(1, Number.MAX_SAFE_INTEGER),
		name: body.name,
		number: body.number,
	}

	persons = persons.concat(person)
	response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)

	if (person) {
		response.json(person)
	} else {
		response.statusMessage = `A person with an id of ${id} doesn't exist`
		response.status(404).end()
	}
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
