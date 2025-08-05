import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';  // <-- import BrowserRouter
import ChatProvider from "./context/ChatProvider";

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter> {/* Wrap App in BrowserRouter */}
           <ChatProvider>
        <App />
        </ChatProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
