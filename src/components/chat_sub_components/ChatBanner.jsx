import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import config from "../config/config.json";

const ChatBanner = ({ selectedUser, onClick }) => {
  if (!selectedUser) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "7px",
        backgroundColor: "#1976d2",
        color: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer", // Change cursor to indicate clickable area
      }}
      onClick={() => onClick(selectedUser)} // Passing the selected user to parent component
    >
      <Avatar
        src={selectedUser.profile_pic ? `${config.API_BASE_URL}${selectedUser.profile_pic}` : null}
        alt={selectedUser.username}
        sx={{
          width: "50px",
          height: "50px",
          marginRight: "16px",
          backgroundColor: selectedUser.profile_pic ? "transparent" : "#1976d2",
        }}
      >
        {!selectedUser.profile_pic && selectedUser.username.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {selectedUser.username}
      </Typography>
    </Box>
  );
};

export default ChatBanner;
