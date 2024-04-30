import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // form handler
    const onFinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/register", values);
            dispatch(hideLoading());
            if (res.data.success) {
                message.success("Register Successful");
                navigate("/login");
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
                    <div className="header-title">
                        <h3>Register Form</h3>
                    </div>
                </div>
                <div className="log-reg-body">
                    <div className="form-div">
                        <Form
                            layout="vertical"
                            onFinish={onFinishHandler}
                            className="register-form"
                        >
                            <Form.Item label="Nid" name="nid">
                                <Input type="text" required />
                            </Form.Item>
                            <Form.Item label="Name" name="name">
                                <Input type="text" required />
                            </Form.Item>
                            <Form.Item label="Email" name="email">
                                <Input type="email" required />
                            </Form.Item>
                            <Form.Item label="Phone" name="phone">
                                <Input type="text" required />
                            </Form.Item>
                            <Form.Item label="Password" name="password">
                                <Input type="password" required />
                            </Form.Item>

                            <button className="btn btn-primary" type="submit">
                                Register
                            </button>
                        </Form>
                    </div>
                    <div className="login-Link">
                        <Link to="/login" className="m-2">
                            Already user login here
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

export default Register;
