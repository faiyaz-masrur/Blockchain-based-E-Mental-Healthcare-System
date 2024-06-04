import React from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { message, Col, Row } from "antd";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const changeStatusHandler = async (status) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/admin/change-user-status",
                {
                    userKey: user?.nid,
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
            <div className="m-3">
                <Row gutter="10" className="p-2">
                    <Col xs={10} md={10} lg={5}>
                        <div>
                            <p>
                                <b>Nid :</b> {user.nid}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Name :</b> {user.name}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Email :</b> {user.email}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Phone :</b> {user.phone}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={5}>
                        <div>
                            <p>
                                <b>Type :</b> {user.userType}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={5}>
                        <div>
                            <p>
                                <b>Status :</b> {user.status}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Created At :</b> {user.createdAt}
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="d-flex justify-content-center">
                {user.status === "deactivated" ? (
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
