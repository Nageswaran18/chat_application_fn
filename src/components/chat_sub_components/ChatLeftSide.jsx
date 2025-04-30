import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box } from "@mui/material";
import config from "../config/config.json"
import { useState } from "react";
import ChatRightSide from "./ChatRightSide";

const ChatLeftSide = ({ userData, onUserSelect }) => {
    if (!userData || userData.length === 0) {
        return <div>No users available</div>;
    }


    const handleLeftIndividualClick = (user) => {
        onUserSelect(user)
    }

    return (
        <Box
            sx={{
                width: "300px",
                height: "100vh",
                backgroundColor: "#f5f5f5",
                overflowY: "auto",
                boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    textAlign: "center",
                    padding: "16px",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                }}
            >
                Chats
            </Typography>
            <List>
                {userData.map((user, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "#e8f4ff",
                            },
                        }}
                        onClick ={() => handleLeftIndividualClick(user)}
                    >
                        <ListItemAvatar>
                            <Avatar
                                src={user.profile_pic ? `${config.API_BASE_URL}${user.profile_pic}` : null}
                                alt={user.username}
                                sx={{ backgroundColor: user.profile_pic ? "transparent" : "#1976d2" }}
                            >
                                {!user.profile_pic && user.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={user.username}
                            // secondary={user.email}
                            primaryTypographyProps={{
                                fontWeight: "bold",
                                color: "#333",
                            }}
                            secondaryTypographyProps={{
                                fontSize: "12px",
                                color: "#777",
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ChatLeftSide;
