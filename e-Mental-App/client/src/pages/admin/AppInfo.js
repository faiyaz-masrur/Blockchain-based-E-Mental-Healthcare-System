import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { Row, message } from "antd";
import Layout from "../../components/Layout";

const AppInfo = () => {
    const effectRun = useRef(true);
    const [appInfos, setAppInfos] = useState([]);

    //get doctors
    const getDoctors = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/admin/get-app-info", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (res.data.success) {
                setAppInfos(res.data.appInfo);
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }, [setAppInfos]);

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
                App Info <hr />
            </h3>
            <Row>
                {appInfos &&
                    appInfos.map((appInfo) => (
                        <div className="card p-2 m-3 card-doctorlist-patient">
                            <div className="card-header text-center">
                                <h5>{appInfo.name}</h5>
                            </div>
                            <div className="card-body text-center">
                                <h6>active: {appInfo.active}</h6>
                                <h6>inactive: {appInfo.inactive}</h6>
                                <h6>blocked: {appInfo.block}</h6>
                            </div>
                        </div>
                    ))}
            </Row>
        </Layout>
    );
};

export default AppInfo;
