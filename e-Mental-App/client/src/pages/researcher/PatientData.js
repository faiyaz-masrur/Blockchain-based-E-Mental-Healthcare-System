import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import crypto from "crypto-js";
import { useParams, useNavigate } from "react-router-dom";

const PatientData = () => {
    const navigate = useNavigate();
    const { patientKey } = useParams();
    const effectRun = useRef(true);
    const [records, setRecords] = useState([]);

    const getRecords = useCallback(async () => {
        try {
            const res = await axios.post(
                "/api/v1/researcher/get-all-records",
                {
                    patientKey: patientKey,
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            if (res.data.success) {
                setRecords(res.data.records);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            message.error("Something went wrong!");
        }
    }, [setRecords, patientKey]);

    const downloadHandler = useCallback(async (record) => {
        try {
            message.success("Processing for download");
            const res = await axios({
                method: "get",
                url: `https://gateway.pinata.cloud/ipfs/${record.dataHash}`,
            });
            const decryptedFile = crypto.AES.decrypt(
                res.data,
                process.env.REACT_APP_SECRET_KEY
            ).toString(crypto.enc.Base64);
            const byteCharacter = atob(decryptedFile);
            const downloadLink = document.createElement("a");
            downloadLink.href = byteCharacter;
            downloadLink.setAttribute("download", record.fileName);
            downloadLink.click();
        } catch (error) {
            console.log("Error: ", error);
            message.error("Something went wrong!");
        }
    }, []);

    useEffect(() => {
        if (effectRun.current) {
            getRecords();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getRecords]);

    const recordColumns = [
        {
            title: "Doctor Name",
            dataIndex: "doctorName",
        },
        {
            title: "Disease",
            dataIndex: "disease",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    {!(record.doctorKey === "") && (
                        <button
                            className="btn btn-secondary m-1"
                            onClick={() => {
                                navigate(`/doctor-details/${record.doctorKey}`);
                            }}
                        >
                            Doctor
                        </button>
                    )}
                    <button
                        className="btn btn-primary m-1"
                        onClick={() => {
                            downloadHandler(record);
                        }}
                    >
                        Download
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h3 className="p-2 text-center">
                Medical Records
                <hr />
            </h3>
            <Table columns={recordColumns} dataSource={records} />
        </Layout>
    );
};

export default PatientData;
