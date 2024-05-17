import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    if (localStorage.getItem("token")) {
        return <Navigate to="/" />;
    } else {
        return <Outlet />;
    }
};

export default PublicRoute;
