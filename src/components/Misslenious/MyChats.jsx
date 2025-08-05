import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Chatstate } from "../../context/ChatProvider";
import { Modal, Box, Typography } from "@mui/material";
import { IconButton } from '@mui/material';
import { AiOutlinePlus } from "react-icons/ai";
import GroupChatModal from "../GroupChatModal.jsx";
// Helper function
const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);

  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  } = Chatstate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get("https://chatkrobackend.onrender.com/api/chat", config);
        setChats(data);
      } catch (error) {
        toast.error("Failed to load the chats", {
          style: {
            background: "#1e1e1e",
            color: "#fff",
            border: "1px solid #444",
          },
        });
      }
    };

    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(storedUser);
    if (user) fetchChats();
  }, [fetchAgain, user, setChats]);

 const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div

      style={{
         display: { xs: selectedChat ? "none" : "flex", md: "flex" },
    flexDirection: "column",
    alignItems: "center",
        backgroundColor: "#000",
        color: "#fff",
        padding: "20px",
        height:'92vh',
        borderRadius: "8px",
        maxWidth: "400px",
        width: "100%",
        border: "1px solid #333",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2 style={{ margin: 0, fontWeight: 500 }}>My Chats</h2>

        <IconButton
          onClick={handleOpen}
          sx={{
            backgroundColor: "#3f51b5",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            "&:hover": {
            backgroundColor: "#303f9f",
            },
          }}
        >
          <AiOutlinePlus />
          <Typography variant="button" sx={{ marginLeft: "8px" }}>
            New Group 
          </Typography>
        </IconButton>
      </div>


      {chats && loggedUser ? (
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              backgroundColor: selectedChat === chat ? "#444" : "#1a1a1a",
              cursor: "pointer",
              transition: "0.3s",
              border: selectedChat === chat ? "1px solid #888" : "1px solid #222",
            }}
          >
            <strong>
              {chat.isGroupChat
                ? chat.chatName
                : getSender(loggedUser, chat.users)}
            </strong>
            {chat.latestMessage && (
              <div
                style={{ fontSize: "13px", marginTop: "5px", color: "#aaa" }}
              >
                <b style={{ color: "#ccc" }}>
                  {chat.latestMessage.sender?.name}:
                </b>{" "}
                {chat.latestMessage.content.length > 50
                  ? chat.latestMessage.content.substring(0, 51) + "..."
                  : chat.latestMessage.content}
              </div>
            )}
          </div>
        ))
      ) : (
        <p style={{ color: "#999" }}>Loading chats...</p>
      )}
        {/* Use Modal Component */}
      <GroupChatModal open={open} handleClose={handleClose} />
    </div>

  );
};

export default MyChats;
