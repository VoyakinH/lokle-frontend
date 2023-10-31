import React, { useEffect, useState } from "react";
import { Button, Paper, AppBar, Toolbar, Typography, FormControl,
    InputLabel, Input, InputAdornment, IconButton, FormHelperText,
    Dialog, DialogActions, DialogTitle, DialogContent, TextField,
    Chip, Grid, Box} from '@mui/material';
import { Logout, VisibilityOff, Visibility } from '@mui/icons-material';
import { blue, yellow } from '@mui/material/colors';
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import {deleteRequestHandler, getRequestHandler, postRequestHandler} from "./Requests";

import { UserDefault } from "./Structs_default";

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

const LkAdmin = ({ user, setUser, setOpenAlert, setAlertType, setAlertMessage }) => {
    let navigate = useNavigate();

    // Список менеджеров
    const [managersList, setManagersList] = useState(null);
    const [managersListUpdateCounter, setManagersListUpdateCounter] = useState(0);
    const [isManagersListLoading, setIsManagersListLoading] = useState(false);

    // Диалоговое окно регистрации менеджера
    const [openAddManagerDialog, setOpenAddManagerDialog] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");
    const [emailValidated, setEmailValidated] = useState(true);
    const [emailHelpText, setEmailHelpText] = useState("");

    const [password, setPassword] = useState("");
    const [passwordValidated, setPasswordValidated] = useState(true);
    const [passwordHelpText, setPasswordHelpText] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [phone, setPhone] = useState("");

    const [managerRegistrationDisabled, setManagerRegistrationDisabled] = useState(true);
    const [isManagerRegistrationLoading, setIsManagerRegistrationLoading] = useState(false);

    // Проверка возможности регистрации
    useEffect(() => {
        if (emailValidated && passwordValidated && email !== "" && password !== "") {
            setManagerRegistrationDisabled(false);
        } else {
            setManagerRegistrationDisabled(true);
        }
    }, [emailValidated, passwordValidated]);

    // Получение списка зарегистрированных менеджеров
    useEffect(() => {
        setIsManagersListLoading(true);
        getRequestHandler('/api/v1/user/admin/managers').then(response => {
            switch (response.status) {
                case 200:
                    setManagersList(response.data);
                    break;
                case 401:
                case 403:
                    setUser(UserDefault);
                    navigate("/login", { replace: true });
                    break;
                default:
                    setAlertType('error');
                    setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                    setOpenAlert(true);
            }
            setIsManagersListLoading(false);
        });
    }, [managersListUpdateCounter])

    // Обработчик кнопки логаута
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

    // Расчёт контента таблички ФИО пользователя
    const ProfileChip = () => {
        let fio = `${user.second_name} ${user.first_name[0]}.`;
        if (user.last_name !== "") {
            fio += ` ${user.last_name[0]}.`;
        }
        return <Chip sx={{color: blue[50]}} label={fio} />
    };

    // Рендер карточек менеджеров
    const ManagerCards = () => {
        return (managersList && managersList.map((manager) => (
            <Grid item key={`managerGrid${manager.id}`}>
                <Paper elevation={6} style={styles.paperManager}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        ФИО
                    </Typography>
                    <Typography variant="h6" component="div">
                        {manager.second_name !== ""? manager.second_name: "Не указана"} <br/>
                        {manager.first_name !== ""? manager.first_name: "Не указано"} <br/>
                        {manager.last_name !== ""? manager.last_name: "Не указано"}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        Номер телефона
                    </Typography>
                    <Typography variant="h6" component="div">
                        {manager.phone !== ""? manager.phone: "Не указан"}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        Электронная почта
                    </Typography>
                    <Typography variant="h6" component="div">
                        {manager.email}
                    </Typography>
                </Paper>
            </Grid>
        )))
    };

    // Обработчик закрытия диалоговоего окна регистрации менеджеров
    const handleCloseAddManagerDialog = () => {
        setOpenAddManagerDialog(false);
    }

    // Обработчик открытия диалоговоего окна регистрации менеджеров
    const handleOpenAddManagerDialog = () => {
        setFirstName("");
        setSecondName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setEmailValidated(true);
        setEmailHelpText("");
        setPassword("");
        setPasswordValidated(true);
        setPasswordHelpText("");
        setShowPassword(false);
        setOpenAddManagerDialog(true);
    }

    // Обработчик изменения email с валидацией
    const handleEmailChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setEmail(val);
        setEmailValidated(false);
        if (val[len - 1] === ' ') {
            setEmailHelpText("В конце почты не может быть пробелов.");
        } else if (val[0] === ' ') {
            setEmailHelpText("В начале почты не может быть пробелов.");
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) {
            setEmailHelpText("Электронная почта некорректна.");
        }
        else {
            setEmailValidated(true);
            setEmailHelpText("");
        }
    };

    // Обработчик изменения password с валидацией
    const handlePasswordChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setPassword(val);
        setPasswordValidated(false);
        if (len < 10) {
            setPasswordHelpText("Пароль должен содержать от 10 символов.");
        } else if (!/\d/.test(val)) {
            setPasswordHelpText("Необходима хотя бы одна цифра.");
        } else if (val.toLowerCase() === val) {
            setPasswordHelpText("Необходима хотя бы одна заглавная буква.");
        } else {
            setPasswordValidated(true);
            setPasswordHelpText("");
        }
    };

    // Обработчик нажатия показать пароль
    const onShowPasswordClick = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Обработчик регистрации менеджера
    const onManagerRegistrationClick = () => {
        setIsManagerRegistrationLoading(true);
        setManagerRegistrationDisabled(true);
        postRequestHandler('/api/v1/user/admin/manager',
            {first_name: firstName,
                second_name: secondName,
                last_name: lastName,
                email: email,
                password: password,
                phone: phone})
            .then(response => {
                switch (response.status) {
                    case 200:
                        setManagersListUpdateCounter(managersListUpdateCounter + 1);
                        setOpenAddManagerDialog(false);
                        setAlertType("success");
                        setAlertMessage("Менеджер зарегистрирован.");
                        setOpenAlert(true);
                        break;
                    case 400:
                        setAlertType("info");
                        setAlertMessage("Одно из полей заполнено неверно.");
                        setOpenAlert(true);
                        break;
                    case 409:
                        setEmailValidated(false);
                        setEmailHelpText("Введённая почта уже занята.");
                        setAlertType("info");
                        setAlertMessage("Введённая почта уже занята.");
                        setOpenAlert(true);
                        break;
                    default:
                        setAlertType("error");
                        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                        setOpenAlert(true);
                }
                setIsManagerRegistrationLoading(false);
                setManagerRegistrationDisabled(false);
            })
    };

    return (
        <Box>
            <AppBar>
                <Toolbar>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        Личный кабинет администратора
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

            <Paper elevation={6} style={styles.paperGuide} >
                <Typography variant="body1">
                    На данной странице Вы можете регистрировать менеджеров.
                    Для этого необходимо указать его данные и придумать пароль.
                    Менеджеру не нужно будет подтвержать свою почту, она будет служить логином для входа в его личный кабинет.
                </Typography>
            </Paper>

            <Typography variant="h5" mt={2} mb={2}>
                Менеджеры
            </Typography>

            <Grid container spacing={2} justifyContent="flex-start">
                <ManagerCards/>

                <Grid item key={`managerGridBase`}>
                    <Paper elevation={6} style={styles.paperManagerBase}>
                        {isManagersListLoading?
                            <PulseLoader speedMultiplier={2} color={blue[500]} size={10} />:
                            <Button
                                onClick={handleOpenAddManagerDialog}
                            >
                                Добавить менеджера
                            </Button>}
                    </Paper>
                </Grid>
            </Grid>

            <Dialog maxWidth={'xs'} open={openAddManagerDialog} onClose={handleCloseAddManagerDialog}>
                <DialogTitle>Регистрация менеджера</DialogTitle>

                <DialogContent >
                    <TextField
                        style={styles.textFieldStyle}
                        fullWidth
                        variant="standard"
                        label='Имя'
                        onChange={e => {setFirstName(e.target.value)}}
                    />
                    <TextField
                        style={styles.textFieldStyle}
                        fullWidth
                        variant="standard"
                        label='Фамилия'
                        onChange={e => {setSecondName(e.target.value)}}
                    />
                    <TextField
                        style={styles.textFieldStyle}
                        fullWidth
                        variant="standard"
                        label='Отчество'
                        onChange={e => {setLastName(e.target.value)}}
                    />
                    <TextField
                        style={styles.textFieldStyle}
                        fullWidth
                        variant="standard"
                        type='email'
                        label='Электронная почта'
                        required
                        onChange={handleEmailChanged}
                        error={!emailValidated}
                        helperText={emailHelpText}
                    />
                    <FormControl fullWidth required error={!passwordValidated} variant="standard">
                        <InputLabel htmlFor="reg-manager-password-text-field">Пароль</InputLabel>
                        <Input
                            id="reg-manager-password-text-field"
                            style={styles.textFieldStyle}
                            onChange={handlePasswordChanged}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onShowPasswordClick}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText id="reg-manager-password-text-field">{passwordHelpText}</FormHelperText>
                    </FormControl>
                    <TextField
                        style={styles.textFieldStyle}
                        fullWidth
                        variant="standard"
                        label='Номер телефона'
                        onChange={e => {setPhone(e.target.value)}}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={onManagerRegistrationClick}
                        color={'success'}
                        disabled={managerRegistrationDisabled}
                    >
                        {isManagerRegistrationLoading?
                            <div> <PulseLoader speedMultiplier={2} color={blue[500]} size={7} /></div>:
                            "Зарегистрировать"}
                    </Button>

                    <Button color={'error'} onClick={handleCloseAddManagerDialog}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LkAdmin;