import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Card, CardContent, CardActions, Chip } from "@mui/material";

import { getNotification, markAllReadNotification } from "../services/NotificationAPi";

const NotificationModal = ({ open, onClose, user_id }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotification = async () => {
    setLoading(true);
    try {
      const response = await getNotification(user_id);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };



  const handleMarkAllRead = async () => {
    try {
      const unreadNotificationIds = notifications
        .filter((notification) => !notification.read)
        .map((notification) => notification.id);

      await markAllReadNotification(user_id, unreadNotificationIds);

      await fetchNotification();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };


  useEffect(() => {
    if (open && user_id) {
      fetchNotification();
    }
  }, [open, user_id]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflowY: "auto",
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
      >
        <Box
        sx={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center'
        }}
        >

        <Typography variant="h6" component="h2" gutterBottom>
          Notifications
        </Typography>
        <Button
                onClick={handleMarkAllRead}
                variant="contained"
                color="primary"
                sx={{ padding: "10px 20px" }}
              >
                Mark all read
              </Button>
        </Box>

        {/* Show Loading indicator */}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              sx={{
                mt: 2,
                backgroundColor: notification.read ? "background.paper" : "#f0f0f0",
                borderLeft: notification.read ? "none" : "4px solid #1976d2",
              }}
            >
              <CardContent>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {notification.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.created_at).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                {!notification.read && <Chip label="Unread" size="small" color="primary" />}
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography>No new notifications.</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default NotificationModal;