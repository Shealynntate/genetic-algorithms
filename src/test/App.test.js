import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import App from '../components/App';
import store from '../store';
import theme from '../theme';

test('renders title', () => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>,
  );
  const titleElement = screen.getByText(/genetic algorithms/i);
  expect(titleElement).toBeInTheDocument();
});
