import React from "react";
import "../styles/RegisterStyles.css";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // form handler
    const onFinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/login", values);
            dispatch(hideLoading());
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                message.success("Login Successful");
                navigate("/");
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something Went Wrong!");
        }
    };
    return (
        <>
            <div className="form-container">
                <div className="log-reg-header">
                    <h3>Login Form</h3>
                </div>
                <div className="log-reg-body">
                    <div className="form-div">
                        <Form
                            layout="vertical"
                            onFinish={onFinishHandler}
                            className="register-form"
                        >
                            <Form.Item label="User ID || NID" name="nid">
                                <Input type="text" required />
                            </Form.Item>
                            <Form.Item label="Password" name="password">
                                <Input type="password" required />
                            </Form.Item>
                            <button className="btn btn-primary" type="submit">
                                Login
                            </button>
                        </Form>
                    </div>
                    <div className="register-Link">
                        <Link to="/register" className="m-2">
                            Not a user Register here
                        </Link>
                    </div>
                    <div className="apply-doctor-link">
                        <Link to="/apply-doctor" className="m-2">
                            Apply Doctor
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
