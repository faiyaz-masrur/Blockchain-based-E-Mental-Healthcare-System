import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PatientRoute({ children }) {
    const { user } = useSelector((state) => state.user);

    // check if the user is patient
    if (user?.userType === "patient") {
        return children;
    } else {
        return <Navigate to="/" />;
    }
}
