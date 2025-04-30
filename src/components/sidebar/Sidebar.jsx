import React, { useState, useEffect, useContext } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import { UserContext } from '../../UserContext';
import { getHomeData } from '../services/HomePageData';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationModal from './NotificationModal';


const AppSidebar = ({ collapsed, toggleSidebar }) => {
    const [activePath, setActivePath] = useState("");
    const location = useLocation();
    const {user} = useContext(UserContext);
    const user_id = user ? user.id : null; 
    console.log(user_id, 'user_id');
    const [userData , setuserData] = useState([])
    console.log(userData,'dads');
    const [modalOpen, setModalOpen] = useState(false); 
    


    const fetchHomeData = async() => {
        if (!user_id){
            console.log("User ID is not available");
            return;
        }
        try{
            const response = await getHomeData(user_id);
            
           setuserData(response.data)
        }  catch (err) {
            console.error("Error fetching home data:", err);
        }
    } 


    useEffect(() => {
        fetchHomeData();
    },[user_id])

    // const user = {
    //     name: "John Doe",
    //     avatarUrl: "https://i.pravatar.cc/100" 
    // };

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location.pathname]);

    return (
        <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
            <button className="hamburger-menu" onClick={toggleSidebar}>
                <MenuIcon />
            </button>

            <Sidebar collapsed={collapsed}>
                {/* Scrollable Menu */}
                <div className="sidebar-menu">
                    <Menu>
                        <MenuItem
                            icon={<DashboardIcon />}
                            component={<Link to="/home" />}
                            className={`menu-item ${activePath === '/home' ? 'active' : ''}`}
                        >
                            Dashboard
                        </MenuItem>
                        <MenuItem
                            icon={<ChatIcon />}
                            component={<Link to="/chat" />}
                            className={`menu-item ${activePath === '/chat' ? 'active' : ''}`}
                        >
                            Chat
                        </MenuItem>
                        <MenuItem
                            icon={<ShoppingCartIcon />}
                            component={<Link to="/e-commerce" />}
                            className={`menu-item ${activePath === '/e-commerce' ? 'active' : ''}`}
                        >
                            E-commerce
                        </MenuItem>
                    </Menu>
                </div>

                {/* Fixed Profile Section */}
                <div className="sidebar-footer">
                    <Avatar src={userData.profile_pic} alt={userData.username} className="user-avatar" />
                    {!collapsed && <span className="user-name">{userData.username}</span>}

                    {/* Notification Icon */}
                    <div className="notification-icon" onClick={() => setModalOpen(true)}>
                        <NotificationsIcon />
                    </div>
                </div>
            </Sidebar>
            <NotificationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                user_id={user_id}
            />
        </div>
    );
};

export default AppSidebar;
