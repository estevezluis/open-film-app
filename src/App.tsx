import './index.css'
import { Film, TVRating } from './types'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import VideoDetail from './components/VideoDetail'
import Collection from './components/Collection'
import { useEffect, useState } from 'react'
import AddFilm from './components/AddFilm'
import Login from './components/Login'

function App() {
	const [movies, setMovies] = useState([])

	useEffect(() => {
		fetch(`${process.env.REACT_APP_SERVER_URL}/films`)
			.then((res) => res.json())
			.then((res) => {
				setMovies(res)
			})
	}, [])

	const fourOFour: Film = {
		id: '404',
		title: '404',
		description: '404 Not Found',
		releaseYear: '2012',
		videoSource: '404.mp4',
		imageSource: '404.jpg',
		duration: 0,
		categories: [],
		director: 'Renny Gleeson',
		rating: TVRating.TV_G,
	}

	const router = createBrowserRouter([
		{
			path: '/',
			index: true,
			element: <Collection films={movies} />,
		},
		{
			path: '/watch/404',
			loader: async () => {
				return fourOFour
			},
			element: <VideoDetail />,
		},
		{
			path: '/watch/:movieId',
			loader: async ({ params }) => {
				const i = movies.findIndex(({ id }) => id === params.movieId)

				if (i === -1) {
					return redirect('/watch/404')
				}

				return movies[i]
			},
			element: <VideoDetail />,
		},
		{
			path: '/add-film',
			element: <AddFilm />,
		},
		{
			path: '/login',
			element: <Login />,
		},
		{
			path: '/watch',
			loader: async () => redirect('/'),
		},
		{
			path: '*',
			loader: async () => redirect('/watch/404'),
		},
	])

	return <RouterProvider router={router} />
}

export default App
