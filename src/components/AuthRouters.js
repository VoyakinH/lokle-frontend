import { Navigate } from 'react-router-dom';

// Роутер для проверки авторизован ли пользователь. Дочерний элемент только если авторизован
export const AuthorizedRoute = ({ email, children }) => {
    if (email !== "") {
        return children;
    }
    else {
        return <Navigate to="/login"/>;
    }
};

// Роутер для проверки авторизован ли пользователь. Дочерний элемент только если не авторизован
export const UnauthorizedRoute = ({ email, children }) => {
    if (email === "") {
        return children;
    }
    else {
        return <Navigate to="/lk"/>;
    }
};