import React from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const HomePage = () => {
    const { user } = useSelector((state) => state.user);

    if (user?.userType === "patient") {
        return <Navigate to="/patient/user-homepage" />;
    } else if (user?.userType === "admin") {
        return <Navigate to="/admin/admin-dashboard" />;
    } else if (user?.userType === "doctor") {
        return <Navigate to="/doctor/doctor-dashboard" />;
    } else {
        return (
            <Layout>
                <h3 className="p-2 text-center">
                    Home Page <hr />
                </h3>
            </Layout>
        );
    }
};

export default HomePage;
