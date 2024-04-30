import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const AppointmentList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [requestedAppointments, setRequestedAppointments] = useState([]);

    const getRequestedAppointments = async () => {
        try {
            const res = await axios.get(
                "/api/v1/doctor/get-all-requested-appointments",
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setRequestedAppointments(res.data.requestedAppointments);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const getAppointments = async () => {
        try {
            const res = await axios.get("/api/v1/doctor/get-all-appointments", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setAppointments(res.data.appointments);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const actionRequestedAppointmentHandler = async (record, type) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/action-requested-appointment",
                {
                    doctorKey: record.doctorKey,
                    patientKey: record.patientKey,
                    createdAt: record.createdAt,
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

    const cancelAppointmentHandler = async (record, type) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/cancel-appointment",
                {
                    doctorKey: record.doctorKey,
                    patientKey: record.patientKey,
                    createdAt: record.createdAt,
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

    const changeAppointmentStatusHandler = async (record, newStatus) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/change-appointment-status",
                {
                    doctorKey: record.doctorKey,
                    patientKey: record.patientKey,
                    createdAt: record.createdAt,
                    newStatus: newStatus,
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
        getAppointments();
        getRequestedAppointments();
    }, []);

    const acceptedApointmentColumns = [
        {
            title: "Name",
            dataIndex: "patientName",
        },
        {
            title: "Email",
            dataIndex: "patientEmail",
        },
        {
            title: "Phone",
            dataIndex: "patientPhone",
        },
        {
            title: "Date",
            dataIndex: "date",
        },
        {
            title: "Time",
            dataIndex: "startTime",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) =>
                record.status === "scheduled" ? (
                    <>
                        <button
                            className="btn btn-primary m-1"
                            onClick={() =>
                                changeAppointmentStatusHandler(
                                    record,
                                    "on going"
                                )
                            }
                        >
                            Create
                        </button>
                        <button
                            className="btn btn-danger m-1"
                            onClick={() =>
                                cancelAppointmentHandler(record, "canceled")
                            }
                        >
                            Cancel
                        </button>
                    </>
                ) : record.status === "on going" ? (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/doctor/session")}
                    >
                        Session
                    </button>
                ) : (
                    <button
                        className="btn btn-danger"
                        onClick={() =>
                            cancelAppointmentHandler(record, "removed")
                        }
                    >
                        Remove
                    </button>
                ),
        },
    ];
    const requestedAppointmentColumns = [
        {
            title: "Name",
            dataIndex: "patientName",
        },
        {
            title: "Email",
            dataIndex: "patientEmail",
        },
        {
            title: "Phone",
            dataIndex: "patientPhone",
        },
        {
            title: "Date",
            dataIndex: "date",
        },
        {
            title: "Time",
            dataIndex: "startTime",
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
                        className="btn btn-success m-1"
                        onClick={() =>
                            actionRequestedAppointmentHandler(
                                record,
                                "approved"
                            )
                        }
                    >
                        Accept
                    </button>
                    <button
                        className="btn btn-danger m-1"
                        onClick={() =>
                            actionRequestedAppointmentHandler(
                                record,
                                "rejected"
                            )
                        }
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
                Appointment List <hr />{" "}
            </h3>
            {requestedAppointments.length === 0 ? (
                <>
                    <h6 className="m-2">Accepted Appointments:</h6>
                    <Table
                        columns={acceptedApointmentColumns}
                        dataSource={appointments}
                    />
                    <h6 className="m-2">Pending Appointments:</h6>
                    <Table
                        columns={requestedAppointmentColumns}
                        dataSource={requestedAppointments}
                    />
                </>
            ) : (
                <>
                    <h6 className="m-2">Appointment Requests:</h6>
                    <Table
                        columns={requestedAppointmentColumns}
                        dataSource={requestedAppointments}
                    />
                    <h6 className="m-2">Accepted Appointments:</h6>
                    <Table
                        columns={acceptedApointmentColumns}
                        dataSource={appointments}
                    />
                </>
            )}
        </Layout>
    );
};

export default AppointmentList;
