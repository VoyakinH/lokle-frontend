import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Alert, Snackbar} from "@mui/material";

import { AuthorizedRoute, UnauthorizedRoute } from './components/AuthRouters';
import LkRoute from './components/LkRoute';

import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';

import { getRequestHandler } from "./components/Requests";

import { GlobalLoader } from "./components/LoadingSpinners";

import { UserDefault } from "./components/Structs_default";

function App() {
    const [user, setUser] = useState(UserDefault);
    const [isLoading, setIsLoading] = useState(true);
    const [isBackendFail, setIsBackendFail] = useState(false);

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertType, setAlertType] = React.useState('info');
    const [alertMessage, setAlertMessage] = React.useState("");

    const onCloseAlertClick = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setIsLoading(true);
        setIsBackendFail(false);
        getRequestHandler('/api/v1/user/auth').then(response => {
            switch (response.status) {
                case 200:
                    setUser(response.data);
                    break;
                case 401:
                case 403:
                case 404:
                    setUser(UserDefault);
                    break;
                default:
                    setIsBackendFail(true);
            }
            setIsLoading(false)
        });
    }, []);

    return (
        isLoading?
            <GlobalLoader />:
            isBackendFail?
                <div>Сервис временно недоступен. Попробуйте позднее.</div>:
                <div>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={
                                <UnauthorizedRoute email={user.email}>
                                    <LoginPage
                                        setUser={setUser}
                                        setOpenAlert={setOpenAlert}
                                        setAlertType={setAlertType}
                                        setAlertMessage={setAlertMessage}
                                    />
                                </UnauthorizedRoute>
                            }/>
                            <Route path="/registration" element={
                                <UnauthorizedRoute email={user.email}>
                                    <RegistrationPage
                                        setOpenAlert={setOpenAlert}
                                        setAlertType={setAlertType}
                                        setAlertMessage={setAlertMessage}
                                    />
                                </UnauthorizedRoute>
                            }/>
                            <Route path="/lk" element={
                                <AuthorizedRoute email={user.email}>
                                    <LkRoute
                                        user={user}
                                        setUser={setUser}
                                        setOpenAlert={setOpenAlert}
                                        setAlertType={setAlertType}
                                        setAlertMessage={setAlertMessage}
                                    />
                                </AuthorizedRoute>
                            } />
                            <Route path="*" element={<Navigate to="/lk" />} />
                        </Routes>
                    </BrowserRouter>

                    <Snackbar
                        open={openAlert}
                        autoHideDuration={6000}
                        onClose={onCloseAlertClick}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={onCloseAlertClick}
                            severity={alertType}
                        >
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </div>
    );
}

export default App;