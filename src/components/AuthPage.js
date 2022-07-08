import React, { useState, useEffect } from 'react';
import { Grid, Paper, TextField, Button, Typography } from '@mui/material'
import { LockOutlined } from '@mui/icons-material';
import {Navigate} from 'react-router-dom';
import {getRequestHandler, postRequestHandler} from "./Requests";

import Cookies from 'js-cookie'

const AuthPage = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [textFieldError, setTextFieldError] = useState(false);

    useEffect(() => {
        getRequestHandler('/validate_user').then(response => {
            response.status === 200? props.setIsAuthorized(true): props.setIsAuthorized(false);
            props.setIsLoading(false);
        });
    }, []);

    const onLoginClick = e => {
        e.preventDefault();
        if ((email === "kyrov" && password === "1234") || (email === "tassov" && password === "4321")|| (email === "admin" && password === "qwerty")) {
            postRequestHandler('/login', {Email: email, Password: password}).then(response => {
                response.status === 200? props.setIsAuthorized(true): props.setIsAuthorized(false)
            })
            Cookies.set('email', email, { expires: 7 })
        } else {
            setTextFieldError(true);
        }
    };

    const styles = {
        paperStyle: {
            padding :20,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -170,
            marginLeft: -160,
            width: 280,
            height: 300
        },
        iconStyle: {
            color:'rgba(255,0,0,0.51)',
            width: 50,
            height: 50,
            marginBottom:'10px'
        },
        labelStyle: {
            marginBottom:'30px'
        },
        textFieldStyle: {
            marginBottom:'8px'
        },
        buttonStyle: {
            marginTop:'20px'
        }
    };

    return(
        props.isLoading?
            <div/>:
            !props.isAuthorized?
                <Paper elevation={24} style={styles.paperStyle}>
                    <Grid align='center'>
                        <LockOutlined style={styles.iconStyle} />
                        <Typography style={styles.labelStyle} variant="h5" gutterBottom>
                            АВТОРИЗАЦИЯ
                        </Typography>
                    </Grid>
                    <TextField
                        style={styles.textFieldStyle}
                        fullWidth
                        required
                        error={textFieldError}
                        onChange={e => {
                            setEmail(e.target.value)
                            setTextFieldError(false)}}
                        variant="standard"
                        label='Логин'
                    />
                    <TextField
                        style={styles.textFieldStyle}
                        fullWidth
                        required
                        error={textFieldError}
                        onChange={e => {
                            setPassword(e.target.value)
                            setTextFieldError(false)}}
                        variant="standard"
                        type='password'
                        label='Пароль'
                    />

                    <Button
                        style={styles.buttonStyle}
                        fullWidth
                        onClick={onLoginClick}
                        type='submit'
                        color='primary'
                        variant="contained"
                    >
                        Войти
                    </Button>
                </Paper>:
                <Navigate to="/lk" />
    );
};

export default AuthPage;