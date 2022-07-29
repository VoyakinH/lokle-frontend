import { Navigate } from 'react-router-dom';

export const AuthorizedRoute = ({ email, children }) => {
    if (email !== "") {
        return children;
    }
    else {
        return <Navigate to="/login"/>;
    }
};

export const UnauthorizedRoute = ({ email, children }) => {
    if (email === "") {
        return children;
    }
    else {
        return <Navigate to="/lk"/>;
    }
};