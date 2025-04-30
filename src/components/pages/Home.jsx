import React, { useEffect, useState, useContext } from "react";
import { getHomeData } from "../services/HomePageData";
import { UserContext } from "../../UserContext"; 
import useNotification from "../services/Notification";




const Home = () => {
    const [homeData, setHomeData] = useState(null); 
    const [error, setError] = useState(null); 
    const { user } = useContext(UserContext);
    const user_id = user ? user.id : null; 

    console.log(user_id, 'user_id');
    console.log(homeData, 'homeData');

    const { sendNotification } = useNotification();
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
      });
    }
  }, []);




    useEffect(() => {
        const fetchHomeData = async () => {
            if (!user_id) {
                setError("User ID is not available");
                return;
            }

            console.log("Fetching data...");
            try {
                const response = await getHomeData(user_id);
                console.log("API Response:", response.data);

                if (Array.isArray(response.data)) {
                    setHomeData(response.data); 
                } else if (typeof response.data === 'object') {
                    setHomeData([response.data]); 
                } else {
                    setError("Data is not in the expected format");
                }
            } catch (err) {
                console.error("Error fetching home data:", err);
                setError(err.message); 
            }
        };

        fetchHomeData();
    }, [user_id]); 

    // return (
    //     <div>
    //         <h2>Hello User</h2>
    //         {error ? (
    //             <p>Error: {error}</p> 
    //         ) : (
    //             <div>
    //                 {homeData && homeData.length === 1 ? (
    //                     <div>
    //                         <h3>Single User</h3>
    //                         <p>{JSON.stringify(homeData[0], null, 2)}</p> 
    //                     </div>
    //                 ) : (
    //                     <ul>
    //                         {homeData && homeData.map((item, index) => (
    //                             <li key={index}>
    //                                 {JSON.stringify(item, null, 2)} 
    //                             </li>
    //                         ))}
    //                     </ul>
    //                 )}
    //             </div>
    //         )}
    //     </div>
    // );

    return (
        <div>
            <img src="/dashboard_img.png" />
        </div>
    )


};

export default Home;
