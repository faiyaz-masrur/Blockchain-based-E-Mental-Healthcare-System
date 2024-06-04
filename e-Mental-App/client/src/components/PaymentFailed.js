import React, { useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const PaymentFailed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const { doctorKey } = useParams();

    const failed = useCallback(async () => {
        try {
            dispatch(showLoading());
            navigate(`/patient/book-appointemnt/${doctorKey}`);
            message.error("Payment failed");
            dispatch(hideLoading());
        } catch (error) {
            console.log(error);
            message.error("Something went wrong");
        }
    }, [dispatch]);

    useEffect(() => {
        if (effectRun.current) {
            failed();
        }

        return () => {
            effectRun.current = false;
        };
    }, [failed, effectRun]);
};

export default PaymentFailed;
