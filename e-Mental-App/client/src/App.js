import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddDoctor from "./pages/admin/AddDoctor";
import ApplyDoctor from "./pages/ApplyDoctor";
import NotificationPage from "./pages/NotificationPage";
import Doctor from "./pages/admin/Doctor";
import Patient from "./pages/admin/Patient";
import DoctorProfile from "./pages/doctor/Profile";
import AdminRoute from "./components/AdminRoute";
import DoctorRoute from "./components/DoctorRoute";

function App() {
    const { loading } = useSelector((state) => state.alerts);
    return (
        <>
            <BrowserRouter>
                {loading ? (
                    <Spinner />
                ) : (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/notification"
                            element={
                                <ProtectedRoute>
                                    <NotificationPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/add-doctor"
                            element={
                                <ProtectedRoute>
                                    <AdminRoute>
                                        <AddDoctor />
                                    </AdminRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/doctors"
                            element={
                                <ProtectedRoute>
                                    <AdminRoute>
                                        <Doctor />
                                    </AdminRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/patients"
                            element={
                                <ProtectedRoute>
                                    <AdminRoute>
                                        <Patient />
                                    </AdminRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/doctor/profile"
                            element={
                                <ProtectedRoute>
                                    <DoctorRoute>
                                        <DoctorProfile />
                                    </DoctorRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/apply-doctor"
                            element={
                                <PublicRoute>
                                    <ApplyDoctor />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />
                    </Routes>
                )}
            </BrowserRouter>
        </>
    );
}

export default App;
