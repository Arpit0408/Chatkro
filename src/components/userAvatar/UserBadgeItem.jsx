import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 0.5,
        borderRadius: '20px',
        m: 1,
        backgroundColor: '#1976d2',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" mr={1}>
        {user.name}
      </Typography>
      <IconButton size="small" onClick={handleFunction}>
        <CloseIcon fontSize="small" style={{ color: 'white' }} />
      </IconButton>
    </Box>
  );
};

export default UserBadgeItem;
