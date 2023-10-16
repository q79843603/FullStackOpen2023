const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const date = new Date()

app.use(morgan(function (tokens, req, res) {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		JSON.stringify(req.body)
	].join(' ')
}))

// const generateId = () => {
//     const maxId = Math.floor(Math.random() * 1000 + 1)
//     return maxId
// }

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/info', (request, response) => {

	Person.countDocuments({})
		.then(result => {
			response.send(
				`<div>
        Phonebook has info for ${result} people
        <br></br>
        ${date}
        </div>`
			)
		})
})

app.get('/api/persons/:id', (request, response, next) => {
	// const id = Number(request.params.id)
	// const person = persons.find(person => person.id === id)

	// if (person) {
	//     response.json(person)
	// }
	// else {
	//     response.status(404).end()
	// }
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			}
			else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	// const id = Number(request.params.id)
	// persons = persons.filter(person => person.id !== id)

	// response.status(204).end()
	Person.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
	const body = request.body
	console.log(body)
	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	// else if (persons.some(person => person.name === body.name)) {
	//     return response.status(400).json({
	//         error: 'name must be unique'
	//     })
	// }
	const person = new Person({
		// id: generateId(),
		name: body.name,
		number: body.number,
	})
	// persons = persons.concat(person)

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
		.catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.log(error.name)
	console.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	else if (error.name === 'ValidationError'){
		return response.status(400).json({ error: error.message })
	}

	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})