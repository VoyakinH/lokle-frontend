import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import LkPage from './components/LkPage';
import AuthorizedRoute from './components/AuthorizedRoute';
import UnauthorizedRoute from './components/UnauthorizedRoute';
import {getRequestHandler} from "./components/Requests";
import {UserDefault} from "./components/Structs_default";
import {PulseLoader} from "react-spinners";

function App() {
    // User context
    const [user, setUser] = useState(UserDefault);
    // Is need to show spinner while checking cookie
    const [isLoading, setIsLoading] = useState(true);
    // Is need to show service unavailability
    const [isBackendFail, setIsBackendFail] = useState(false);

    // Cookie check when enter cite
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

    const styles = {
        loader: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -9,
            marginLeft: -28,
            width: 57,
            height: 19,
        },
    };

    return (
        isLoading?
            <PulseLoader style={styles.loader} speedMultiplier={2} color={"#42a5f5"} size={15} />:
            isBackendFail?
                <div>Сервис временно недоступен. Попробуйте позднее.</div>:
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={
                    <UnauthorizedRoute email={user.email}>
                        <LoginPage/>
                    </UnauthorizedRoute>
                }/>
                <Route path="/registration" element={
                    <UnauthorizedRoute email={user.email}>
                        <RegistrationPage/>
                    </UnauthorizedRoute>
                }/>
                <Route path="/lk" element={
                    <AuthorizedRoute email={user.email}>
                        <div>lk</div>
                    </AuthorizedRoute>
                } />
                <Route path="*" element={<Navigate to="/lk" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;