import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Backdrop,
  Fade,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Chatstate } from "../../context/ChatProvider";
import UserListItem from "../userAvatar/UserListItem.jsx";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: 500,
  bgcolor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(12px)",
  borderRadius: 3,
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  color: "white",
  maxHeight: "90vh",
  overflowY: "auto",
};


const UpdateGroupChatModal = ({
  open,
  handleClose,
  fetchMessages,
  fetchAgain,
  setFetchAgain,
  selectedChat,
}) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = Chatstate();

  const isAdmin = selectedChat?.groupAdmin?._id === user._id;

  useEffect(() => {
    if (selectedChat) {
      setGroupChatName(selectedChat.chatName);
      setSelectedUsers(selectedChat.users);
    }
  }, [selectedChat]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `https://chatkrobackend.onrender.com/api/user?search=${query}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.warn("User already in group");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `https://chatkrobackend.onrender.com/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedUsers(data.users);
      setFetchAgain(!fetchAgain);
      toast.success(`${userToAdd.name} added`);
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleRemoveUser = async (delUser) => {
    if (!isAdmin && delUser._id !== user._id) {
      toast.warn("Only Admin can remove other users");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `https://chatkrobackend.onrender.com/api/chat/leave`,
        {
          chatId: selectedChat._id,
          userId: delUser._id,
        },
        config
      );
      setSelectedUsers(data.users);
      setFetchAgain(!fetchAgain);
      toast.success(
        delUser._id === user._id ? "You left the group" : `${delUser.name} removed`
      );
      if (delUser._id === user._id) {
        handleClose(); // close modal if user leaves
      }
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `https://chatkrobackend.onrender.com/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setChats((prev) =>
        prev.map((chat) => (chat._id === data._id ? data : chat))
      );
      toast.success("Group name updated");
      handleClose();
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast.error("Rename failed");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
        <Typography
  variant="h5"
  align="center"
  gutterBottom
  sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" } }}
>
  Update Group Chat
</Typography>


          {/* Group name field */}
         <TextField
  label="Chat Name"
  value={groupChatName}
  onChange={(e) => setGroupChatName(e.target.value)}
  disabled={!isAdmin}
  fullWidth
  margin="normal"
  variant="outlined"
  InputLabelProps={{ style: { color: "white" } }}
  sx={{
    // Enabled input text color
    "& .MuiInputBase-input": {
      color: "white",
    },
    // Disabled input text color fix (for Chrome, Firefox)
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "white",
      color: "white",
    },
    // Enabled label color
    "& .MuiInputLabel-root": {
      color: "white",
    },
    // Disabled label color
    "& .MuiInputLabel-root.Mui-disabled": {
      color: "white",
    },
    // Enabled border color
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.7)",
    },
    // Disabled border color
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
  }}
/>


          {/* Show admin-only search bar */}
          {isAdmin && (
            <>
              <TextField
                label="Add Users"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={(e) => handleSearch(e.target.value)}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
              />

              <Box sx={{ mt: 2 }}>
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  searchResult.slice(0, 4).map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
                )}
              </Box>
            </>
          )}

          {/* User Chips with Admin label and remove condition */}
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedUsers.map((u) => (
              <Chip
                key={u._id}
                label={
                  u.name +
                  (selectedChat.groupAdmin._id === u._id ? " (Admin)" : "")
                }
                onDelete={() => {
                  if (!isAdmin && u._id !== user._id) {
                    toast.warn("Only Admin can remove others");
                    return;
                  }
                  handleRemoveUser(u);
                }}
                sx={{ bgcolor: "#1976d2", color: "white" }}
              />
            ))}
          </Box>

          {/* Leave Group Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => handleRemoveUser(user)}
            sx={{
              mt: 3,
              color: "white",
              borderColor: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Leave Group
          </Button>

          {/* Update Chat Button - Only for Admins */}
          {isAdmin && (
            <Button
              variant="contained"
              fullWidth
              onClick={handleRename}
              sx={{
                backgroundColor: "#3f51b5",
                color: "white",
                mt: 2,
                "&:hover": {
                  backgroundColor: "#303f9f",
                },
              }}
            >
              Update Chat
            </Button>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default UpdateGroupChatModal;
