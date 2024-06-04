import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const Researcher = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const effectRun = useRef(true);
    const [researchers, setResearchers] = useState([]);
    const [appliedResearchers, setAppliedResearchers] = useState([]);

    //get doctors
    const getAppliedResearcher = useCallback(async () => {
        try {
            const res = await axios.get(
                "/api/v1/admin/get-all-applied-researchers",
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setAppliedResearchers(res.data.appliedResearchers);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setAppliedResearchers]);

    //get doctors
    const getResearcher = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/admin/get-all-researchers", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setResearchers(res.data.researchers);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setResearchers]);

    const changeStatusHandler = async (record, status) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/admin/change-researcher-status",
                {
                    key: record.nid,
                    newStatus: status,
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
            getAppliedResearcher();
            getResearcher();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getResearcher, getAppliedResearcher, effectRun]);
    const acceptedResearchersColumn = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Type",
            dataIndex: "userType",
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    <button
                        className="btn btn-primary m-1"
                        onClick={() =>
                            navigate(
                                `/admin/get-researcher-details/${record.nid}`
                            )
                        }
                    >
                        View
                    </button>
                    {record.status === "blocked" ? (
                        <button
                            className="btn btn-success m-1"
                            onClick={() =>
                                changeStatusHandler(record, "approved")
                            }
                        >
                            Approve
                        </button>
                    ) : (
                        <button
                            className="btn btn-danger m-1"
                            onClick={() =>
                                changeStatusHandler(record, "blocked")
                            }
                        >
                            Block
                        </button>
                    )}
                </div>
            ),
        },
    ];
    const appliedResearchersColumn = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Degree",
            dataIndex: "degree",
        },
        {
            title: "Institute",
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
                        className="btn btn-primary m-1"
                        onClick={() =>
                            navigate(
                                `/admin/get-researcher-details/${record.nid}`
                            )
                        }
                    >
                        View
                    </button>
                    <button
                        className="btn btn-success m-1"
                        onClick={() => changeStatusHandler(record, "approved")}
                    >
                        Accept
                    </button>
                    <button
                        className="btn btn-danger m-1"
                        onClick={() => changeStatusHandler(record, "rejected")}
                    >
                        Reject
                    </button>
                </div>
            ),
        },
    ];
    return (
        <Layout>
            <h3 className="p-2 text-center">
                Researcher List <hr />{" "}
            </h3>
            {appliedResearchers.length === 0 ? (
                <>
                    <h6 className="m-2">Accepted Researcher:</h6>
                    <Table
                        columns={acceptedResearchersColumn}
                        dataSource={researchers}
                    />
                    <h6 className="m-2">Pending Requests:</h6>
                    <Table
                        columns={appliedResearchersColumn}
                        dataSource={appliedResearchers}
                    />
                </>
            ) : (
                <>
                    <h6 className="m-2">Pending Requests:</h6>
                    <Table
                        columns={appliedResearchersColumn}
                        dataSource={appliedResearchers}
                    />
                    <h6 className="m-2">Accepted Researcher:</h6>
                    <Table
                        columns={acceptedResearchersColumn}
                        dataSource={researchers}
                    />
                </>
            )}
        </Layout>
    );
};

export default Researcher;
