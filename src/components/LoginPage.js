import React, { useState, useEffect } from 'react';
import { Grid, Paper, TextField, Button, Typography, InputLabel, Input,
    InputAdornment, IconButton, FormHelperText, FormControl, Snackbar, Alert } from '@mui/material'
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { PulseLoader } from "react-spinners";
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getRequestHandler, postRequestHandler } from "./Requests";


const LoginPage = ({ setUser, setOpenAlert, setAlertType, setAlertMessage }) => {
    let navigate = useNavigate();

    // Url query
    const [searchParams, _] = useSearchParams();

    // Поле почты пользователя
    const [email, setEmail] = useState("");
    const [emailValidated, setEmailValidated] = useState(true);
    const [emailHelpText, setEmailHelpText] = useState(" ");

    // Поле пароля пользователя
    const [password, setPassword] = useState("");
    const [passwordValidated, setPasswordValidated] = useState(true);
    const [passwordHelpText, setPasswordHelpText] = useState(" ");
    const [showPassword, setShowPassword] = useState(false);

    // Отображать ли спиннер загрузки во время авторизации
    const [isLoading, setIsLoading] = useState(false);

    // Доступна ли авторизация с такими логином, паролем
    const [loginDisabled, setLoginDisabled] = useState(true);

    // Логин или пароль не найдены в базе
    const [isCredentialsIncorrect, setIsCredentialsIncorrect] = useState(false);

    // Локальное уведомление, для возможности повторить отправку письма с подтвержением почты
    const [openAlertLoginPage, setOpenAlertLoginPage] = React.useState(false);
    const [alertTypeLoginPage, setAlertTypeLoginPage] = React.useState('info');
    const [alertMessageLoginPage, setAlertMessageLoginPage] = React.useState("");

    // Проверка возможности авторизации с такими логином, паролем
    useEffect(() => {
        if (emailValidated && passwordValidated && !isCredentialsIncorrect && email !== "" && password !== "") {
            setLoginDisabled(false);
        } else {
            setLoginDisabled(true);
        }
    }, [email, password]);

    // Проверка токена подтверждения почты и флага успешной регистрации из url query
    useEffect(() => {
        const token = searchParams.get("verification_email_token");
        const registered = searchParams.get("registered");

        if (token) {
            setOpenAlert(false);
            getRequestHandler(`/api/v1/user/email?token=${token}`).then(response => {
                switch (response.status) {
                    case 200:
                        setAlertType('success');
                        setAlertMessage("Почта успешно подтверждена.");
                        setOpenAlert(true);
                        break;
                    case 400:
                        break;
                    case 404:
                        break;
                    default:
                        setAlertType('error');
                        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                        setOpenAlert(true);
                }
            });
        }

        else if (registered === "true") {
            setAlertType('success');
            setAlertMessage("Вы успешно зарегистрированы. На Вашу почту отправлена ссылка для подтверждения.");
            setOpenAlert(true);
        }

    }, [])

    // Обработчик изменения email с валидацией
    const handleEmailChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setEmail(val);
        setEmailValidated(false);
        setIsCredentialsIncorrect(false);
        if (val[len - 1] === ' ') {
            setEmailHelpText("В конце почты не может быть пробелов.");
        } else if (val[0] === ' ') {
            setEmailHelpText("В начале почты не может быть пробелов.");
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) {
            setEmailHelpText("Электронная почта некорректна.");
        }
        else {
            setEmailValidated(true);
        }
    };

    // Обработчик изменения пароля с валидацией
    const handlePasswordChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setPassword(val);
        setPasswordValidated(false);
        setIsCredentialsIncorrect(false);
        if (len < 10) {
            setPasswordHelpText("Пароль должен содержать от 10 символов.");
        } else {
            setPasswordValidated(true);
        }
    };

    // Обработчик кнопки показать пароль
    const onShowPasswordClick = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Обработчик кнопки авторизации
    const onLoginClick = e => {
        e.preventDefault();
        setIsLoading(true);
        setLoginDisabled(true);
        postRequestHandler('/api/v1/user/auth',
            {email: email,
                password: password})
            .then(response => {
                switch (response.status) {
                    case 200:
                        setUser(response.data);
                        navigate("/lk", { replace: true });
                        break;
                    case 400:
                        setAlertType('error');
                        setAlertMessage("Одно из полей заполнено неверно.");
                        setOpenAlert(true);
                        break;
                    case 403:
                        setIsCredentialsIncorrect(true);
                        setAlertType('error');
                        setAlertMessage("Логин или пароль неверны.");
                        setOpenAlert(true);
                        break;
                    case 401:
                        setAlertTypeLoginPage('info');
                        setAlertMessageLoginPage("Для входа в аккаунт подтвердите почту.");
                        setOpenAlertLoginPage(true);
                        break;
                    default:
                        setAlertType('error');
                        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                        setOpenAlert(true);
                }
                setIsLoading(false);
                setLoginDisabled(false);
            })
    };

    // Обработчик кнопки перехода на страницу регистрации
    const onRegistrationClick = () => {
        navigate("/registration")
    }

    // Обработчик кнопки повторной отправки подтверждения почты
    const onSendEmailClick = e => {
        e.preventDefault();
        setOpenAlertLoginPage(false);
        postRequestHandler('/api/v1/user/email',
            {email: email,
                password: password})
            .then(response => {
                switch (response.status) {
                    case 200:
                        setAlertType('success');
                        setAlertMessage("Повторная ссылка для подтверждения отправлена.");
                        setOpenAlert(true);
                        break;
                    case 400:
                        setAlertType('error');
                        setAlertMessage("Одно из полей заполнено неверно.");
                        setOpenAlert(true);
                        break;
                    case 403:
                        setIsCredentialsIncorrect(true);
                        setAlertType('error');
                        setAlertMessage("Логин или пароль неверны.");
                        setOpenAlert(true);
                        break;
                    default:
                        setAlertType('error');
                        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                        setOpenAlert(true);
                }
            })
    }

    // Обработчик кнопки закрытия локального уведомления
    const onCloseAlertLoginPageClick = () => {
        setOpenAlertLoginPage(false);
    };

    const styles = {
        paperStyle: {
            padding :20,
            borderRadius: 15,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -205,
            marginLeft: -160,
            width: 280,
            height: 370,
        },
        iconStyle: {
            color:'rgba(255,0,0,0.51)',
            width: 50,
            height: 50,
            padding:'10px'
        },
        labelStyle: {
            marginBottom:'20px'
        },
        textFieldStyle: {
            marginBottom:'0px'
        },
        buttonLoginStyle: {
            position: 'absolute',
            borderRadius: 15,
            width: 280,
            bottom:'75px',
            left: '20px',
        },
        buttonRegistrationStyle: {
            position: 'absolute',
            borderRadius: 15,
            width: 280,
            bottom:'20px',
            left: '20px',
        },
    };

    return(
        <Paper elevation={12} style={styles.paperStyle}>
            <Grid align='center'>
                <LockOutlined style={styles.iconStyle} />
                <Typography style={styles.labelStyle} variant="h5" gutterBottom>
                    АВТОРИЗАЦИЯ
                </Typography>
            </Grid>

            <TextField
                style={styles.textFieldStyle}
                error={!emailValidated || isCredentialsIncorrect}
                onChange={handleEmailChanged}
                helperText={emailValidated?" ":emailHelpText}
                fullWidth
                required
                variant="standard"
                type='email'
                label='Логин'
            />
            <FormControl fullWidth required error={!passwordValidated || isCredentialsIncorrect} variant="standard">
                <InputLabel htmlFor="login-password-text-field">Пароль</InputLabel>
                <Input
                    id="login-password-text-field"
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
                <FormHelperText id="login-password-text-field">{passwordValidated?" ":passwordHelpText}</FormHelperText>
            </FormControl>

            <Button
                style={styles.buttonLoginStyle}
                onClick={onLoginClick}
                disabled={loginDisabled}
                fullWidth
                color='primary'
                variant='contained'
            >
                {isLoading?
                    <div> <PulseLoader speedMultiplier={2} color={"#ffffff"} size={7} /></div>:
                    "Войти"
                }
            </Button>

            <Button
                style={styles.buttonRegistrationStyle}
                onClick={onRegistrationClick}
                fullWidth
                color='primary'
                variant='outlined'
            >
                Регистрация
            </Button>

            <Snackbar
                open={openAlertLoginPage}
                autoHideDuration={6000}
                onClose={onCloseAlertLoginPageClick}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={onCloseAlertLoginPageClick}
                    severity={alertTypeLoginPage}
                    action={
                            <Button
                                variant='outlined'
                                size="small"
                                onClick={onSendEmailClick}
                            >
                                Отправить повторно
                            </Button>
                    }
                >
                    {alertMessageLoginPage}
                </Alert>
            </Snackbar>
        </Paper>
    )
};

export default LoginPage;