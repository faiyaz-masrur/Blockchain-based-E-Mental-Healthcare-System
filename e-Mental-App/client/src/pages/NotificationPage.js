import React, { useEffect, useRef, useState, useCallback } from "react";
import Layout from "./../components/Layout";
import { Tabs, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const [unSeenNotifications, setUnSeenNotifications] = useState([]);
    const [seenNotifications, setSeenNotifications] = useState([]);

    const getNotifications = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/user/get-all-notifications", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setUnSeenNotifications(res.data.unSeenNotifications);
                setSeenNotifications(res.data.seenNotifications);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setUnSeenNotifications, setSeenNotifications]);

    const handleMarkAllSeen = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/mark-all-notifications",
                {},
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log("Error: ", error);
            message.error("Something went wrong!");
        }
    };
    const handleDeleteAll = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/delete-all-notifications",
                {},
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log("Error: ", error);
            message.error("Something went wrong!");
        }
    };

    useEffect(() => {
        if (effectRun.current) {
            getNotifications();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getNotifications, effectRun]);
    return (
        <Layout>
            <h3 className="p-2 text-center">Notification Page</h3>
            <Tabs>
                <Tabs.TabPane tab="unSeen" key={0}>
                    <div className="d-flex justify-content-end">
                        <h6
                            className="p-2 text-primary"
                            onClick={handleMarkAllSeen}
                            style={{ cursor: "pointer" }}
                        >
                            Mark All Seen
                        </h6>
                    </div>
                    {unSeenNotifications?.map((notificationMsg) => (
                        <div className="card" style={{ cursor: "pointer" }}>
                            <div
                                className="card-text"
                                onClick={() =>
                                    navigate(notificationMsg.onClickPath)
                                }
                            >
                                {notificationMsg.message}
                            </div>
                        </div>
                    ))}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Seen" key={1}>
                    <div className="d-flex justify-content-end">
                        <h6
                            className="p-2 text-danger"
                            onClick={handleDeleteAll}
                            style={{ cursor: "pointer" }}
                        >
                            Delete All
                        </h6>
                    </div>
                    {seenNotifications?.map((notificationMsg) => (
                        <div className="card" style={{ cursor: "pointer" }}>
                            <div
                                className="card-text"
                                onClick={() =>
                                    navigate(notificationMsg.onClickPath)
                                }
                            >
                                {notificationMsg.message}
                            </div>
                        </div>
                    ))}
                </Tabs.TabPane>
            </Tabs>
        </Layout>
    );
};

export default NotificationPage;
