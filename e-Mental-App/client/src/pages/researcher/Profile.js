import React from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { message, Col, Form, Input, Row } from "antd";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    //handle form
    const handleSubmit = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/researcher/update-profile",
                values,
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
                "/api/v1/researcher/change-user-status",
                {
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
                initialValues={user}
            >
                <h5 className="my-3">
                    <b>App Details :</b>
                </h5>
                <Row gutter="20">
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Name :</b> {user?.name}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Nid :</b> {user?.nid}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>User Type :</b> {user?.userType}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Created At :</b> {user?.createdAt}
                            </p>
                        </div>
                    </Col>
                </Row>
                <h5 className="my-3">
                    <b>Personal Details :</b>
                </h5>
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
                </Row>
                <h5 className="my-3">
                    <b>Doctor's Professional Details :</b>
                </h5>
                <Row gutter="20">
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            name="address"
                            label="Institute"
                            required
                            rules={[{ required: true }]}
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
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary w-50 m-1" type="submit">
                        Submit
                    </button>
                </div>
            </Form>
            <div className="d-flex justify-content-center">
                {user.status === "blocked" ? (
                    <button
                        className="btn btn-success m-2 w-50"
                        onClick={() => changeStatusHandler("approved")}
                    >
                        Activate
                    </button>
                ) : (
                    <button
                        className="btn btn-danger m-2 w-50"
                        onClick={() => changeStatusHandler("deactivated")}
                    >
                        Deactivate
                    </button>
                )}
            </div>
        </Layout>
    );
};

export default Profile;
