import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message, Badge } from "antd";
import { removeUser } from "../redux/features/userSlice";

const Layout = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //logout funtion
    const handleLogout = () => {
        localStorage.clear();
        dispatch(removeUser());
        message.success("You have logged out successfully!");
        navigate("/login");
    };

    // rendering the menu list
    const SidebarMenu = user?.userType === "admin" ? adminMenu : userMenu;
    return (
        <>
            <div className="main">
                <div className="layout">
                    <div className="sidebar">
                        <div className="logo">
                            <h6>FabMed</h6>
                            <hr />
                        </div>
                        <div className="menu">
                            {SidebarMenu.map((menu) => {
                                const isActive =
                                    location.pathname === menu.path;
                                return (
                                    <>
                                        <div
                                            className={`menu-item ${
                                                isActive && "active"
                                            }`}
                                        >
                                            <i className={menu.icon}></i>
                                            <Link to={menu.path}>
                                                {menu.name}
                                            </Link>
                                        </div>
                                    </>
                                );
                            })}
                            <div
                                className={"menu-item "}
                                onClick={handleLogout}
                            >
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <Link to="/login">Logout</Link>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="header">
                            <div
                                className="header-content"
                                style={{ cursor: "pointer" }}
                            >
                                <Badge
                                    className="notify"
                                    count={user?.notification.length}
                                    onClick={() => {
                                        navigate("/notification");
                                    }}
                                >
                                    <i class="fa-solid fa-bell"></i>
                                </Badge>
                                <Link to="/profile">{user?.name}</Link>
                            </div>
                        </div>
                        <div className="body">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
