import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../components/App';
import store from '../store';

test('renders title', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const titleElement = screen.getByText(/genetic algorithms/i);
  expect(titleElement).toBeInTheDocument();
});
