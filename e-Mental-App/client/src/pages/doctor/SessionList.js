import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import crypto from "crypto-js";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";

const SessionList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const [sessions, setSessions] = useState([]);
    const [uploader, setUploader] = useState(false);
    const [file, setFile] = useState("");
    const [patientKey, setPatientKey] = useState("");
    const [diseaseName, setDiseaseName] = useState("");

    const getSessions = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/doctor/get-all-sessions", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setSessions(res.data.sessions);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            message.error("Something went wrong!");
        }
    }, [setSessions]);

    const ipfsUploadHandler = useCallback(
        async (e) => {
            try {
                e.preventDefault();
                message.success("Uploading.....");
                const extention = file.name.split(".")[1];
                let fileType;
                if (extention === "png") {
                    fileType = "image/png";
                } else if (extention === "jpg" || extention === "jpeg") {
                    fileType = "image/jpeg";
                } else if (extention === "webp") {
                    fileType = "image/webp";
                } else if (extention === "apng") {
                    fileType = "image/apng";
                } else if (extention === "pdf") {
                    fileType = "application/pdf";
                } else if (extention === "doc" || extention === "dot") {
                    fileType = "application/msword";
                } else if (extention === "txt") {
                    fileType = "text/plain";
                } else {
                    fileType = "multipart/form-data";
                }

                const reader = new FileReader();

                reader.readAsText(file);
                reader.onload = async () => {
                    const encryptedFile = crypto.AES.encrypt(
                        reader.result,
                        process.env.REACT_APP_SECRET_KEY
                    ).toString();
                    const blob = new Blob([encryptedFile], {
                        type: fileType,
                    });
                    const fileData = new FormData();
                    fileData.append("file", blob);
                    const res = await axios({
                        method: "post",
                        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                        data: fileData,
                        headers: {
                            pinata_api_key:
                                process.env.REACT_APP_PINATA_API_KEY,
                            pinata_secret_api_key:
                                process.env.REACT_APP_PINATA_API_SECRET,
                            "Content-Type": fileType,
                        },
                    });
                    dispatch(showLoading());
                    const saveDataHashRes = await axios.post(
                        "/api/v1/doctor/store-record",
                        {
                            patientKey: patientKey,
                            dataHash: res.data.IpfsHash,
                            fileName: file.name,
                            disease: diseaseName,
                        },
                        {
                            headers: {
                                Authorization:
                                    "Bearer " + localStorage.getItem("token"),
                            },
                        }
                    );
                    dispatch(hideLoading());
                    if (saveDataHashRes.data.success) {
                        message.success(saveDataHashRes.data.message);
                    } else {
                        message.error(saveDataHashRes.data.message);
                    }
                    const fileUrl =
                        "https://gateway.pinata.cloud/ipfs/" +
                        res.data.IpfsHash;
                    console.log(fileUrl);
                };
            } catch (error) {
                dispatch(hideLoading());
                console.log("Error: ", error);
                message.error("Something went wrong!");
            }
        },
        [file, diseaseName, patientKey, dispatch]
    );

    const changeAppointmentStatusHandler = async (record, newStatus) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/change-appointment-status",
                {
                    doctorKey: record.doctorKey,
                    patientKey: record.patientKey,
                    createdAt: record.createdAt,
                    newStatus: newStatus,
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
            message.error("Something went wrong!");
        }
    };

    const joinRoomHandler = useCallback(({ roomId }) => {
        window.open(
            `${window.location.origin}/doctor/sessionroom/${roomId}`,
            "_blank",
            "noreferrer"
        );
    }, []);

    useEffect(() => {
        if (effectRun.current) {
            getSessions();
        }

        return () => {
            effectRun.current = false;
        };
    }, [getSessions]);

    const sessionColumns = [
        {
            title: "Name",
            dataIndex: "patientName",
        },
        {
            title: "Session Id",
            dataIndex: "sessionId",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            fixed: "right",
            width: 250,
            render: (text, record) => (
                <div>
                    <button
                        className="btn btn-primary m-1"
                        onClick={() =>
                            joinRoomHandler({ roomId: record.sessionId })
                        }
                    >
                        Join
                    </button>
                    <button
                        className="btn btn-secondary m-1"
                        onClick={() => {
                            if (!uploader) {
                                setUploader(true);
                                setPatientKey(record.patientKey);
                            } else {
                                setUploader(false);
                            }
                        }}
                    >
                        Upload
                    </button>
                    <button
                        className="btn btn-secondary m-1"
                        onClick={() => {
                            navigate(
                                `/doctor/patientdata/${record.patientKey}`
                            );
                        }}
                    >
                        Records
                    </button>
                    <button
                        className="btn btn-danger m-1"
                        onClick={() =>
                            changeAppointmentStatusHandler(record, "ended")
                        }
                    >
                        End
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h3 className="p-2 text-center">
                Video Session
                <hr />
            </h3>
            <Table
                columns={sessionColumns}
                dataSource={sessions}
                pagination={false}
            />
            {uploader && (
                <>
                    <form className="d-flex flex-column align-items-center m-3">
                        <b>Disease Name:</b>
                        <input
                            className="m-2"
                            type="text"
                            onChange={(e) => setDiseaseName(e.target.value)}
                        />
                        <div className="d-flex m-2">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <button
                                className="ipfs-upload-button"
                                type="submit"
                                onClick={ipfsUploadHandler}
                            >
                                Upload
                            </button>
                        </div>
                    </form>
                </>
            )}
        </Layout>
    );
};

export default SessionList;
