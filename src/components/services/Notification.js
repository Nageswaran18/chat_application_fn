import { useEffect, useState } from "react";

function useNotification(userId) {
  const [permission, setPermission] = useState(Notification.permission);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]); 

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notifications/?user_id=${userId}`);
      const data = await response.json();
      if (data.result === false) {
        setNotifications(data.data); 
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
      });
    }

    fetchNotifications(); 

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?user_id=${userId}`);

    ws.onopen = () => {
      console.log("WebSocket Connected for Notifications");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.notification) {
        sendNotification("New Message", data.notification);
        setNotifications((prev) => [...prev, data.notification]); 
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };

  }, [userId]);

  const sendNotification = (title, message, icon = "/notification-icon.png") => {
    if (permission === "granted") {
      new Notification(title, {
        body: message,
        icon: icon,
      });
    } else if (permission === "denied") {
      alert("Notifications are blocked. Please enable them in browser settings.");
    }
  };

  return { sendNotification, notifications, permission, socket };
}

export default useNotification;
