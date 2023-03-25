import './setupTests'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders video title', () => {
	render(<App />)
	const linkElement = screen.getByText(/Short Animations/i)
	expect(linkElement).toBeInTheDocument()
})
