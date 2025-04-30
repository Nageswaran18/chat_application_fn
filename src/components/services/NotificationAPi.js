import React from "react";
import axios from 'axios';
import apiEndpoints from "./apiEndpoints";
import config from "../config/config.json"



export const getNotification = async (user_id) => {

    try{
        const response = await axios.get(`${config.API_BASE_URL}${apiEndpoints.notification}`, {
          params:{
            user_id:user_id
          }
        });
        return response.data
    } catch(err){
        console.error('Error fetching data:', err);
        throw err;
    }
}

export const markAllReadNotification = async (user_id, ids) => {
  try {
    const response = await axios.patch(
      `${config.API_BASE_URL}${apiEndpoints.notification_patch}`,
      { ids },
      {
        params: {
          user_id,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    throw err;
  }
};


