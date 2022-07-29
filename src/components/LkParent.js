import React, {useEffect, useState} from "react";
import { Button, Paper, Tab, AppBar, Toolbar, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box } from '@mui/material';
import { Logout, AccountCircle } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useNavigate } from "react-router-dom";
import {deleteRequestHandler, getRequestHandler} from "./Requests";
import { UserDefault, ParentDefault } from "./Structs_default";
import { blue, yellow } from '@mui/material/colors';

const LkParent = ({ user, setUser, setOpenAlert, setAlertType, setAlertMessage }) => {
    let navigate = useNavigate();

    const [parent, setParent] = useState(ParentDefault);
    const [parentPassportRequest, setParentPassportRequest] = useState(null);
    const [children, setChildren] = useState(null);
    const [childrenUpdateCounter, setChildrenUpdateCounter] = useState(0);

    useEffect(() => {
        getRequestHandler('/api/v1/user/parent').then(response => {
            switch (response.status) {
                case 200:
                    setParent(response.data);
                    break;
                case 401:
                    setUser(UserDefault);
                    navigate("/login", { replace: true });
                    break;
                default:
                    setAlertType('error');
                    setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                    setOpenAlert(true);
            }
        });
    }, [])

    useEffect(() => {
        if (!parent.passport_verified && parent.pasport !== "") {
            getRequestHandler('/api/v1/reg/request/parent/list').then(response => {
                switch (response.status) {
                    case 200:
                        setParentPassportRequest(response.data);
                        break;
                    case 401:
                        setUser(UserDefault);
                        navigate("/login", { replace: true });
                        break;
                    default:
                        setAlertType('error');
                        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                        setOpenAlert(true);
                }
            });
        }
    }, [parent])

    useEffect(() => {
        getRequestHandler('/api/v1/user/parent/children').then(response => {
            switch (response.status) {
                case 200:
                    setChildren(response.data);
                    break;
                case 401:
                    setUser(UserDefault);
                    navigate("/login", { replace: true });
                    break;
                default:
                    setAlertType('error');
                    setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                    setOpenAlert(true);
            }
        });
    }, [childrenUpdateCounter])

    const onLogoutClick = () => {
        deleteRequestHandler('/api/v1/user/auth').then(response => {
            switch (response.status) {
                case 200:
                    setUser(UserDefault);
                    navigate("/login", { replace: true });
                    break;
                default:
                    setAlertType('error');
                    setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                    setOpenAlert(true);
            }
        })
    };

    const ProfileChip = () => {
        let fio = `${user.second_name} ${user.first_name[0]}.`;
        if (user.last_name !== "") {
            fio += ` ${user.last_name[0]}.`;
        }
        return <Chip sx={{color: blue[50]}} label={fio} />
    };

    const onAddParentPassportClick = () => {
        deleteRequestHandler('/api/v1/user/auth').then(response => {
            switch (response.status) {
                case 200:
                    setUser(UserDefault);
                    navigate("/login", { replace: true });
                    break;
                default:
                    setAlertType('error');
                    setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                    setOpenAlert(true);
            }
        })
    };

    const ParentPassportSection = () => {
        if (parent.passport_verified === false && parent.passport === "") {
            return (
                <Paper elevation={6} style={styles.paperPassportParent} >
                    <Typography variant="body1" mb={1}>
                        Для зачисления ребёнка в ЧУ СОШ «Столичный - КИТ» Вам необходимо подтвердить свои паспортные данные. <br/>
                        Если Ваш ребёнок уже обучается в нашей школе, пропустите данный шаг. <br/>
                    </Typography>
                    <Button
                        size={"small"}
                        variant={"outlined"}
                        onClick={onAddParentPassportClick}
                    >
                        Подтвердить паспортные данные
                    </Button>
                </Paper>
            )
        } else if (parent.passport_verified === false && parent.passport !== "") {
            return(<div>паспорт на проверке</div>)
        }
    }

    const styles = {
        paperPassportParent: {
            padding: "15px 15px 15px 15px",
            borderRadius: 15,
            backgroundColor: yellow[300],
        },
        paperBudget: {
            position: 'absolute',
            marginLeft: '20px',
            marginRight: '20px',
            marginBottom: '20px',
            marginTop: '84px',
            width: 'calc(100% - 56px)',
            height: 'calc(100% - 120px)',
        },
        paperChild: {
            position: 'absolute',
            marginTop: '15px',
            width: 'calc(100% - 30px)',
            height: 'calc(100% - 65px)',
        },
        tabPanelBudget: {
            position: 'absolute',
            padding: '15px',
            width: 'calc(100% - 30px)',
            height: 'calc(100% - 78px)',
        },
        tabPanelChild: {
            padding: '0px',
            height: 'calc(100% - 50px)',
        },
        tabList: {
            backgroundColor: 'rgb(228,228,228)',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
        },
    }

    return (
        <Box>
            <AppBar>
                <Toolbar>
                    <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                        Личный кабинет родителя
                    </Typography>
                    <ProfileChip/>
                    <Button
                        color="inherit"
                        endIcon={<Logout />}
                        onClick={onLogoutClick}
                    >
                        Выйти
                    </Button>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <ParentPassportSection/>
        </Box>
    );
};

export default LkParent;