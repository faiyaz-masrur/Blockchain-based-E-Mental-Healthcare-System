import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

const DoctorRoute = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    //get user
    const getUser = useCallback(async () => {
        try {
            const res = await axios.post(
                "/api/v1/user/getUserData",
                { token: localStorage.getItem("token") },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (res.data.success) {
                if (res.data.data.userType === "doctor") {
                    dispatch(setUser(res.data.data));
                } else {
                    <Navigate to="/" />;
                }
            } else {
                localStorage.clear();
                <Navigate to="/login" />;
            }
        } catch (error) {
            localStorage.clear();
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user, getUser]);

    if (localStorage.getItem("token")) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
};

export default DoctorRoute;
