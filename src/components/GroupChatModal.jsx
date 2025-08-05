import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import axios from "axios";
import { Chatstate } from "../context/ChatProvider";
import toast from "react-hot-toast";

const GroupChatModal = ({ open, handleClose }) => {
  const { user, chats, setChats } = Chatstate();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // Replace showSnackbar with react-hot-toast calls:
  const showToast = (message, type = "default") => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast(message);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`https://chatkrobackend.onrender.com/api/user?search=${query}`, config);
      setSearchResult(data);
    } catch (err) {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGroupAdd = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      showToast("User already added", "warning");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      showToast("Please fill all fields", "warning");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        "https://chatkrobackend.onrender.com/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      showToast("Group chat created", "success");
      handleClose();
    } catch (error) {
      const errMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Chat creation failed";
      showToast(errMsg, "error");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 3,
          color: "white",
          padding: 4,
          width: "90%",
          maxWidth: 500,
          boxShadow: 24,
          outline: "none",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create a New Group Chat
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Group Chat Name"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            sx={{ input: { color: "white" }, label: { color: "white" } }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Add Users (e.g., John, Jane)"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ input: { color: "white" }, label: { color: "white" } }}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedUsers.map((user) => (
              <Chip
                key={user._id}
                label={user.name}
                onDelete={() => handleDelete(user)}
                color="primary"
              />
            ))}
          </Box>

          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            <Box>
              {searchResult.slice(0, 4).map((user) => (
                <Button
                  key={user._id}
                  fullWidth
                  variant="outlined"
                  onClick={() => handleGroupAdd(user)}
                  sx={{ mt: 1, borderColor: "white", color: "white" }}
                >
                  {user.name}
                </Button>
              ))}
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ backgroundColor: "#3f51b5", color: "white", mt: 2 }}
          >
            Create Chat
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default GroupChatModal;
