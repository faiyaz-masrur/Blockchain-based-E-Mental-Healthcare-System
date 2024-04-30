import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { message, Col, Form, Input, Row, TimePicker, InputNumber } from "antd";
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

    const changeStatusHandler = async (status) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/change-user-status",
                {
                    key: user.nid,
                    newStatus: status,
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
                    consultationStartTime: dayjs(
                        user.consultationStartTime,
                        "HH:mm"
                    ),
                    consultationEndTime: dayjs(
                        user.consultationEndTime,
                        "HH:mm"
                    ),
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
                            name="consultationDuration"
                            label="Per Consultation Duration (Minutes)"
                            required
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={15} defaultValue={15} />
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
                </Row>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary w-30 m-1" type="submit">
                        Submit
                    </button>
                </div>
            </Form>
            <div className="d-flex justify-content-center">
                {user.status === "blocked" ? (
                    <button
                        className="btn btn-success m-2"
                        onClick={() => changeStatusHandler("approved")}
                    >
                        Activate
                    </button>
                ) : (
                    <button
                        className="btn btn-danger m-2"
                        onClick={() => changeStatusHandler("blocked")}
                    >
                        Deactivate
                    </button>
                )}
            </div>
        </Layout>
    );
};

export default Profile;
