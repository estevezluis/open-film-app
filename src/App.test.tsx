import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders video title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Big Buck Bunny/i);
  expect(linkElement).toBeInTheDocument();
});
