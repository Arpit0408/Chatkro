import React from "react";
import Box from '@mui/material/Box';
import { Chatstate } from "../../context/ChatProvider";
import SingleChat from "./SingleChat.jsx";

const ChatBox = ({fetchAgain , setFetchAgain}) =>{
    const { selectedChat } = Chatstate();

    return(
        <Box
  sx={{
    display: {
      xs: selectedChat ? 'flex' : 'none', // 'base' in Chakra = 'xs' in MUI
      md: 'flex',
      
    },
  }}
>
 <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
 </Box>

       
    )
}
export default ChatBox