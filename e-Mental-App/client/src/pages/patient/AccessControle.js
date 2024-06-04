import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const AccessControle = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const [accessList, setAccessList] = useState([]);
    const [requestedAccessList, setRequestedAccessList] = useState([]);

    //get requested appointments
    const getRequestedAccessList = useCallback(async () => {
        try {
            const res = await axios.get(
                "/api/v1/patient/get-all-requested-access",
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setRequestedAccessList(res.data.requestedAccessList);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setRequestedAccessList]);

    //get appointments
    const getAccessList = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/patient/get-all-access", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setAccessList(res.data.accessList);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setAccessList]);

    const actionRequestedAccessHandler = async (record, type) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/patient/action-requested-access",
                {
                    userKey: record.userKey,
                    type: type,
                },
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
        }
    };

    const removeAccessHandler = async (record) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/patient/remove-access",
                {
                    userKey: record.userKey,
                },
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
        }
    };

    useEffect(() => {
        if (effectRun.current) {
            getAccessList();
            getRequestedAccessList();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getAccessList, getRequestedAccessList, effectRun]);

    const requestAccessColumn = [
        {
            title: "Name",
            dataIndex: "userName",
        },
        {
            title: "Institute/Clinic",
            dataIndex: "address",
        },
        {
            title: "Type",
            dataIndex: "userType",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    <button
                        className="btn btn-secondary m-2"
                        onClick={() => {
                            navigate(
                                `/patient/get-doctor-details/${record.userKey}`
                            );
                        }}
                    >
                        View
                    </button>
                    <button
                        className="btn btn-success m-2"
                        onClick={() =>
                            actionRequestedAccessHandler(record, "accepted")
                        }
                    >
                        Accept
                    </button>
                    <button
                        className="btn btn-danger m-2"
                        onClick={() =>
                            actionRequestedAccessHandler(record, "rejected")
                        }
                    >
                        Reject
                    </button>
                </div>
            ),
        },
    ];
    const acceptedAccessColumn = [
        {
            title: "Name",
            dataIndex: "userName",
        },
        {
            title: "Institute/Clinic",
            dataIndex: "address",
        },
        {
            title: "Type",
            dataIndex: "userType",
        },
        {
            title: "Time",
            dataIndex: "createdAt",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    <button
                        className="btn btn-secondary m-2"
                        onClick={() => {
                            navigate(
                                `/patient/get-doctor-details/${record.userKey}`
                            );
                        }}
                    >
                        View
                    </button>
                    <button
                        className="btn btn-danger m-2"
                        onClick={() => removeAccessHandler(record)}
                    >
                        Remove
                    </button>
                </div>
            ),
        },
    ];
    return (
        <Layout>
            <h3 className="p-2 text-center">
                Record Access List <hr />{" "}
            </h3>
            {requestedAccessList.length === 0 ? (
                <>
                    <h6 className="m-2">Accepted Access:</h6>
                    <Table
                        columns={acceptedAccessColumn}
                        dataSource={accessList}
                    />
                    <h6 className="m-2">Access Request:</h6>
                    <Table
                        columns={requestAccessColumn}
                        dataSource={requestedAccessList}
                    />
                </>
            ) : (
                <>
                    <h6 className="m-2">Access Request:</h6>
                    <Table
                        columns={requestAccessColumn}
                        dataSource={requestedAccessList}
                    />
                    <h6 className="m-2">Accepted Access:</h6>
                    <Table
                        columns={acceptedAccessColumn}
                        dataSource={accessList}
                    />
                </>
            )}
        </Layout>
    );
};

export default AccessControle;
