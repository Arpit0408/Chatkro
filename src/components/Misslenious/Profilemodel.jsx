import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProfileModal = ({ open, handleClose, user }) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          background: "rgba(255, 255, 255, 0.05)", // light glass look
          backdropFilter: "blur(12px)",            // frosted glass
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 3,
          color: "white",
          px: 3,
          py: 2,
        },
      }}
    >
      <DialogTitle sx={{ position: "relative", textAlign: "center", fontWeight: "bold" }}>
        User Profile
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <Avatar
          src={user.pic}
          alt={user.name}
          sx={{
            width: 100,
            height: 100,
            margin: "0 auto",
            mb: 2,
            border: "2px solid rgba(255, 255, 255, 0.2)",
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {user.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {user.email}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;




