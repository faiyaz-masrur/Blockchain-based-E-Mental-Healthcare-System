import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DoctorRoute({ children }) {
    const { user } = useSelector((state) => state.user);

    // check if the user is doctor
    if (user?.userType === "doctor") {
        return children;
    } else {
        return <Navigate to="/" />;
    }
}
