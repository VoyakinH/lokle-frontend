import React, {useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import AuthPage from './components/AuthPage';
import LkPage from './components/LkPage';
import PrivateRoute from './components/PrivateRoute';

function App() {

    const [isAuthorized, setIsAuthorized] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={
                    <AuthPage
                        isAuthorized = {isAuthorized}
                        setIsAuthorized = {setIsAuthorized}
                        isLoading = {isLoading}
                        setIsLoading = {setIsLoading}
                    />
                }/>
                <Route path="/lk" element={
                    <PrivateRoute>
                        <LkPage
                            isAuthorized = {isAuthorized}
                            setIsAuthorized = {setIsAuthorized}
                            isLoading = {isLoading}
                            setIsLoading = {setIsLoading}
                        />
                    </PrivateRoute>} />
                <Route path="*" element={<Navigate to="/lk" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;