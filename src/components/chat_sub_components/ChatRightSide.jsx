import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
import ChatBanner from "./ChatBanner";
import KeyPad from "./KeyPad";
import { useEffect, useRef, useState, useContext } from "react";
import { fetchMessage } from "../services/ChatApi";
import { UserContext } from "../../UserContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ChatRightSide = ({ selectedUser }) => {
    const [allMessages, setAllMessages] = useState({});
    const { user } = useContext(UserContext);
    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);
    const user_id = user.id;
    const [showScrollButton, setShowScrollButton] = useState(false);
    const chatContainerRef = useRef(null);

    // Fetch messages when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            const fetchChatMessages = async () => {
                try {
                    const response = await fetchMessage(user_id, selectedUser.id);
                    setAllMessages(response.data || {});
                } catch (err) {
                    console.log("Error fetching messages:", err);
                }
            };
            fetchChatMessages();
        }
    }, [selectedUser]);

    // WebSocket connection
    useEffect(() => {
        if (!selectedUser) return;

        if (wsRef.current) {
            wsRef.current.close();
        }

        const wsUrl = `ws://127.0.0.1:8000/ws/chat/?sender_id=${user_id}&receiver_id=${selectedUser.id}`;
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            console.log("WebSocket connected");
        };

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);
        
            if (!data.timestamp) {
                console.error("Missing timestamp in received message:", data);
                return;
            }
        
            // Ignore messages that were sent by the current user (avoid duplication)
            if (data.sender === user_id) return;
        
            setAllMessages((prevMessages) => {
                if (!prevMessages || typeof prevMessages !== "object") prevMessages = {};
        
                const dateKey = data.timestamp.split("T")[0];
        
                // Prevent duplicate messages
                const existingMessages = prevMessages[dateKey] || [];
                if (existingMessages.some(msg => msg.timestamp === data.timestamp && msg.message === data.message)) {
                    return prevMessages;
                }
        
                return {
                    ...prevMessages,
                    [dateKey]: [...existingMessages, data],
                };
            });
        
            scrollToBottom();
        };
        wsRef.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        wsRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [selectedUser]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages]);

    const handleSendMessage = (message) => {
        if (wsRef.current && message.trim() !== "") {
            const timestamp = new Date().toISOString();

            const newMessage = {
                sender: user_id,
                receiver: selectedUser.id,
                message: message.trim(),
                timestamp: timestamp,
            };

            const dateKey = timestamp.split("T")[0];

            wsRef.current.send(JSON.stringify(newMessage));

            setAllMessages((prevMessages) => {
                const existingMessages = prevMessages[dateKey] || [];

                // Prevent duplicate messages
                if (existingMessages.some(msg => msg.timestamp === timestamp && msg.message === message.trim())) {
                    return prevMessages;
                }

                return {
                    ...prevMessages,
                    [dateKey]: [...existingMessages, newMessage],
                };
            });
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

            setShowScrollButton(!isNearBottom);
        }
    };

    const getDisplayDate = (date) => {
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        }
    };

    if (!selectedUser) {
        return (
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                }}
            >
                <Typography variant="h6" color="textSecondary">
                    Select a chat to start messaging
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                backgroundColor: "#f0f0f0",
            }}
        >
            {/* Chat Banner */}
            <ChatBanner selectedUser={selectedUser} />

            {/* Chat Messages */}
            <Box
                ref={chatContainerRef}
                sx={{
                    flex: 1,
                    padding: "20px",
                    overflowY: "auto",
                    position: "relative",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                    },
                }}
                onScroll={handleScroll}
            >
                {Object.keys(allMessages).map((date) => {
                    const displayDate = getDisplayDate(date);

                    return (
                        <Box key={date}>
                            {/* Date Header */}
                            <Box sx={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        backgroundColor: "#e0e0e0",
                                        padding: "6px 12px",
                                        borderRadius: "10px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {displayDate}
                                </Typography>
                            </Box>

                            {/* Messages for this date */}
                            {allMessages[date].map((msg, index) => {
                                const isLastMessage = index === allMessages[date].length - 1;
                                const isSentByUser = msg.sender === user_id;

                                // Check if this is the last message sent by the current user
                                const isLastMessageByUser = isSentByUser && isLastMessage;

                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: msg.sender === user_id ? "flex-end" : "flex-start",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                maxWidth: "70%",
                                                backgroundColor: msg.sender === user_id ? "#dcf8c6" : "#ffffff",
                                                borderRadius: "10px",
                                                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            <CardContent sx={{ padding: "8px 12px" }}>
                                                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                                    {msg.message}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: "block",
                                                        textAlign: msg.sender === user_id ? "right" : "left",
                                                        color: "text.secondary",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Typography>
                                                {/* Display "Seen" or "Unseen" only for the last message sent by the current user */}
                                                {/* 
                                                {isLastMessageByUser && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: "block",
                                                            textAlign: "right",
                                                            fontWeight: "bold",
                                                            color: msg.is_read ? "#4CAF50" : "#F44336",
                                                            marginTop: "4px",
                                                        }}
                                                    >
                                                        {msg.is_read ? "Seen" : "Unseen"}
                                                    </Typography>
                                                )}
                                                     */}
                                            </CardContent>
                                        </Card>
                                    </Box>
                                );
                            })}
                        </Box>
                    );
                })}
                <div ref={messagesEndRef} />
            </Box>

            {/* Scroll to bottom button */}
            {showScrollButton && (
                <IconButton
                    sx={{
                        position: "fixed",
                        bottom: "100px",
                        right: "60px",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 10,
                        "&:hover": {
                            backgroundColor: "#1565c0",
                        },
                    }}
                    onClick={scrollToBottom}
                >
                    <KeyboardArrowDownIcon />
                </IconButton>
            )}

            {/* KeyPad */}
            <Box
                sx={{
                    position: "sticky",
                    bottom: 0,
                    width: "100%",
                    backgroundColor: "#f8f8f8",
                    borderTop: "1px solid #ddd",
                }}
            >
                <KeyPad onSendMessage={handleSendMessage} />
            </Box>
        </Box>
    );
};

export default ChatRightSide;