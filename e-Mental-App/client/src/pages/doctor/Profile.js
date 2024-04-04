import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { message, Col, Form, Input, Row, TimePicker } from "antd";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import dayjs from "dayjs";

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [valueStart, setValueStart] = useState(null);
    const [valueEnd, setValueEnd] = useState(null);

    const onChangeStart = (time) => {
        setValueStart(dayjs(time).format("HH:mm"));
    };
    const onChangeEnd = (time) => {
        setValueEnd(dayjs(time).format("HH:mm"));
    };

    //handle form
    const handleSubmit = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/update-profile",
                {
                    ...values,
                    consultationStartTime: valueStart,
                    consultationEndTime: valueEnd,
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
            console.log(error);
            message.error("Something Went Wrong!");
        }
    };

    return (
        <Layout>
            <h3 className="p-2 text-center">
                Profile Details <hr />
            </h3>
            <Form
                className="m-3"
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    ...user,
                }}
            >
                <h5 className="">Doctor's App Details :</h5>
                <Row gutter="20">
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item name="name" label="Name">
                            <p>{user?.name}</p>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item name="nid" label="User Id">
                            <p>{user?.nid}</p>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item name="userType" label="User Type">
                            <p>{user?.userType}</p>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item name="createdAt" label="Created At">
                            <p>{user?.createdAt}</p>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item name="password"></Form.Item>
                    </Col>
                </Row>
                <h5 className="">Doctor's Personal Details :</h5>
                <Row gutter="20">
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
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            name="address"
                            label="Chamber"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="text"
                                placeholder="Enter chamber address"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item name="website" label="Website">
                            <Input
                                type="text"
                                placeholder="Optional: Enter website url"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <h5 className="">Doctor's Professional Details :</h5>
                <Row gutter="20">
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            name="specialization"
                            label="Specialization"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="text"
                                placeholder="Enter specializations with comma"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            name="experience"
                            label="Experience"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="text"
                                placeholder="Enter experiences"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            name="fees"
                            label="Fees"
                            required
                            rules={[{ required: true }]}
                        >
                            <Input
                                type="text"
                                placeholder="Enter fees per consultation"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            name="consultationStartTime"
                            label="Consultation Start Time"
                            required
                        >
                            <TimePicker
                                onChange={onChangeStart}
                                format={"HH:mm"}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            name="consultationEndTime"
                            label="Consultation End Time"
                            required
                        >
                            <TimePicker
                                onChange={onChangeEnd}
                                format={"HH:mm"}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <button
                            className="btn btn-primary add-form-btn"
                            type="submit"
                        >
                            Submit
                        </button>
                    </Col>
                </Row>
            </Form>
        </Layout>
    );
};

export default Profile;
