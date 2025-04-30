import React from "react";
import axios from 'axios';
import apiEndpoints from "./apiEndpoints";
import config from "../config/config.json"


const apiClient = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  });


export const getHomeData = async (user_id) => {
    console.log(apiEndpoints.home,'apiEndpoints.home');
    
    try{
        const response = await axios.get(`${config.API_BASE_URL}${apiEndpoints.home}`, {
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


