import React, { useState, useEffect } from 'react';
import { Grid, Paper, TextField, Button, Typography, InputAdornment,
    IconButton, Input, InputLabel, FormControl, FormHelperText} from '@mui/material'
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { PulseLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';

import { postRequestHandler } from "./Requests";

const RegistrationPage = ({ setOpenAlert, setAlertType, setAlertMessage }) => {
    let navigate = useNavigate();

    // Данные о пользователе
    const [firstName, setFirstName] = useState("");
    const [firstNameValidated, setFirstNameValidated] = useState(true);
    const [firstNameHelpText, setFirstNameHelpText] = useState(" ");

    const [secondName, setSecondName] = useState("");
    const [secondNameValidated, setSecondNameValidated] = useState(true);
    const [secondNameHelpText, setSecondNameHelpText] = useState(" ");

    const [lastName, setLastName] = useState("");
    const [lastNameValidated, setLastNameValidated] = useState(true);
    const [lastNameHelpText, setLastNameHelpText] = useState(" ");

    const [email, setEmail] = useState("");
    const [emailValidated, setEmailValidated] = useState(true);
    const [emailHelpText, setEmailHelpText] = useState(" ");

    const [password, setPassword] = useState("");
    const [passwordValidated, setPasswordValidated] = useState(true);
    const [passwordHelpText, setPasswordHelpText] = useState(" ");
    const [showPassword, setShowPassword] = useState(false);

    const [passwordCheck, setPasswordCheck] = useState("");
    const [passwordCheckValidated, setPasswordCheckValidated] = useState(true);
    const [passwordCheckHelpText, setPasswordCheckHelpText] = useState(" ");
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const [phone, setPhone] = useState("");
    const [phoneValidated, setPhoneValidated] = useState(true);
    const [phoneHelpText, setPhoneHelpText] = useState(" ");

    // Разрешена ли регистрация
    const [registrationDisabled, setRegistrationDisabled] = useState(true);

    // Проверка возможности регистрации
    useEffect(() => {
        if (firstNameValidated && secondNameValidated && lastNameValidated &&
            emailValidated && passwordValidated && passwordCheckValidated && phoneValidated &&
            firstName !== "" && secondName !== "" && email !== "" && password !== "" &&
            passwordCheck !== "" && phone !== "") {
            setRegistrationDisabled(false);
        } else {
            setRegistrationDisabled(true);
        }
    }, [firstNameValidated, secondNameValidated, lastNameValidated, emailValidated,
        passwordValidated, passwordCheckValidated, phoneValidated]);

    const [isLoading, setIsLoading] = useState(false);

    // Обработчик изменения имени с валидацией
    const handleFirstNameChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setFirstName(val);
        setFirstNameValidated(false);
        if (len < 1) {
            setFirstNameHelpText("Укажите имя.");
        } else if (len > 32) {
            setFirstNameHelpText("Имя не может превышать 32 символа.");
        } else if (/\d/.test(val)) {
            setFirstNameHelpText("Имя не может содержать цифры.");
        } else if (val[len - 1] === ' ') {
            setFirstNameHelpText("В конце имени не может быть пробелов.");
        } else if (val[0] === ' ') {
            setFirstNameHelpText("В начале имени не может быть пробелов.");
        } else {
            setFirstNameValidated(true);
            setFirstNameHelpText(" ");
        }
    };

    // Обработчик изменения фамилии с валидацией
    const handleSecondNameChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setSecondName(val);
        setSecondNameValidated(false);
        if (len < 1) {
            setSecondNameHelpText("Укажите фамилию.");
        } else if (len > 32) {
            setSecondNameHelpText("Фамилия не может превышать 32 символа.");
        } else if (/\d/.test(val)) {
            setSecondNameHelpText("Фамилия не может содержать цифры.");
        } else if (val[len - 1] === ' ') {
            setSecondNameHelpText("В конце фамилии не может быть пробелов.");
        } else if (val[0] === ' ') {
            setSecondNameHelpText("В начале фамилии не может быть пробелов.");
        } else {
            setSecondNameValidated(true);
            setSecondNameHelpText(" ");
        }
    };

    // Обработчик изменения отчества с валидацией
    const handleLastNameChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setLastName(val);
        setLastNameValidated(false);
        if (len > 32) {
            setLastNameHelpText("Отчество не может превышать 32 символа.");
        } else if (/\d/.test(val)) {
            setLastNameHelpText("Отчество не может содержать цифры.");
        } else if (val[len - 1] === ' ') {
            setLastNameHelpText("В конце отчества не может быть пробелов.");
        } else if (val[0] === ' ') {
            setLastNameHelpText("В начале отчества не может быть пробелов.");
        } else {
            setLastNameValidated(true);
            setLastNameHelpText(" ");
        }
    };

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
            setEmailHelpText(" ");
        }
    };

    // Обработчик изменения пароля с валидацией
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
            setPasswordHelpText(" ");
        }
        if (passwordCheck !== "" && val !== passwordCheck) {
            setPasswordCheckHelpText("Пароли не совпадают.");
            setPasswordCheckValidated(false);
        }
    };

    // Обработчик кнопки показа пароля
    const onShowPasswordClick = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Обработчик изменения проверки пароля с валидацией
    const handlePasswordCheckChanged = (e) => {
        const val = e.target.value;
        setPasswordCheck(val);
        setPasswordCheckValidated(false);
        if (val !== password ) {
            setPasswordCheckHelpText("Пароли не совпадают.");
        } else {
            setPasswordCheckValidated(true);
            setPasswordCheckHelpText(" ");
        }
    };

    // Обработчик кнопки показа проверки пароля
    const onShowPasswordCheckClick = () => {
        setShowPasswordCheck(!showPasswordCheck);
    };
    const handleMouseDownPasswordCheck = (event) => {
        event.preventDefault();
    };

    // Обработчик изменения телефона с валидацией
    const handlePhoneChanged = (e) => {
        const val = e.target.value.replace(/\D/g,"");
        const len = val.length;
        setPhone(val);
        setPhoneValidated(false);
        if (len < 10 || len > 16) {
            setPhoneHelpText("Неверный формат. Пример: +79151234567");
        } else {
            setPhoneValidated(true);
            setPhoneHelpText(" ");
        }
    };

    // Обработчик регистрации пользователя
    const onRegistrationClick = () => {
        setRegistrationDisabled(true);
        setIsLoading(true);
        postRequestHandler('/api/v1/user/parent',
            {first_name: firstName,
                second_name: secondName,
                last_name: lastName,
                email: email,
                password: password,
                phone: phone})
            .then(response => {
            switch (response.status) {
                case 200:
                    navigate("/login?registered=true", { replace: true })
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
            setIsLoading(false);
            setRegistrationDisabled(false);
        })
    }

    // Обработчик перехода на страницу авторизации
    const onLoginClick = () => {
        navigate("/login", { replace: true })
    }

    const styles = {
        paperStyle: {
            padding: 20,
            borderRadius: 15,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -380,
            marginLeft: -160,
            width: 280,
            height: 720,
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
        buttonRegistrationStyle: {
            position: 'absolute',
            borderRadius: 15,
            width: 280,
            bottom:'75px',
            left: '20px',
        },
        buttonLoginStyle: {
            position: 'absolute',
            borderRadius: 15,
            width: 280,
            bottom:'20px',
            left: '20px',
        }
    };

    return(
        <Paper elevation={12} style={styles.paperStyle}>
            <Grid align='center'>
                <LockOutlined style={styles.iconStyle} />
                <Typography style={styles.labelStyle} variant="h5" gutterBottom>
                    Регистрация родителя
                </Typography>
            </Grid>

            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Имя'
                fullWidth
                required
                onChange={handleFirstNameChanged}
                error={!firstNameValidated}
                helperText={firstNameHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Фамилия'
                fullWidth
                required
                onChange={handleSecondNameChanged}
                error={!secondNameValidated}
                helperText={secondNameHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Отчество'
                fullWidth
                onChange={handleLastNameChanged}
                error={!lastNameValidated}
                helperText={lastNameHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                type='email'
                label='Электронная почта'
                fullWidth
                required
                onChange={handleEmailChanged}
                error={!emailValidated}
                helperText={emailHelpText}
            />
            <FormControl fullWidth required error={!passwordValidated} variant="standard">
                <InputLabel htmlFor="register-password-text-field">Пароль</InputLabel>
                <Input
                    id="register-password-text-field"
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
                <FormHelperText id="register-password-text-field">{passwordHelpText}</FormHelperText>
            </FormControl>
            <FormControl fullWidth required error={!passwordCheckValidated} variant="standard">
                <InputLabel htmlFor="register-password-check-text-field">Повтор пароля</InputLabel>
                <Input
                    id="register-password-check-text-field"
                    style={styles.textFieldStyle}
                    onChange={handlePasswordCheckChanged}
                    type={showPasswordCheck ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={onShowPasswordCheckClick}
                                onMouseDown={handleMouseDownPasswordCheck}
                            >
                                {showPasswordCheck ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <FormHelperText id="register-password-check-text-field">{passwordCheckHelpText}</FormHelperText>
            </FormControl>
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Номер телефона'
                fullWidth
                required
                onChange={handlePhoneChanged}
                error={!phoneValidated}
                helperText={phoneHelpText}
            />

            <Button
                style={styles.buttonRegistrationStyle}
                fullWidth
                onClick={onRegistrationClick}
                disabled={registrationDisabled}
                color='primary'
                variant='contained'
            >
                {isLoading?
                    <div> <PulseLoader speedMultiplier={2} color={"#ffffff"} size={7} /></div>:
                    "Зарегистрироваться"
                }
            </Button>

            <Button
                style={styles.buttonLoginStyle}
                fullWidth
                onClick={onLoginClick}
                color='primary'
                variant='outlined'
            >
                Вход
            </Button>
        </Paper>
    )
};

export default RegistrationPage;