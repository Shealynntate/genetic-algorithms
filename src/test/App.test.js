import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../components/App';

test('renders title', () => {
  render(<App />);
  const titleElement = screen.getByText(/genetic algorithms/i);
  expect(titleElement).toBeInTheDocument();
});
