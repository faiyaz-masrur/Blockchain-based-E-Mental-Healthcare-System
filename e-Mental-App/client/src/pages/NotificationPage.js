import React from "react";
import Layout from "./../components/Layout";
import { Tabs, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/get-all-notification",
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
    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/delete-all-notification",
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
    return (
        <Layout>
            <h3 className="p-2 text-center">Notification Page</h3>
            <Tabs>
                <Tabs.TabPane tab="unRead" key={0}>
                    <div className="d-flex justify-content-end">
                        <h6
                            className="p-2 text-primary"
                            onClick={handleMarkAllRead}
                            style={{ cursor: "pointer" }}
                        >
                            Mark All Read
                        </h6>
                    </div>
                    {user?.notification.map((notificationMsg) => (
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
                <Tabs.TabPane tab="Read" key={1}>
                    <div className="d-flex justify-content-end">
                        <h6
                            className="p-2 text-danger"
                            onClick={handleDeleteAllRead}
                            style={{ cursor: "pointer" }}
                        >
                            Delete All Read
                        </h6>
                    </div>
                    {user?.seenNotification.map((notificationMsg) => (
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
