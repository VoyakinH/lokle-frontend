import React, { useEffect, useState } from "react";
import { Button, Paper, AppBar, Toolbar, Typography, FormControl,
    InputLabel, Input, InputAdornment, IconButton, FormHelperText,
    Dialog, DialogActions, DialogTitle, DialogContent, TextField,
    Chip, Grid, Box} from '@mui/material';
import { Logout, VisibilityOff, Visibility } from '@mui/icons-material';
import { blue, yellow } from '@mui/material/colors';
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import {DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, ruRU} from '@mui/x-data-grid';
import LoginIcon from '@mui/icons-material/Login';

import {deleteRequestHandler, getRequestHandler, postRequestHandler} from "./Requests";

import {ParentDefault, UserDefault} from "./Structs_default";

const styles = {
    paperGuide: {
        padding: "10px 15px 10px 15px",
        borderRadius: 15,
        backgroundColor: yellow[300],
    },
    paperManager: {
        padding: 10,
        borderRadius: 15,
        minWidth:290,
    },
    paperManagerBase: {
        padding: "103px 10px 103px 10px",
        borderRadius: 15,
        minWidth:290,
        height: 37,
        textAlign: 'center',
    },
}

const LkManager = ({ user, setUser, setOpenAlert, setAlertType, setAlertMessage }) => {
    let navigate = useNavigate();

    const renderDetailsButton = (params) => {
        return (
            <IconButton
                color='info'
                onClick={() => {
                    console.log(params.row.id)
                }}
            >
                <LoginIcon fontSize="inherit" />
            </IconButton>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'createTime', headerName: 'Дата заявки', width: 150 },
        { field: 'type', headerName: 'Тип заявки', minWidth: 350 },
        { field: 'firstName', headerName: 'Имя', minWidth: 250 },
        { field: 'secondName', headerName: 'Фамилия', minWidth: 250 },
        {
            field: 'goto',
            headerName: '',
            width: 60,
            sortable: false,
            renderCell: renderDetailsButton,
        }
    ];

    const [rows, setRows] = useState([]);

    const [requests, setRequests] = useState([]);
    const [requestsNeedUpdate, setRequestsNeedUpdate] = useState(true);

    // Получение списка заявок
    useEffect(() => {
        getRequestHandler('/api/v1/reg/request/manager/list').then(response => {
            switch (response.status) {
                case 200:
                    setRequests(response.data);

                    let rowsBuff = [];
                    response.data.map((req) => {
                        rowsBuff.push({
                            id: req.id,
                            createTime: Intl.DateTimeFormat('ru-RU', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: 'numeric',
                                minute: 'numeric'
                            }).format(new Date(req.create_time * 1000)),
                            type: req.type,
                            firstName: req.user.first_name,
                            secondName: req.user.second_name})
                    })

                    setRows(rowsBuff);
                    break;
                case 401:
                case 403:
                    logout();
                    break;
                default:
                    showBackendFailAlert();
            }
        });
    }, [requestsNeedUpdate])

    // Функция логаута
    const logout = () => {
        setAlertType('error');
        setAlertMessage("Необходимо войти в аккаунт.");
        setUser(UserDefault);
        navigate("/login", {replace: true});
    }

    // Функция для вывода информации об ошибке бекенда
    const showBackendFailAlert = () => {
        setAlertType('error');
        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
        setOpenAlert(true);
    }

    // Обработчик кнопки логаута
    const onLogoutClick = () => {
        deleteRequestHandler('/api/v1/user/auth').then(response => {
            switch (response.status) {
                case 200:
                    logout();
                    break;
                default:
                    showBackendFailAlert();
            }
        })
    };

    // Расчёт контента таблички ФИО пользователя
    const ProfileChip = () => {
        let fio = `${user.second_name} ${user.first_name[0]}.`;
        if (user.last_name !== "") {
            fio += ` ${user.last_name[0]}.`;
        }
        return <Chip sx={{color: blue[50]}} label={fio} />
    };

    // Обработчик закрытия диалоговоего окна регистрации менеджеров
    // const handleCloseAddManagerDialog = () => {
    //     setOpenAddManagerDialog(false);
    // }

    // Обработчик открытия диалоговоего окна регистрации менеджеров
    // const handleOpenAddManagerDialog = () => {
    //     setFirstName("");
    //     setSecondName("");
    //     setLastName("");
    //     setPhone("");
    //     setEmail("");
    //     setEmailValidated(true);
    //     setEmailHelpText("");
    //     setPassword("");
    //     setPasswordValidated(true);
    //     setPasswordHelpText("");
    //     setShowPassword(false);
    //     setOpenAddManagerDialog(true);
    // }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton />
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }


    return (
        <Box>
            <AppBar>
                <Toolbar>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        Личный кабинет менеджера
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
            <Toolbar />

            <DataGrid
                style={{ height: 800, width: '100%'}}
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                rows={rows}
                columns={columns}
                components={{
                    Toolbar: CustomToolbar,
                }}
                pageSize={13}
                rowsPerPageOptions={[13]}
            />
        </Box>
    );
};

export default LkManager;