import React from 'react';
import { Navigate } from 'react-router-dom';

const UnauthorizedRoute = ({ email, children }) => {
    if (email === "") {
        return children;
    }
    else {
        return <Navigate to="/lk"/>;
    }
};

export default UnauthorizedRoute;