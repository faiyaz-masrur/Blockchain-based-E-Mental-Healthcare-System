import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdninRoute({ children }) {
    const { user } = useSelector((state) => state.user);

    // check if the user is admin
    if (user?.userType === "admin") {
        return children;
    } else {
        return <Navigate to="/" />;
    }
}
