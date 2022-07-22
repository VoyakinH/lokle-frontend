import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthorizedRoute = ({ email, children }) => {
    if (email !== "") {
        return children;
    }
    else {
        return <Navigate to="/login"/>;
    }
};

export default AuthorizedRoute;