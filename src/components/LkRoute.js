import React from 'react';
import LkParent from './LkParent'
import LkAdmin from './LkAdmin'
import LkManager from './LkManager'

// Роутер перехода в нужный личный кабинет в зависимости от роли пользователя
const LkRoute = ({ user, setUser, setOpenAlert, setAlertType, setAlertMessage }) => {
    if (user.role === "PARENT") {
        return <LkParent
            user={user}
            setUser={setUser}
            setOpenAlert={setOpenAlert}
            setAlertType={setAlertType}
            setAlertMessage={setAlertMessage}
        />;
    }

    else if (user.role === "CHILD") {
        return <div>Личный кабинет не предусмотрен для пользователя с таким типом.</div>;
    }

    else if (user.role === "MANAGER") {
        return <LkManager
            user={user}
            setUser={setUser}
            setOpenAlert={setOpenAlert}
            setAlertType={setAlertType}
            setAlertMessage={setAlertMessage}
        />;
    }

    else if (user.role === "ADMIN") {
        return <LkAdmin
            user={user}
            setUser={setUser}
            setOpenAlert={setOpenAlert}
            setAlertType={setAlertType}
            setAlertMessage={setAlertMessage}
        />;
    }

    else {
        return <div>Личный кабинет не предусмотрен для пользователя с таким типом.</div>;
    }
};

export default LkRoute;