import VideoPlayer from './components/VideoPlayer'
import './index.css'

function App() {
	const movie = {
		title: 'Big Buck Bunny'
	}

	return (
		<VideoPlayer movieTitle={movie.title} />
	);
}

export default App;
