import React, { useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const ConfirmAppointment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const { appointmentId } = useParams();

    const confirmAppointment = useCallback(async () => {
        try {
            dispatch(showLoading());
            message.success("Payment successful");
            const res = await axios.post(
                `/api/v1/patient/confirm-appointment/${appointmentId}`,
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
                navigate("/patient/appointments");
                message.success(res.data.message);
            } else {
                navigate("/patient/appointments");
                message.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            message.error("Something went wrong");
        }
    }, [dispatch]);

    useEffect(() => {
        if (effectRun.current) {
            confirmAppointment();
        }

        return () => {
            effectRun.current = false;
        };
    }, [confirmAppointment, effectRun]);
};

export default ConfirmAppointment;
