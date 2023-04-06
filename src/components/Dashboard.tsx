import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faPlus,
	faPencil,
	faCheck,
	faXmark,
} from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/icon.png'
import { Link, useLoaderData } from 'react-router-dom'
import { Film } from '../types'
import { useState } from 'react'
import axios from 'axios'

type EditFilm = Film & {
	edit: boolean
}

export default function Dashboard() {
	const films = useLoaderData() as Film[]
	const [edittableFilms, setEdittableFilms] = useState(
		films.map((film) => {
			return { ...film, edit: false }
		})
	)

	function edit(value: boolean, index: number) {
		const newFilms = [...edittableFilms]
		newFilms[index].edit = value
		setEdittableFilms(newFilms)
	}

	enum changeType {
		title,
		description,
	}

	function handleChange(type: changeType, value: string, index: number) {
		const newFilms = [...edittableFilms]
		if (type === changeType.title) {
			newFilms[index].title = value
		} else if (type === changeType.description) {
			newFilms[index].description = value
		}

		setEdittableFilms(newFilms)
	}

	return (
		<div className="">
			<nav className="flex justify-between items-center h-16 bg-gray-200 text-white">
				<div className="flex items-center text-black ml-4">
					<img src={logo} alt="Logo" className="h-8"></img>
					Open Film
				</div>
				<div className="flex items-center mr-4">
					<Link
						to="/add-film"
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md mr-2"
					>
						<FontAwesomeIcon icon={faPlus} />
						&nbsp;Add Film
					</Link>
					<button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md">
						Logout
					</button>
				</div>
			</nav>
			<section>
				<table className="w-full">
					<thead className="text-white bg-gray-600">
						<tr className="text-left hover:bg-gray-900">
							<th className="w-5">
								<input type="checkbox" />
							</th>
							<th className="w-64">Video</th>
							<th className="w-64">Title</th>
							<th className="w-auto">Description</th>
							<th className="w-20">Visibility</th>
							<th className="w-52">Date</th>
							<th className="w-24">Views</th>
							<th className="w-24 text-right">Click to Edit</th>
						</tr>
					</thead>
					<tbody>
						{edittableFilms.map((film: EditFilm, i) => {
							return (
								<tr
									key={film.id}
									className="text-white bg-gray-600 hover:bg-gray-900"
								>
									<td>
										<input type="checkbox" />
									</td>
									<td className="w-64 h-32">
										<img
											className="object-cover w-full h-full"
											src={`${process.env.REACT_APP_SERVER_URL}/${film.imageSource}`}
										/>
									</td>
									<td className="w-64 text-ellipsis">
										{!!film.edit ? (
											<input
												type="text"
												className="w-full text-black"
												value={film.title}
												onChange={(e) =>
													handleChange(
														changeType.title,
														e.currentTarget.value,
														i
													)
												}
											/>
										) : (
											film.title
										)}
									</td>
									<td className="w-auto p-2 text-ellipsis">
										{!!film.edit ? (
											<textarea
												style={{ resize: 'none' }}
												className="w-full h-full text-black"
												value={film.description}
												onChange={(e) =>
													handleChange(
														changeType.description,
														e.currentTarget.value,
														i
													)
												}
											/>
										) : (
											film.description
										)}
									</td>
									<td className="w-20">Visible</td>
									<td className="w-52">April 1, 2023</td>
									<td className="w-24">10</td>
									<td className="w-24 text-right">
										{!film.edit ? (
											<button
												className="w-8 w-6 bg-green-600 mr-2"
												onClick={() => edit(true, i)}
											>
												<FontAwesomeIcon
													icon={faPencil}
												/>
											</button>
										) : (
											<>
												<button
													className="w-8 h-6 inline bg-blue-600 mr-2"
													onClick={() => {
														edit(false, i)

														const newData = {
															title: film.title,
															description:
																film.description,
														}

														console.log(newData)

														axios({
															url: `${process.env.REACT_APP_SERVER_URL}/films/${film.id}`,
															method: 'put',
															data: newData,
															headers: {
																'Content-Type':
																	'application/json',
															},
														})
													}}
												>
													<FontAwesomeIcon
														icon={faCheck}
													/>
												</button>
												<button
													className="w-8 h-6 inline bg-red-600"
													onClick={() =>
														edit(false, i)
													}
												>
													<FontAwesomeIcon
														icon={faXmark}
													/>
												</button>
											</>
										)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</section>
		</div>
	)
}
