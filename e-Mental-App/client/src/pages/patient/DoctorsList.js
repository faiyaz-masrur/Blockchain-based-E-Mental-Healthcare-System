import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { Row, message } from "antd";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const DoctorsList = () => {
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const [doctors, setDoctors] = useState([]);

    //get doctors
    const getDoctors = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/patient/get-all-doctors", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setDoctors(res.data.data);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setDoctors]);

    useEffect(() => {
        if (effectRun.current) {
            getDoctors();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getDoctors, effectRun]);

    return (
        <Layout>
            <h3 className="p-2 text-center">
                Home Page <hr />
            </h3>
            <Row>
                {doctors &&
                    doctors.map((doctor) => (
                        <div className="card p-2 m-3 card-doctorlist-patient">
                            <div className="card-header text-center">
                                Dr. {doctor.name}
                            </div>
                            <div className="card-body">
                                <p>
                                    <b>Specialization</b>
                                    {": "}
                                    {doctor.specialization}
                                </p>
                                <p>
                                    <b>Fees per Consultation</b>
                                    {": "} {doctor.fees}
                                </p>
                                <p>
                                    <b>Consultation Time</b>
                                    {": "}
                                    {doctor.consultationStartTime} -{" "}
                                    {doctor.consultationEndTime}
                                </p>
                                <button
                                    className="btn btn-primary m-1"
                                    onClick={() =>
                                        navigate(
                                            `/patient/get-doctor-details/${doctor.nid}`
                                        )
                                    }
                                >
                                    View Details
                                </button>
                                <button
                                    className="btn btn-dark m-1"
                                    onClick={() =>
                                        navigate(
                                            `/patient/book-appointemnt/${doctor.nid}`
                                        )
                                    }
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
            </Row>
        </Layout>
    );
};

export default DoctorsList;
