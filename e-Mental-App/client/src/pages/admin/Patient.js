import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const Patient = () => {
    const dispatch = useDispatch();
    const [patients, setPatients] = useState([]);

    //get patients
    const getPatients = async () => {
        try {
            const res = await axios.get("/api/v1/admin/get-all-patients", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setPatients(res.data.data);
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
                { key: record.nid, newStatus: status },
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
        getPatients();
    }, []);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
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
    return (
        <Layout>
            <h3 className="p-2 text-center">Patients List</h3>
            <Table columns={columns} dataSource={patients} />
        </Layout>
    );
};

export default Patient;
