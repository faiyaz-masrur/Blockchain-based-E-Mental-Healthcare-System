import React, { useEffect } from "react";
import axios from "axios";
const HomePage = () => {
    const getUserData = async () => {
        try {
            const res = await axios.post("/api/v1/user/getUserData", {});
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);
    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
};

export default HomePage;
