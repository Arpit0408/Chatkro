import React, { useState } from 'react';
import { Chatstate } from '../context/ChatProvider';
import SideDrawer from '../components/Misslenious/SideDrawer.jsx';
import MyChats from '../components/Misslenious/MyChats.jsx';
import ChatBox from '../components/Misslenious/ChatBox.jsx';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatPage = () => {
  const { user, selectedChat, setSelectedChat } = Chatstate();
  const [fetchAgain , setFetchAgain] = useState(false)
  return (
    <Box sx={{ width: '100%', color: '#fff' }}>
      {user && <SideDrawer />}

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '92vh',
          padding: 1,
        }}
      >
        {/* MyChats */}
        {user && (
          <Box
            sx={{
              display: {
                xs: selectedChat ? 'none' : 'flex',
                md: 'flex',
                
              },
              flexDirection: 'column',
              width: { xs: '100%', md: '30%' },
            }}
          >
            <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        )}

        {/* ChatBox with back button on mobile */}
        {user && (
          <Box
            sx={{
              display: {
                xs: selectedChat ? 'flex' : 'none',
                md: 'flex',
              },
              flexDirection: 'column',
              width: { xs: '100%', md: '70%' },
              position: 'relative',
              
            }}
          >
            {/* Back Button - Only on mobile */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 10,
              }}
            >
              <IconButton
                onClick={() => setSelectedChat(null)}
                sx={{
                  backgroundColor: '#333',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#555' },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>

            <ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
