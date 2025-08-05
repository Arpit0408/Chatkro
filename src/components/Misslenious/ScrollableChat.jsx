import React from "react";
import { Avatar, Tooltip, Box, Typography } from "@mui/material";
import { Chatstate } from "../../context/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { toast } from "react-hot-toast";
import { MdPerson } from "react-icons/md";

const ScrollableChat = ({ messages }) => {
  const { user } = Chatstate();

  return (
    <ScrollableFeed>
      {messages &&
  messages.map((m, i) => (
    <Box
      key={m._id}
      display="flex"
      alignItems="center"
      justifyContent={m.sender._id === user._id ? "flex-end" : "flex-start"}
      mb={isSameUser(messages, m, i) ? 1 : 2} // ✅ less margin if same user
    >
      {/* Show avatar only if NOT same user */}
      {!isSameUser(messages, m, i) && (
        <Avatar
          src={m.sender.pic}
          alt={m.sender.name}
          sx={{ width: 32, height: 32, mr: 1 }}
        />
      )}

      <Box
        px={2}
        py={1}
        borderRadius={2}
        bgcolor={m.sender._id === user._id ? "#3f51b5" : "#041158ff"}
        color={m.sender._id === user._id ? "white" : "white"}
        maxWidth="75%"
      >
        {m.content}
      </Box>
    </Box>
  ))}

    </ScrollableFeed>
  );
};

export default ScrollableChat;
