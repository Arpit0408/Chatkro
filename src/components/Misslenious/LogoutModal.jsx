import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const LogoutModal = ({ open, handleClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 3,
          color: "white",
          px: 3,
          py: 2,
        },
      }}
    >
      <DialogTitle sx={{ position: "relative", textAlign: "center", fontWeight: "bold" }}>
        Confirm Logout
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <Typography>Are you sure you want to logout?</Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Yes, Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;
