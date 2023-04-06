const { existsSync, mkdirSync, renameSync } = require('node:fs')
const { spawn } = require('node:child_process')
const { queue } = require('async')
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const Joi = require('joi')

const upload = multer({ dest: 'temp/' })
const app = express()
const port = 8000

if (!existsSync('static')) mkdirSync('static')

const filmDb = []
// const filmDb = JSON.parse(readFileSync(__dirname + '/db.json').toString())
const usedIds = new Set(filmDb.map((film) => film.id))

const types = ['Movie', 'Episode']
const TVRating = ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA']
const MovieRating = ['G', 'PG', 'PG-13', 'R', 'NC-17']

const commandQueue = queue(async (task) => {
	const { command, args } = task
	const childProcess = spawn(command, args, { shell: true })
	// TODO: Add logging to external file

	childProcess.on('close', (code) => {
		console.log(`${command} exited with code ${code}`)
	})
}, 2)

function getNewId() {
	let uuid = uuidv4()

	while (usedIds.has(uuid)) uuid = uuidv4()

	return uuid
}

const bodySchema = Joi.object({
	type: Joi.string()
		.required()
		.valid(...types),
	title: Joi.string().required(),
	description: Joi.string().required(),
	releaseYear: Joi.string()
		.required()
		.regex(/^(19|20)\d{2}$/),
	director: Joi.string().required(),
	rating: Joi.string()
		.required()
		.valid(...TVRating, ...MovieRating),
})

const fileSchema = Joi.object({
	imageFile: Joi.any().required(),
	videoFile: Joi.any().required(),
})

function validate(req, res, next) {
	const { error: bodyError } = bodySchema.validate(req.body)
	const { error: fileError } = fileSchema.validate(req.files)

	const error = bodyError || fileError
	if (error) {
		return res.status(400).json({
			error: error.details[0].message,
		})
	}

	next()
}

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('static'))

app.get('/films', (_req, res) => {
	return res.json(filmDb)
})

app.get('/films/:id', (req, res) => {
	const i = filmDb.findIndex((film) => film.id === req.params.id)

	if (1 === -1) {
		return res.status(400).json({
			error: 'Film ID not found.',
		})
	}

	return res.json(filmDb[i])
})

app.put('/films/:id', (req, res) => {
	const { error, value } = Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required(),
	}).validate(req.body)

	if (error) {
		return res.status(400).json({
			error: error.details[0].message,
		})
	}

	const i = filmDb.findIndex((film) => film.id === req.params.id)

	if (1 === -1) {
		return res.status(400).json({
			error: 'Film ID not found.',
		})
	}

	const newFilm = { ...filmDb[i], ...value }

	filmDb[i] = newFilm

	return res.json(newFilm)
})

app.post(
	'/add-film',
	upload.fields([{ name: 'imageFile' }, { name: 'videoFile' }]),
	validate,
	(req, res) => {
		const filmId = getNewId()
		const film = {
			...req.body,
			id: filmId,
			imageSource: `${filmId}/promo.jpg`,
			videoSource: `${filmId}/output.m3u8`,
			categories: ['Short', 'Animation'],
		}

		usedIds.add(filmId)

		const { videoFile, imageFile } = req.files
		const { path: imagePath } = imageFile[0]
		const { path: videoPath } = videoFile[0]

		mkdirSync(`static/${filmId}`)
		renameSync(imagePath, `static/${filmId}/promo.jpg`)

		// mv video file to temp/${filmId}.{mp4,jpg}
		commandQueue.push(
			{
				command: 'ffmpeg',
				args: [
					`-i ${videoPath}`,
					'-b:v',
					'1M',
					'-g 60',
					'-hls_time 2',
					'-hls_list_size 0',
					'-hls_segment_size 500000',
					`static/${filmId}/output.m3u8`,
				],
			},
			() => {
				filmDb.push(film)
			}
		)

		return res.json(film)
	}
)

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
