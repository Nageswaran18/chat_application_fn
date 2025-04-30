import { useEffect, useState , useContext} from "react";
import { getHomeData } from "../services/HomePageData";
import ChatLeftSide from "../chat_sub_components/ChatLeftSide";
import ChatRightSide from "../chat_sub_components/ChatRightSide";
import { Box } from "@mui/material";
import ProfileDetail from "../chat_sub_components/ProfileDetail";
import {UserContext} from "../../UserContext"


const Chat = () => {
    const [userData, setUserData] = useState([])
    console.log(userData,'userData');
    const [selectedUser, setSelectedUser] = useState(null);
    console.log(selectedUser,'selectedUser');
    
    const {user} = useContext(UserContext)
    console.log(user);
    
    
    
    const [error, setError] = useState(null)

useEffect(() => {
    const fetchUserData = async () => {
        try{
            const response = await getHomeData()
            const excludeCurrenntUser = response.data.filter(item => item.id !==user.id )
            setUserData(excludeCurrenntUser)
        }catch(err){
            console.log("error occured ", err);
            setError(err)
        }
    };
    fetchUserData()
},[])


return (
    <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Left Side */}
        <ChatLeftSide userData={userData} onUserSelect={setSelectedUser} />
        {/* Right Side */}
        <ChatRightSide selectedUser={selectedUser} />

    </Box>
);
};

export default Chat
