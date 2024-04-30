import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { message, Col, Row } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const DoctorDetails = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState({});

    //get doctor details
    const getDoctor = async () => {
        try {
            const res = await axios.post(
                "/api/v1/admin/get-doctor-byId",
                {
                    doctorKey: params.doctorKey,
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
    };

    const changeStatusHandler = async (record, status) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/admin/change-user-status",
                {
                    key: record.nid,
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

    useEffect(() => {
        getDoctor();
    }, []);

    return (
        <Layout>
            <h3 className="p-2 text-center">
                Doctor Details <hr />
            </h3>
            <div className="m-3">
                <h5 className="">Doctor's App Details :</h5>
                <Row gutter="10" className="p-2">
                    <Col xs={10} md={10} lg={5}>
                        <div>
                            <p>
                                <b>Nid :</b> {doctor.nid}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={5}>
                        <div>
                            <p>
                                <b>Type :</b> {doctor.userType}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={5}>
                        <div>
                            <p>
                                <b>Status :</b> {doctor.status}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={5}>
                        <div>
                            <p>
                                <b>Created At :</b> {doctor.createdAt}
                            </p>
                        </div>
                    </Col>
                </Row>
                <h5 className="">Doctor's Personal Details :</h5>
                <Row gutter="20" className="p-2">
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Name :</b> {doctor.name}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Email :</b> {doctor.email}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Phone :</b> {doctor.phone}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={6}>
                        <div>
                            <p>
                                <b>Website :</b> {doctor.website}
                            </p>
                        </div>
                    </Col>
                    <Col xs={10} md={10} lg={14}>
                        <div>
                            <p>
                                <b>Degree :</b> {doctor.degree}
                            </p>
                        </div>
                    </Col>
                </Row>
                <h5 className="">Doctor's Professional Details :</h5>
                <Row gutter="20" className="p-2">
                    <Col xs={24} md={24} lg={12}>
                        <div>
                            <p>
                                <b>Chamber :</b> {doctor.address}
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={12}>
                        <div>
                            <p>
                                <b>Specialization :</b> {doctor.specialization}
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={4}>
                        <div>
                            <p>
                                <b>Experience :</b> {doctor.experience}
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={3}>
                        <div>
                            <p>
                                <b>Fees :</b> {doctor.fees}
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <div>
                            <p>
                                <b>Per Consultation Duration :</b>{" "}
                                {doctor.consultationDuration}
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <div>
                            <p>
                                <b>Consultation Timing :</b>{" "}
                                {doctor.consultationStartTime} -{" "}
                                {doctor.consultationEndTime}
                            </p>
                        </div>
                    </Col>
                </Row>
                <div className="d-flex justify-content-center">
                    {doctor.userType === "candidate" ? (
                        <>
                            <button
                                className="btn btn-success m-1"
                                onClick={() =>
                                    changeStatusHandler(doctor, "approved")
                                }
                            >
                                Accept
                            </button>
                            <button
                                className="btn btn-danger m-1"
                                onClick={() =>
                                    changeStatusHandler(doctor, "rejected")
                                }
                            >
                                Reject
                            </button>
                        </>
                    ) : doctor.status === "blocked" ? (
                        <button
                            className="btn btn-success w-30 m-1"
                            onClick={() =>
                                changeStatusHandler(doctor, "approved")
                            }
                        >
                            Approve
                        </button>
                    ) : (
                        <button
                            className="btn btn-danger w-50 m-1"
                            onClick={() =>
                                changeStatusHandler(doctor, "blocked")
                            }
                        >
                            Block
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default DoctorDetails;
