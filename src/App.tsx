import VideoPlayer from './components/VideoPlayer'

function App() {
	const movie = {
		title: 'Big Buck Bunny'
	}

	return (
		<VideoPlayer movieTitle={movie.title} />
	);
}

export default App;
