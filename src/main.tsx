import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import Board from './components/Board';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation>
        <Board />
      </Navigation>
    </ThemeProvider>
  </React.StrictMode>,
)
