import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const AppointmentList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const [appointments, setAppointments] = useState([]);
    const [requestedAppointments, setRequestedAppointments] = useState([]);
    const [doctorKey, setDoctorKey] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [ratingView, setRatingView] = useState(false);
    const [rating, setRating] = useState(null);

    //get requested appointments
    const getRequestedAppointments = useCallback(async () => {
        try {
            const res = await axios.get(
                "/api/v1/patient/get-all-requested-appointments",
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
    }, [setRequestedAppointments]);

    //get appointments
    const getAppointments = useCallback(async () => {
        try {
            const res = await axios.get(
                "/api/v1/patient/get-all-appointments",
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setAppointments(res.data.appointments);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setAppointments]);

    const cancelRequestedAppointmentHandler = async (record, type) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/patient/cancel-requested-appointment",
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
                "/api/v1/patient/cancel-appointment",
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

    const submitRatingHandler = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/patient/submit-rating",
                {
                    doctorKey,
                    createdAt,
                    rating,
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
            getAppointments();
            getRequestedAppointments();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getAppointments, getRequestedAppointments, effectRun]);

    const acceptedApointmentColumns = [
        {
            title: "Name",
            dataIndex: "doctorName",
        },
        {
            title: "Email",
            dataIndex: "doctorEmail",
        },
        {
            title: "Phone",
            dataIndex: "doctorPhone",
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
                    <button
                        className="btn btn-danger"
                        onClick={() =>
                            cancelAppointmentHandler(record, "canceled")
                        }
                    >
                        Cancel
                    </button>
                ) : record.status === "on going" ? (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/patient/session")}
                    >
                        Session
                    </button>
                ) : record.status === "ended" ? (
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            if (!ratingView) {
                                setRatingView(true);
                                setDoctorKey(record.doctorKey);
                                setCreatedAt(record.createdAt);
                            } else {
                                setRatingView(false);
                            }
                        }}
                    >
                        Give Ratings
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
            dataIndex: "doctorName",
        },
        {
            title: "Email",
            dataIndex: "doctorEmail",
        },
        {
            title: "Phone",
            dataIndex: "doctorPhone",
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
                        className="btn btn-danger m-1"
                        onClick={() =>
                            cancelRequestedAppointmentHandler(
                                record,
                                "canceled"
                            )
                        }
                    >
                        Cancel
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
                    {ratingView && (
                        <div className="d-flex justify-content-center m-2">
                            <h6 className="rating-label">Rate:</h6>
                            {[...Array(5)].map((star, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <label>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            onClick={() =>
                                                setRating(ratingValue)
                                            }
                                        />
                                        <FaStar
                                            className="star"
                                            color={
                                                ratingValue <= rating
                                                    ? "#ffc107"
                                                    : "#e4e5e9"
                                            }
                                            size={30}
                                        />
                                    </label>
                                );
                            })}
                            <button
                                className="rating-btn"
                                onClick={submitRatingHandler}
                            >
                                Submit
                            </button>
                        </div>
                    )}
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
                    {ratingView && (
                        <div className="d-flex justify-content-center m-2">
                            <h6 className="rating-label">Rate:</h6>
                            {[...Array(5)].map((star, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <label>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            onClick={() =>
                                                setRating(ratingValue)
                                            }
                                        />
                                        <FaStar
                                            className="star"
                                            color={
                                                ratingValue <= rating
                                                    ? "#ffc107"
                                                    : "#e4e5e9"
                                            }
                                            size={30}
                                        />
                                    </label>
                                );
                            })}
                            <button
                                className="rating-btn"
                                onClick={submitRatingHandler}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </>
            )}
        </Layout>
    );
};

export default AppointmentList;
