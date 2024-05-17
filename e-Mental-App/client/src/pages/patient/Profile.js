import React from "react";
import Layout from "../../components/Layout";
import { useSelector } from "react-redux";
import { Col, Row } from "antd";

const Profile = () => {
    const { user } = useSelector((state) => state.user);

    const deleteAccountHandler = async () => {
        // try {
        //     dispatch(showLoading());
        //     const res = await axios.post(
        //         "/api/v1/patient/change-user-status",
        //         {
        //             key: record.nid,
        //         },
        //         {
        //             headers: {
        //                 Authorization:
        //                     "Bearer " + localStorage.getItem("token"),
        //             },
        //         }
        //     );
        //     dispatch(hideLoading());
        //     if (res.data.success) {
        //         message.success(res.data.message);
        //     } else {
        //         message.error(res.data.message);
        //     }
        // } catch (error) {
        //     dispatch(hideLoading());
        //     console.log("Error: ", error);
        // }
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
                <button
                    className="btn btn-danger w-50 m-2"
                    onClick={deleteAccountHandler}
                >
                    Delete Account
                </button>
            </div>
        </Layout>
    );
};

export default Profile;
