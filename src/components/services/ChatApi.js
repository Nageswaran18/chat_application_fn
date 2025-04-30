import axios from 'axios';
import apiEndpoints from "./apiEndpoints";
import config from "../config/config.json"



export const fetchMessage = async (senderId, receiverId) => {
    try{
        const response = await axios.get(`${config.API_BASE_URL}${apiEndpoints.chat_message_get}`,{
            params:{
                sender_id:senderId,
                receiver_id:receiverId
            }
        })

        return response.data
    } catch (err){
        throw err
    }
}