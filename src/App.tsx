import './index.css'
import { Film, TVRating } from './types'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import VideoDetail from './components/VideoDetail'
import Collection from './components/Collection'
import AddFilm from './components/AddFilm'
import Login from './components/Login'

function App() {
	const filmsP = fetch(`${process.env.REACT_APP_SERVER_URL}/films`).then(
		(res) => res.json()
	)

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
			loader: async () => {
				const response = (await filmsP) as Film[]
				return response
			},
			element: <Collection />,
		},
		{
			path: '/watch/404',
			loader: async () => {
				return fourOFour
			},
			element: <VideoDetail />,
		},
		{
			path: '/watch/:filmId',
			loader: async ({ params }) => {
				const films = (await filmsP) as Film[]
				const i = films.findIndex(({ id }) => id === params.filmId)

				if (i === -1) {
					return redirect('/watch/404')
				}

				return films[i]
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
