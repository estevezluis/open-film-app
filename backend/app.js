const { readFileSync } = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const Joi = require('joi')

const app = express()
const port = 8000

const filmDb = JSON.parse(readFileSync(__dirname + '/db.json').toString())
const usedIds = new Set(filmDb.map((film) => film.id))

const types = ['Movie', 'Episode']
const TVRating = ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA']
const MovieRating = ['G', 'PG', 'PG-13', 'R', 'NC-17']

function getNewId() {
	let uuid = uuidv4()

	while (usedIds.has(uuid)) {
		uuid = uuidv4()
	}

	return uuid
}

const schema = Joi.object({
	type: Joi.string()
		.required()
		.valid(...types),
	title: Joi.string().required(),
	description: Joi.string().required(),
	releaseYear: Joi.string()
		.required()
		.regex(/^(19|20)\d{2}$/),
	director: Joi.string().required(),
	categories: Joi.string().required(),
	rating: Joi.string()
		.required()
		.valid(...TVRating, ...MovieRating),
})

function validateBody(req, res, next) {
	const { error } = schema.validate(req.body)
	if (error) {
		return res.status(400).json({
			error: error.details[0].message,
		})
	}
	next()
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('static'))

app.get('/db', (req, res) => {
	return res.json(filmDb)
})

app.post('/add-film', validateBody, (req, res) => {
	const filmId = getNewId()
	const film = {
		...req.body,
		id: filmId,
		imageSource: `${filmId}/promo.jpg`,
		videoSource: `${filmId}/film.m3u8`,
	}

	usedIds.add(filmId)
	// mkdir directory with filmId

	return res.json(film)
})

app.get('/db/:id', (req, res) => {
	const i = filmDb.findIndex((film) => film.id === req.params.id)

	return res.json(filmDb[i])
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
