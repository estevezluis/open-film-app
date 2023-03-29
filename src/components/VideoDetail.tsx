import { Movie, Episode } from '../types'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import VideoPlayer from './VideoPlayer'

import { useLoaderData } from 'react-router-dom'

export default function VideoDetail() {
	const film = useLoaderData() as Movie | Episode

	const moreDetails = [
		{
			term: 'Rating',
			details: film.rating,
		},
		{
			term: 'Director',
			details: film.director,
		},
		{
			term: 'Release Year',
			details: film.releaseYear,
		},
	]

	const badgeClassName =
		'w-fit whitespace-nowrap border rounded px-1 font-medium text-inherit'
	const [play, setPlay] = useState(false)

	function getSpacer() {
		return <div className="inline font-medium text-inherit">•</div>
	}

	function playOnClick() {
		setPlay(true)
	}

	function onClose() {
		setPlay(false)
	}

	return (
		<>
			{!!play && <VideoPlayer film={film} onClose={onClose} />}
			{!play && (
				<>
					<main className="bg-gray-900 h-screen">
						<div className="px-4 sm:px-8 md:px-12 xl:px-16 max-w-full">
							<div className="relative w-full md:flex mb-12">
								<div className="fixed top-0 left-0 w-screen min-h-[70vh] transition-opacity">
									<div
										className="z-10 absolute top-0 left-0 right-0 bottom-0 bg-no-repeat bg-center bg-cover bg-top 2xl:block"
										style={{
											backgroundImage: `linear-gradient(0deg, rgb(21, 21, 21) 0%, rgba(21, 21, 21, 0) 50%), linear-gradient(225deg, rgba(21, 21, 21, 0.2) 50%, rgb(21, 21, 21) 99.89%), url(${process.env.REACT_APP_SERVER_URL}/${film.imageSource})`,
										}}
									></div>
									<div className="absolute w-full h-12 sm:h-24 lg:h-32 top-0 left-0 right-0 bg-gradient-to-b from-gray-950 to-transparent"></div>
								</div>

								<div className="w-full md:max-w-[650px] mt-40 relative">
									<h1 className="font-whitney md:text-left mb-4 font-bold text-white text-3xl">
										{film.title}
									</h1>

									<div className="flex flex-col items-center md:items-start mb-8">
										<p
											className="font-whitney text-white text-center md:text-left transition-[max-height] duration-[600ms] ease-in-out max-h-[60px] line-clamp-2 font-medium"
											style={{
												color: 'rgb(245, 244, 243)',
											}}
										>
											{film.description}
										</p>
									</div>

									<div className="flex flex-row flex-wrap justify-center md:justify-start gap-2 text-gray-500 md:text-gray-300 mb-9">
										<p className="font-whitney font-medium text-inherit">
											{film.releaseYear}
										</p>
										{getSpacer()}
										{film.categories.map((category, i) => {
											return (
												<>
													<p className="font-whitney font-medium text-inherit">
														{category}
													</p>
													{i !==
														film.categories.length -
															1 && getSpacer()}
												</>
											)
										})}
										<div className="flex flex-row gap-2 md:basis-full">
											<label className={badgeClassName}>
												{film.rating}
											</label>
											<label className={badgeClassName}>
												HD
											</label>
											<label className={badgeClassName}>
												CC
											</label>
										</div>
									</div>

									<div>
										<div className="opacity-100">
											<div className="flex flex-col md:flex-row">
												<button
													onClick={playOnClick}
													className="btn rounded-full bg-white border-white text-gray-950 active:bg-gray-300 active:border-gray-300 hover:bg-gray-200 hover:border-gray-200 py-3 px-10 mb-4 md:mb-0 md:w-fit md:mr-4"
												>
													<FontAwesomeIcon
														icon={faPlayCircle}
														className="mr-2"
													/>
													Watch Now
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full relative bg-gray-900">
							<div
								className="relative"
								style={{
									transform: 'translate3d(0px, 0px, 0px)',
								}}
							>
								<div className="px-4 sm:px-8 md:px-12 xl:px-16 bg-gray-900 max-w-full">
									<div className="border-b border-white/30 bg-gray-950 pt-4">
										<div className="relative flex flex-nowrap w-full">
											<div className='flex flex-nowrap w-full overflow-hidden relative before:content-[""] before:block before:w-6 before:h-full before:absolute before:top-0 before:opacity-0 before:transition-opacity before:pointer-events-none before:z-10 after:content-[""] after:block after:w-6 after:h-full after:absolute after:top-0 after:opacity-0 after:transition-opacity after:pointer-events-none after:z-10'>
												<nav className="horizontal-scroller w-full">
													<div
														className="flex flex-row items-stretch"
														role="tablist"
														aria-orientation="horizontal"
													>
														{film.type ===
															'Episode' && (
															<button
																className="department-tab text-left mr-8 focus-visible:!ring-transparent focus-visible:!ring-offset-transparent focus-visible:!outline-none whitespace-nowrap  "
																role="tab"
																name="watch"
																data-cy="watch-tab"
																id="headlessui-tabs-tab-3"
																type="button"
																aria-selected="false"
															>
																<p className="cursor-pointer text-lg leading-8 font-whitney m-0 p-0 -tracking-[0.01em] text-white/70">
																	Watch
																</p>
															</button>
														)}
														<button
															className="department-tab text-left mr-8 focus-visible:!ring-transparent focus-visible:!ring-offset-transparent focus-visible:!outline-none whitespace-nowrap  border-b-4 border-oxide selected"
															role="tab"
															name="about"
															data-cy="about-tab"
															id="headlessui-tabs-tab-4"
															type="button"
															aria-selected="true"
															aria-controls="headlessui-tabs-panel-8"
														>
															<p className="cursor-pointer font-bold text-lg leading-8 font-whitney m-0 p-0 -tracking-[0.01em] text-white">
																More Details
															</p>
														</button>
													</div>
												</nav>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="px-4 sm:px-8 md:px-12 xl:px-16 bg-gray-950 max-w-full">
								<div className="focus:border-none focus:outline-none">
									<div className="mt-8 focus:border-none focus:outline-none">
										<div className="flex flex-col">
											<div className="border border-t-0 border-l-0 border-r-0 border-b-1 border-white/10 py-10 lg:py-16">
												<section id="overview">
													{moreDetails.map(
														(
															{ term, details },
															i
														) => {
															return (
																<dl
																	key={i}
																	className="text-white before:table table-row"
																>
																	<dt className="table-cell float-none pr-2">
																		{term}
																	</dt>
																	<dd className="table-cell float-none">
																		{
																			details
																		}
																	</dd>
																</dl>
															)
														}
													)}
												</section>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>
				</>
			)}
		</>
	)
}
