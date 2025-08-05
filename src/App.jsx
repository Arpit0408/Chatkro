import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Chat from './pages/Chat';
import './app.css';
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Container maxWidth="1500px" padding="0px" sx={{ py: 0, px:0, mx:0, my:0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
