import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import crypto from "crypto-js";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";

const MedicalRecord = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const effectRun = useRef(true);
    const [records, setRecords] = useState([]);
    const [file, setFile] = useState("");
    const [diseaseName, setDiseaseName] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [doctorNid, setDoctorNid] = useState("");

    const getRecords = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/patient/get-all-records", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
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
    }, [setRecords]);

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
                        "/api/v1/patient/store-record",
                        {
                            doctorKey: doctorNid,
                            doctorName: doctorName,
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
        [file, diseaseName, doctorNid, doctorName, dispatch]
    );

    const downloadRecordHandler = useCallback(async (record) => {
        try {
            message.success("Processing for download");
            console.log(record.fileName);
            const extention = record.fileName.split(".")[1];
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
            const res = await axios({
                method: "get",
                url: `https://gateway.pinata.cloud/ipfs/${record.dataHash}`,
            });
            const decryptedFile = crypto.AES.decrypt(
                res.data,
                process.env.REACT_APP_SECRET_KEY
            ).toString(crypto.enc.Utf8);
            const blob = new Blob([decryptedFile], {
                type: fileType,
            });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.setAttribute("download", record.fileName);
            downloadLink.click();
        } catch (error) {
            console.log("Error: ", error);
            message.error("Something went wrong!");
        }
    }, []);

    const removeRecordHandler = useCallback(async (record) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/patient/remove-record",
                {
                    doctorKey: record.doctorKey,
                    dataHash: record.dataHash,
                    createdAt: record.createdAt,
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
            console.log("Error: ", error);
            dispatch(hideLoading());
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
            title: "Created At",
            dataIndex: "createdAt",
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
                                navigate(
                                    `/patient/get-doctor-details/${record.doctorKey}`
                                );
                            }}
                        >
                            Doctor
                        </button>
                    )}
                    <button
                        className="btn btn-primary m-1"
                        onClick={() => {
                            downloadRecordHandler(record);
                        }}
                    >
                        Download
                    </button>
                    <button
                        className="btn btn-primary m-1"
                        onClick={() => {
                            removeRecordHandler(record);
                        }}
                    >
                        Remove
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
            <Table
                columns={recordColumns}
                dataSource={records}
                pagination={false}
                scroll={{
                    x: 240,
                    y: 240,
                }}
            />
            <h6 className="mt-3 px-2">Upload Record</h6>
            <div className="record-upload-div">
                <form className="record-upload-form">
                    <h6 className="m-2">Doctor Nid: (optional)</h6>
                    <input
                        className="m-2 px-2"
                        type="text"
                        onChange={(e) => setDoctorNid(e.target.value)}
                    />
                    <h6 className="m-2">Institute/Doctor Name:</h6>
                    <input
                        className="m-2 px-2"
                        type="text"
                        onChange={(e) => setDoctorName(e.target.value)}
                    />
                    <h6 className="m-2">Disease Name:</h6>
                    <input
                        className="m-2 px-2"
                        type="text"
                        onChange={(e) => setDiseaseName(e.target.value)}
                    />
                    <h6 className="m-2">Upload File:</h6>
                    <div className="d-flex m-2">
                        <input
                            className="px-2"
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
            </div>
        </Layout>
    );
};

export default MedicalRecord;
