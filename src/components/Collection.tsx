import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons'
import Slider from 'react-slick'
import { Film, TVRating } from '../types'
import { useState } from 'react'

const SERVER_URL = 'http://localhost:8000'
export default function Collection({ films }: { films: Film[] }) {
	const templateMovie: Film = {
		id: '0',
		title: '',
		description: '',
		imageSource: '',
		videoSource: '',
		duration: 0,
		rating: TVRating.TV_G,
		releaseYear: '2023',
		director: '',
		categories: [],
	}
	const [movies, setMovies] = useState([
		templateMovie,
		templateMovie,
		templateMovie,
		templateMovie,
		templateMovie,
	])
	const settings = {
		data: true,
		center: true,
		infinite: false,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 1,
		dots: false,
		arrows: true,
	}

	function getRandomWidth() {
		const randomInt = Math.floor(Math.random() * 4)
		const widths = ['w-72', 'w-64', 'w-60', 'w-56']

		return widths[randomInt]
	}

	setTimeout(() => {
		setMovies((prev) => {
			return [...films, ...films, ...films]
		})
	}, 3 * 1000)

	return (
		<div className="bg-gray-900 w-screen h-screen p-2 text-white overflow-hidden">
			<div className="px-4 sm:px-8 md:px-12 xl:px-16 max-w-full">
				<section className="mb-12">
					<h3 className="transition-opacity duration-500 opacity-100 font-bold text-2xl !leading-[1.25] font-whitney mb-3 md:mb-4 p-0 -tracking-[0.01em] text-white">
						Short Animations
					</h3>
					<Slider {...settings}>
						{movies.map(({ id, imageSource, title }, i) => {
							return (
								<div key={id === templateMovie.id ? i : id}>
									{id === templateMovie.id ? (
										<>
											<div className="skeleton rounded-lg h-44 w-72 mb-3"></div>
											<div
												className={
													getRandomWidth() +
													' skeleton h-2 mb-1'
												}
											></div>
											<div
												className={
													getRandomWidth() +
													' skeleton h-2'
												}
											></div>
										</>
									) : (
										<>
											<Link to={`/watch/${id}`}>
												<div className="relative rounded-lg cursor-pointer h-44 w-72 overflow-hidden duration-[400ms] ease-in-out mb-3">
													<img
														src={`${SERVER_URL}/${imageSource}`}
														alt={title}
														className="object-cover absolute inset-0 w-full h-full rounded-lg skeleton opacity-70"
													/>
													<div className="absolute inset-0 bg-[#00000088] hover:opacity-100 opacity-0 hover:ease-in-out hover:duration-500">
														<div className="flex w-full h-full justify-center items-center text-white">
															<FontAwesomeIcon
																icon={
																	faCirclePlay
																}
																size="2xl"
															/>
														</div>
													</div>
												</div>
											</Link>
											<div className="w-72 overflow-hidden whitespace-nowrap text-ellipsis">
												<Link to={`/watch/${id}`}>
													{title}
												</Link>
											</div>
										</>
									)}
								</div>
							)
						})}
					</Slider>
				</section>
			</div>
		</div>
	)
}
