import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  TextField,
} from "@mui/material";
import { FaArrowLeft, FaEye, FaEdit } from "react-icons/fa";
import { Chatstate } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Profilemodel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = "https://chatkrobackend.onrender.com";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = Chatstate();

  const socket = useRef(null);
  const selectedChatCompare = useRef(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnected(true));
    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));

   socket.current.on("message recieved", (newMessageReceived) => {
  if (
    !selectedChatCompare.current ||
    selectedChatCompare.current._id !== newMessageReceived.chat._id
  ) {
    toast.success("New message received");
  } else {
    // ✅ Add check to avoid adding your own message again
    if (newMessageReceived.sender._id !== user._id) {
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (m) => m._id === newMessageReceived._id
        );
        return alreadyExists ? prev : [...prev, newMessageReceived];
      });
    }
  }
});

  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare.current = selectedChat;
    }
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://chatkrobackend.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      socket.current.emit("join chat", selectedChat._id);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load messages.");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `https://chatkrobackend.onrender.com/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.current.emit("new message", data);
        setMessages((prev) => [...prev, data]);
        setNewMessage("");
      } catch (error) {
        toast.error("Message failed to send. " + error.message);
      }
    }
  };

const typingTimeout = useRef(null);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", selectedChat._id);
    }

   clearTimeout(typingTimeout.current);
typingTimeout.current = setTimeout(() => {
  socket.current.emit("stop typing", selectedChat._id);
  setTyping(false);
}, 3000);

  };

  if (!selectedChat) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        color="gray"
      >
        <Avatar sx={{ width: 80, height: 80, mb: 2 }} />
        <Typography variant="h6" align="center">
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      width="100%"
      height="100%"
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        borderBottom="1px solid #ccc"
        pb={1}
      >
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
onClick={() => setSelectedChat(null)}
        >
          <FaArrowLeft size={20} />
        </IconButton>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">
            {!selectedChat.isGroupChat
              ? getSender(user, selectedChat.users)
              : selectedChat.chatName}
          </Typography>

          {selectedChat.isGroupChat && (
            <IconButton
              onClick={() => setIsGroupModalOpen(true)}
              size="small"
              sx={{ backgroundColor: "red", color: "white" }}
            >
              <FaEdit size={18} />
            </IconButton>
          )}
        </Box>

        {!selectedChat.isGroupChat && (
          <IconButton onClick={() => setIsProfileModalOpen(true)}>
            <FaEye size={20} color="gray" />
          </IconButton>
        )}
      </Box>

      {/* Modals */}
      {!selectedChat.isGroupChat && (
        <ProfileModal
          open={isProfileModalOpen}
          handleClose={() => setIsProfileModalOpen(false)}
          user={getSenderFull(user, selectedChat.users)}
        />
      )}

      {selectedChat.isGroupChat && (
        <UpdateGroupChatModal
          open={isGroupModalOpen}
          handleClose={() => setIsGroupModalOpen(false)}
          fetchMessages={fetchMessages}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          selectedChat={selectedChat}
        />
      )}

      {/* Chat Messages */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        p={2}
        sx={{
          width: "100%",
          flexGrow: 1,
          borderRadius: 2,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "70px",
          overflowY: "auto",
          height: "80vh",
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress size={80} />
          </Box>
        ) : (
          <Box
            className="messages"
            flexGrow={1}
            minHeight={"70vh"}
            overflow="auto"
          >
            <ScrollableChat messages={messages} />
          </Box>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <Typography variant="caption" color="gray" mt={1}>
            Typing...
          </Typography>
        )}

        {/* Input Box */}
        <TextField
          fullWidth
          variant="filled"
          placeholder="Enter a message..."
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={sendMessage}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: 56,
            backgroundColor: "rgba(17, 12, 12, 0.4)",
            borderRadius: 0,
            borderTop: "1px solid rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            zIndex: 1300,
            "& .MuiFilledInput-root": {
              color: "white",
              height: "100%",
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiFilledInput-input::placeholder": {
              color: "rgba(255, 255, 255, 0.7)",
              opacity: 1,
            },
            "& .MuiFilledInput-underline:before": {
              borderBottomColor: "transparent",
            },
            "& .MuiFilledInput-underline:hover:before": {
              borderBottomColor: "transparent",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SingleChat;
