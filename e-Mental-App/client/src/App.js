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
import DoctorsList from "./pages/patient/DoctorsList";
import AppInfo from "./pages/admin/AppInfo";
import DoctorAppointmentList from "./pages/doctor/AppointmentList";
import PatientAppointmentList from "./pages/patient/AppointmentList";
import PatientRoute from "./components/PatientRoute";
import BookingPage from "./pages/patient/BookingPage";
import DoctorDetailsPatientView from "./pages/patient/DoctorDetails";
import DoctorDetailsAdminView from "./pages/admin/DoctorDetails";
import PatientProfile from "./pages/patient/Profile";

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
                            path="/patient/user-homepage"
                            element={
                                <ProtectedRoute>
                                    <PatientRoute>
                                        <DoctorsList />
                                    </PatientRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/patient/get-doctor-details/:doctorKey"
                            element={
                                <ProtectedRoute>
                                    <PatientRoute>
                                        <DoctorDetailsPatientView />
                                    </PatientRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/patient/book-appointemnt/:doctorKey"
                            element={
                                <ProtectedRoute>
                                    <PatientRoute>
                                        <BookingPage />
                                    </PatientRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/patient/appointments"
                            element={
                                <ProtectedRoute>
                                    <PatientRoute>
                                        <PatientAppointmentList />
                                    </PatientRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/patient/profile"
                            element={
                                <ProtectedRoute>
                                    <PatientRoute>
                                        <PatientProfile />
                                    </PatientRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/admin-dashboard"
                            element={
                                <ProtectedRoute>
                                    <AdminRoute>
                                        <AppInfo />
                                    </AdminRoute>
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
                            path="/admin/get-doctor-details/:doctorKey"
                            element={
                                <ProtectedRoute>
                                    <AdminRoute>
                                        <DoctorDetailsAdminView />
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
                            path="/doctor/doctor-dashboard"
                            element={
                                <ProtectedRoute>
                                    <DoctorRoute>
                                        <DoctorAppointmentList />
                                    </DoctorRoute>
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
