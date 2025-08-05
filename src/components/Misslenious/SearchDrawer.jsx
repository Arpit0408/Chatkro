import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  InputBase,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Skeleton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import toast from "react-hot-toast";

const SearchDrawer = ({ open, onClose, user, accessChat }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      toast.error("Please enter a username to search!", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #555",
        },
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://chatkrobackend.onrender.com/api/user?search=${searchText}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
  console.log("ERROR RESPONSE:", error.response?.data || error.message);
  toast.error("Failed to load search results.");
} finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          p: 2,
        },
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Search Users
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.1)" }} />

      {/* Search Input */}
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.1)",
          p: "2px 8px",
          borderRadius: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, color: "white" }}
          placeholder="Type username..."
          inputProps={{ "aria-label": "search users" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: "6px", color: "white" }}>
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* Search Results */}
      <Box mt={2}>
        {loading ? (
          <Box>
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="100%"
                height={60}
                sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.1)" }}
              />
            ))}
          </Box>
        ) : (
          <List>
            {searchResult.map((u) => (
              <ListItem
                key={u._id}
                button
                onClick={() => {
                  accessChat(u._id);
                  onClose();
                }}
              >
                <ListItemAvatar>
                  <Avatar src={u.pic} alt={u.name} />
                </ListItemAvatar>
                <ListItemText primary={u.name} secondary={u.email} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default SearchDrawer;
