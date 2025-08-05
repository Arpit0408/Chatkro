import React, { useState } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Chatstate } from "../../context/ChatProvider";
import Profilemodel from "./Profilemodel.jsx";
import LogoutModal from "./LogoutModal";
import { useNavigate } from "react-router-dom";
import SearchDrawer from "./SearchDrawer";
import toast from "react-hot-toast";
import axios from "axios";

const SideDrawer = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setUser, setSelectedChat, chats, setChats } = Chatstate();
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `https://chatkrobackend.onrender.com/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setSearchOpen(false);
    } catch (error) {
      toast.error(`Error fetching the chat: ${error.message}`, {
        duration: 5000,
        position: "bottom-left",
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #555",
        },
      });
    }
  };

  return (
    <Box
      sx={{
        p: 1,
        bgcolor: "black",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: 1,
      }}
    >
      {/* Left - Search */}
      <Tooltip title="Search User" placement="bottom-end" arrow>
        <IconButton
          onClick={() => setSearchOpen(true)}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <FiSearch size={20} />
        </IconButton>
      </Tooltip>

      {/* Center - Title */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", textTransform: "uppercase" }}
      >
        chatkro
      </Typography>

      {/* Right - Notification & Avatar */}
      <Box>
        <IconButton sx={{ color: "white" }}>
          <IoMdNotificationsOutline size={22} />
        </IconButton>

        <Tooltip title="Account">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.5,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => setProfileOpen(true)}>Profile</MenuItem>
          <MenuItem onClick={() => setLogoutOpen(true)}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Modals */}
      <Profilemodel
        open={profileOpen}
        handleClose={() => setProfileOpen(false)}
        user={user}
      />
      <LogoutModal
        open={logoutOpen}
        handleClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
      {user && (
        <SearchDrawer
          open={searchOpen}
          user={user}
          accessChat={accessChat}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </Box>
  );
};

export default SideDrawer;
