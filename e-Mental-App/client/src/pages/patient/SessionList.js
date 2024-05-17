import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Table, message } from "antd";
import { useNavigate } from "react-router-dom";

const SessionList = () => {
    const effectRun = useRef(true);
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);

    const getSessions = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/patient/get-all-sessions", {
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
        }
    }, [setSessions]);

    const joinRoomHandler = useCallback(({ roomId }) => {
        window.open(
            `${window.location.origin}/patient/sessionroom/${roomId}`,
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
    }, [getSessions, joinRoomHandler, effectRun]);

    const sessionColumns = [
        {
            title: "Name",
            dataIndex: "doctorName",
        },
        {
            title: "Session Id",
            dataIndex: "sessionId",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <>
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
                            navigate("/patient/medical-record");
                        }}
                    >
                        Records
                    </button>
                </>
            ),
        },
    ];

    return (
        <Layout>
            <h3 className="p-2 text-center">
                Video Session <hr />
            </h3>
            <Table
                columns={sessionColumns}
                dataSource={sessions}
                pagination={false}
            />
        </Layout>
    );
};

export default SessionList;
