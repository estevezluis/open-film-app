import './index.css'
import { Movie, TVRating } from './types'
import promo from './assets/promo.jpg'
import Video from './assets/BigBuckBunny720p30s.mp4'
import VideoDetail from './components/VideoDetail'

function App() {
	const movieOne: Movie = {
		type: 'Movie',
		title: 'Big Buck Bunny',
		description: 'An enormous, fluffy, and utterly adorable rabbit is heartlessly harassed by the ruthless, loud, bullying gang of a flying squirrel, who is determined to squash his happiness.',
		releaseYear: '2008',
		director: 'Sacha Goedegebure',
		imageSource: promo,
		videoSource: Video,
		rating: TVRating.TV_Y7,
		duration: 0,
		categories: ['Short', 'Animation', 'Comedy']
	}

	return (
		<VideoDetail {...movieOne} />
	);
}

export default App;
