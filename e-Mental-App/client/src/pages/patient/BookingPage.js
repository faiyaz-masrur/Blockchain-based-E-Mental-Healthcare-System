import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker, TimePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import Layout from "../../components/Layout";
import dayjs from "dayjs";

const BookingPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const effectRun = useRef(true);
    const { user } = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);
    const [toViewDate, setToViewDate] = useState(null);
    const [toViewTime, setToViewTime] = useState(null);
    const [toStoreDate, setToStoreDate] = useState(null);
    const [toStoreTime, setToStoreTime] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);

    const onChangeDate = (value) => {
        setIsAvailable(false);
        setToViewDate(value);
        setToStoreDate(dayjs(value).format("YYYY-MM-DD"));
    };
    const onChangeTime = (value) => {
        setIsAvailable(false);
        setToViewTime(value);
        setToStoreTime(dayjs(value).format("HH:mm"));
    };

    //get doctor details
    const getDoctor = useCallback(async () => {
        try {
            const res = await axios.post(
                "/api/v1/patient/get-doctor-byId",
                {
                    doctorKey: params.doctorKey,
                    dataQuantity: "half",
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setDoctor(res.data.data);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [params, setDoctor]);

    const handleBooking = async (values) => {
        try {
            setIsAvailable(true);
            if (!toViewDate && !toViewTime) {
                return alert("Date and Time is required");
            }
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/patient/book-appointment",
                {
                    doctorKey: doctor.nid,
                    patientKey: user.nid,
                    doctorName: doctor.name,
                    doctorEmail: doctor.email,
                    doctorPhone: doctor.phone,
                    patientName: user.name,
                    patientEmail: user.email,
                    patientPhone: user.phone,
                    fees: doctor.fees,
                    specialization: doctor.specialization,
                    duration: parseInt(doctor.consultationDuration) - 1,
                    date: toStoreDate,
                    startTime: toStoreTime,
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                if (res.data.session.url) {
                    window.location.href = res.data.session.url;
                }
            } else {
                dispatch(hideLoading());
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something Went Wrong!");
        }
    };

    const handleCheckBookingTime = async (values) => {
        try {
            const res = await axios.post(
                "/api/v1/patient/check-booking-time",
                {
                    doctorKey: doctor.nid,
                    consultationStartTime: doctor.consultationStartTime,
                    consultationEndTime: doctor.consultationEndTime,
                    date: toStoreDate,
                    time: toStoreTime,
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setIsAvailable(true);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            message.error("Something Went Wrong!");
        }
    };

    useEffect(() => {
        if (effectRun.current) {
            getDoctor();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getDoctor, effectRun]);

    return (
        <Layout>
            <h3 className="p-2 text-center">
                Booking Page <hr />
            </h3>
            <div className="container m-2 text-center">
                {doctor && (
                    <div>
                        <h4>Dr. {doctor.name}</h4>
                        <h6>{doctor.specialization}</h6>
                        <h6>Fees: {doctor.fees}</h6>
                        <h6>
                            Consultation Time: {doctor.consultationStartTime} -{" "}
                            {doctor.consultationEndTime}
                        </h6>
                        <h6>Duration: {doctor.consultationDuration} minutes</h6>
                        <div className="d-flex justify-content-center p-2">
                            <div className="m-2">
                                <p>
                                    <b>Choose Date:</b>
                                </p>
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    value={toViewDate}
                                    onChange={onChangeDate}
                                />
                            </div>
                            <div className="m-2">
                                <p>
                                    <b>Consultation Time:</b>
                                </p>
                                <TimePicker
                                    format="HH:mm a"
                                    use12Hours={true}
                                    value={toViewTime}
                                    onChange={onChangeTime}
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-primary m-2 w-50"
                            onClick={handleCheckBookingTime}
                        >
                            Check Availability
                        </button>
                        {isAvailable && (
                            <button
                                className="btn btn-dark m-2 w-50"
                                onClick={handleBooking}
                            >
                                Book Now
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookingPage;
