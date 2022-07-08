import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {
    return Cookies.get('session-id') ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;