import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const KeyPad = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#f8f8f8",
        borderTop: "1px solid #ddd",
      }}
    >
      <TextField
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        variant="outlined"
        fullWidth
        sx={{ marginRight: "10px" }}
      />
      <Button
        onClick={handleSendMessage}
        variant="contained"
        color="primary"
        sx={{ padding: "10px 20px" }}
      >
        Send
      </Button>
    </Box>
  );
};

export default KeyPad;
