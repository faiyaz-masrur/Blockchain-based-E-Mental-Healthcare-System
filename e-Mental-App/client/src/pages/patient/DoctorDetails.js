import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { message, Col, Row } from "antd";

const DoctorDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const [doctor, setDoctor] = useState({});

    //get doctor details
    const getDoctor = useCallback(async () => {
        try {
            const res = await axios.post(
                "/api/v1/patient/get-doctor-byId",
                {
                    doctorKey: params.doctorKey,
                    dataQuantity: "full",
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
    }, [setDoctor, params]);

    useEffect(() => {
        if (effectRun.current) {
            getDoctor();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getDoctor, effectRun]);

    return (
        <Layout>
            <h3 className="p-2 text-center">
                Doctor Details <hr />
            </h3>
            <div className="m-3">
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
                                {doctor.consultationDuration} minutes
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
            </div>
            <div className="d-flex justify-content-center">
                <button
                    className="btn btn-dark m-2 w-50"
                    onClick={() =>
                        navigate(`/patient/book-appointemnt/${doctor.nid}`)
                    }
                >
                    Book Appointment
                </button>
            </div>
        </Layout>
    );
};

export default DoctorDetails;
