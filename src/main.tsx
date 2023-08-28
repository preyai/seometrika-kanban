import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './utils/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import store from './utils/store';
import App from './App';
import router from './utils/router';
import { RouterProvider } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  // </React.StrictMode>,
)
