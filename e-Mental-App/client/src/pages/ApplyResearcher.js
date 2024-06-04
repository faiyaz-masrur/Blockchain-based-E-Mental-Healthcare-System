import React from "react";
import axios from "axios";
import { Col, Form, Input, Row, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const ApplyResearcher = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //handle form
    const handleSubmit = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/user/apply-researcher",
                values
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
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
            <h3 className="text-center">
                Apply Form
                <hr />
            </h3>
            <div className="form-container">
                <Form className="m-3" layout="vertical" onFinish={handleSubmit}>
                    <h5 className="">Researchere's Personal Details :</h5>
                    <Row gutter="20">
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                name="name"
                                label="Name"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder="Enter name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                name="email"
                                label="Email"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="email" placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                name="phone"
                                label="Phone"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter phone number"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h5 className="">Researcher's Professional Details :</h5>
                    <Row gutter="20">
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                name="address"
                                label="Institute (optional)"
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter institute name"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                name="degree"
                                label="Degree"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter all the degrees (comma separated)"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h5 className="">Researcher's App Details :</h5>
                    <Row gutter="20">
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                name="nid"
                                label="User Id"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter nid number"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                name="password"
                                label="Password"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input
                                    type="password"
                                    placeholder="Enter password"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={28} md={28} lg={8}>
                            <button
                                className="btn btn-primary apply-form-btn"
                                type="submit"
                            >
                                Submit
                            </button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default ApplyResearcher;
