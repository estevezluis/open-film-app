import './index.css'
import { Film, Movie, TVRating } from './types'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import VideoDetail from './components/VideoDetail'
import Collection from './components/Collection'

function App() {
    const movieOne: Movie = {
        id: '6d7f4c34-1222-4574-bb9a-5cbac1fab8b3',
        type: 'Movie',
        title: 'Big Buck Bunny',
        description: 'An enormous, fluffy, and utterly adorable rabbit is heartlessly harassed by the ruthless, loud, bullying gang of a flying squirrel, who is determined to squash his happiness.',
        releaseYear: '2008',
        director: 'Sacha Goedegebure',
        imageSource: 'promo.jpg',
        videoSource: 'BigBuckBunny720p30s.mp4',
        rating: TVRating.TV_Y7,
        duration: 0,
        categories: ['Short', 'Animation', 'Comedy']
    }
    const movieTwo: Movie = {
        id: '2bd28f68-300c-4849-8a5f-f8ca86d7955b',
        type: 'Movie',
        title: 'Agent 327 - Operation Barbershop',
        description: 'Agent 327 is investigating a clue that leads him to a shady barbershop in Amsterdam. Little does he know that he is being tailed by mercenary Boris Kloris.',
        releaseYear: '2017',
        director: 'Hjalti Hjalmarsson',
        imageSource: 'promo2.jpg',
        videoSource: 'agent-327.mp4',
        rating: TVRating.TV_Y7,
        duration: 0,
        categories: ['Short', 'Animation', 'Action']
    }

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
        rating: TVRating.TV_G
    }

	const movies: Film[] = [movieOne, movieTwo]

	const router = createBrowserRouter([
		{
			path:"/",
			index: true,
			element: <Collection films={[movieOne, movieTwo]}/>
		},
        {
            path: '/watch/404',
            loader: async() => {
                return fourOFour
            },
            element: <VideoDetail />
        },
		{
			path: '/watch/:movieId',
			loader: async ({params}) => {
					const i = movies.findIndex(({ id }) => id === params.movieId)

                    if (i === -1) {
                        return redirect('/watch/404')
                    }

					return movies[i] 
			},
			element: <VideoDetail />
		}, {
            path: '*',
            loader: async () => {
                return redirect('/watch/404')
            }
        }
	])

	return (
		<RouterProvider router={router} />
	);
}

export default App;
