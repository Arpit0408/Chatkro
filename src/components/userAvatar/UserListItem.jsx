import React from "react";
import { Avatar, Box, Typography, Paper } from "@mui/material";
import { red } from "@mui/material/colors";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-hot-toast";

const UserListItem = ({ user, handleFunction }) => {
  const handleClick = () => {
    if (handleFunction) {
      handleFunction(user);
    }
    toast.success(`Selected: ${user.name}`, {
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <Paper
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: red[500],
        color: "white",
        padding: 2,
        marginBottom: 1,
        borderRadius: 2,
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          backgroundColor: red[700],
        },
        outline: "none",
        "&:focus-visible": {
          outline: "2px solid white",
        },
      }}
      elevation={3}
    >
      <Avatar
        src={user.pic}
        alt={user.name}
        sx={{ marginRight: 2, bgcolor: red[900], width: 40, height: 40 }}
      >
        {!user.pic && user.name.charAt(0).toUpperCase()}
      </Avatar>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", fontSize: "0.8rem" }}
        >
          <FaEnvelope style={{ marginRight: 6 }} />
          {user.email}
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserListItem;
