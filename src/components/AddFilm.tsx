import axios from 'axios'
import { TVRating, MovieRating } from '../types'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'

const END_YEAR = 2000
export default function AddFilm() {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (formik.isSubmitting || formik.isValidating) {
				event.preventDefault()
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [])
	function ratingToOption(rating: string, i: number) {
		return (
			<option value={rating} key={i}>
				{rating}
			</option>
		)
	}
	const tvRatingsOptions = Object.values(TVRating).map(ratingToOption)
	const movieRatingsOptions = Object.values(MovieRating).map(ratingToOption)
	const years = []
	for (let year = new Date().getFullYear(); year >= END_YEAR; year--) {
		years.push(
			<option value={year} key={year}>
				{year}
			</option>
		)
	}
	const formik = useFormik({
		initialValues: {
			type: 'Movie',
			title: '',
			description: '',
			releaseYear: `${new Date().getFullYear()}`,
			director: '',
			rating: '',
			imageFile: {
				name: '',
			},
			videoFile: {
				name: '',
			},
		},
		validationSchema: Yup.object({
			type: Yup.string().required(),
			title: Yup.string().required(),
			description: Yup.string().required(),
			releaseYear: Yup.string().required(),
			director: Yup.string().required(),
			rating: Yup.string().required(),
			imageFile: Yup.object().shape({
				name: Yup.string().required(),
				file: Yup.mixed().required(),
			}),
			videoFile: Yup.object().shape({
				name: Yup.string().required(),
				file: Yup.mixed().required(),
			}),
		}),
		onSubmit: (values) => {
			const fd = new FormData()

			for (const [name, val] of Object.entries(values)) {
				if (typeof val === 'object' && 'file' in val) {
					fd.append(name, val.file as Blob)
				} else {
					fd.append(name, val as string)
				}
			}

			axios({
				url: `${process.env.REACT_APP_SERVER_URL}/add-film`,
				method: 'post',
				data: fd,
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) /
							(progressEvent?.total ?? progressEvent.loaded * 100)
					)
					setProgress(percentCompleted)
				},
			}).finally(() => {
				formik.setSubmitting(false)
			})
		},
	})

	const labelStyle = 'block text-sm font-medium text-gray-700 pb-2'
	const inputStyle =
		'w-full border-gray-400 rounded-lg shadow-sm focus:border-gray-500 ring-2 focus:ring-gray-50 py-2 px-3'
	return (
		<div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-6 lg:px-8">
			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
					<form
						className="mb-0 space-y-6"
						encType="multipart/form-data"
						onSubmit={formik.handleSubmit}
					>
						<div>
							<label className={labelStyle} htmlFor="type">
								Type
							</label>
							<select
								className={inputStyle}
								name="type"
								id="type"
								disabled={
									formik.isValidating || formik.isSubmitting
								}
								value={formik.values.type}
								onChange={formik.handleChange}
							>
								<option value="Movie">Movie</option>
								<option value="Episode">Episode</option>
							</select>
						</div>

						<div>
							<label className={labelStyle} htmlFor="title">
								Title
							</label>
							<input
								className={inputStyle}
								type="text"
								name="title"
								id="title"
								disabled={
									formik.isValidating || formik.isSubmitting
								}
								value={formik.values.title}
								onChange={formik.handleChange}
							/>
						</div>

						<div>
							<label className={labelStyle} htmlFor="description">
								Description
							</label>
							<input
								className={inputStyle}
								type="text"
								name="description"
								id="description"
								disabled={
									formik.isValidating || formik.isSubmitting
								}
								value={formik.values.description}
								onChange={formik.handleChange}
							/>
						</div>

						<div>
							<label className={labelStyle} htmlFor="releaseYear">
								Release Year
							</label>
							<select
								className={inputStyle}
								name="releaseYear"
								id="releaseYear"
								disabled={
									formik.isValidating || formik.isSubmitting
								}
								value={formik.values.releaseYear}
								onChange={formik.handleChange}
							>
								{years}
							</select>
						</div>

						<div>
							<label className={labelStyle} htmlFor="director">
								Director
							</label>
							<input
								className={inputStyle}
								type="text"
								name="director"
								id="director"
								disabled={
									formik.isValidating || formik.isSubmitting
								}
								value={formik.values.director}
								onChange={formik.handleChange}
							/>
						</div>

						<div>
							<label className={labelStyle} htmlFor="rating">
								Rating
							</label>
							<select
								className={inputStyle}
								name="rating"
								id="rating"
								disabled={
									formik.isValidating || formik.isSubmitting
								}
								value={formik.values.rating}
								onChange={formik.handleChange}
							>
								{formik.values.type === 'Movie'
									? movieRatingsOptions
									: tvRatingsOptions}
							</select>
						</div>

						<div>
							<label className={labelStyle} htmlFor="videoFile">
								Upload Film
							</label>
							<input
								className={inputStyle}
								type="file"
								name="videoFile"
								id="videoFile"
								disabled={
									formik.isValidating || formik.isSubmitting
								}
								value={formik.values.videoFile.name}
								accept="video/mp4"
								onChange={async (event) => {
									if (
										event.currentTarget.files &&
										event.currentTarget.files.length
									) {
										formik.setFieldValue('videoFile', {
											file: event.currentTarget.files[0],
											name: event.currentTarget.value,
										})
									}
								}}
							/>
						</div>
						<div>
							<label className={labelStyle} htmlFor="imageFile">
								Upload Promotional
							</label>
							<input
								className={inputStyle}
								type="file"
								name="imageFile"
								id="imageFile"
								disabled={
									formik.isValidating || formik.isSubmitting
								}
								value={formik.values.imageFile.name}
								accept="image/jpeg"
								onChange={async (event) => {
									if (
										event.currentTarget.files &&
										event.currentTarget.files.length
									) {
										formik.setFieldValue('imageFile', {
											name: event.currentTarget.value,
											file: event.currentTarget.files[0],
										})
									}
								}}
							/>
						</div>
						<button
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-900"
							type="submit"
							disabled={
								formik.isSubmitting || formik.isValidating
							}
						>
							Submit
						</button>
						{!!formik.isSubmitting && (
							<div>
								<label className={labelStyle} htmlFor="file">
									File progress:
								</label>
								<progress
									className={inputStyle}
									id="file"
									max="100"
									value={progress}
								></progress>
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	)
}
