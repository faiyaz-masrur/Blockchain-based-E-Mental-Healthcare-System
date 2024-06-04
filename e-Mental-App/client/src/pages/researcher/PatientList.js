import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";

const PatientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const effectRun = useRef(true);
    const [patients, setPatients] = useState([]);

    //get patients
    const getPatients = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/researcher/get-all-patients", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setPatients(res.data.patients);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setPatients]);

    const checkRecordAccessPermissionHandler = async (record) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/researcher/check-access-permission",
                {
                    patientKey: record.nid,
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
                navigate(`/researcher/record/${record.nid}`);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log("Error: ", error);
            message.error("Something went wrong!");
        }
    };

    useEffect(() => {
        if (effectRun.current) {
            getPatients();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getPatients, effectRun]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            fixed: "right",
            width: 250,
            render: (text, record) => (
                <div className="">
                    <button
                        className="btn btn-secondary m-1"
                        onClick={() => {
                            checkRecordAccessPermissionHandler(record);
                        }}
                    >
                        Records
                    </button>
                </div>
            ),
        },
    ];
    return (
        <Layout>
            <h3 className="p-2 text-center">
                Patients List <hr />
            </h3>
            <Table columns={columns} dataSource={patients} />
        </Layout>
    );
};

export default PatientList;
