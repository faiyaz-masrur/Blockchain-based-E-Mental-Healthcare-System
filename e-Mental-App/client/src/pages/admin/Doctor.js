import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const Doctor = () => {
    const dispatch = useDispatch();
    const [doctors, setDoctors] = useState([]);
    const [appliedDoctors, setAppliedDoctors] = useState([]);

    //get patients
    const getDoctors = async () => {
        try {
            const res = await axios.get("/api/v1/admin/get-all-doctors", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setDoctors(res.data.data);
                setAppliedDoctors(res.data.requestData);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const changeStatusHandler = async (record, status) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/admin/change-user-status",
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
        getDoctors();
    }, []);
    const approvedDoctorsColumns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "Specialization",
            dataIndex: "specialization",
        },
        {
            title: "Experience",
            dataIndex: "experience",
        },
        {
            title: "Fees",
            dataIndex: "fees",
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
                    {record.status === "blocked" ? (
                        <button
                            className="btn btn-success"
                            onClick={() =>
                                changeStatusHandler(record, "approved")
                            }
                        >
                            Approve
                        </button>
                    ) : (
                        <button
                            className="btn btn-danger"
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
    const requestedDoctorsColumns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "Specialization",
            dataIndex: "specialization",
        },
        {
            title: "Experience",
            dataIndex: "experience",
        },
        {
            title: "Fees",
            dataIndex: "fees",
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
                        className="btn btn-success m-1"
                        onClick={() => changeStatusHandler(record, "approved")}
                    >
                        Approve
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
            <h3 className="p-2 text-center">Doctors List</h3>
            <h6 className="m-2">Doctors Request:</h6>
            <Table
                columns={requestedDoctorsColumns}
                dataSource={appliedDoctors}
            />
            <h6 className="m-2">Approved Doctors:</h6>
            <Table columns={approvedDoctorsColumns} dataSource={doctors} />
        </Layout>
    );
};

export default Doctor;
