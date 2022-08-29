import React, {useEffect, useState} from "react";
import {
    Button,
    Paper,
    Tab,
    AppBar,
    Toolbar,
    Typography,
    DialogTitle,
    DialogContent,
    TextField,
    FormControl, InputLabel, Input, InputAdornment, IconButton, FormHelperText, DialogActions, Dialog, Grid
} from '@mui/material';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box} from '@mui/material';
import {Logout, AccountCircle, VisibilityOff, Visibility} from '@mui/icons-material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {useNavigate} from "react-router-dom";
import {deleteRequestHandler, getRequestHandler, postRequestHandler} from "./Requests";
import {UserDefault, ParentDefault} from "./Structs_default";
import {blue, yellow} from '@mui/material/colors';
import {PulseLoader} from "react-spinners";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import ruLocale from 'dayjs/locale/ru';

const styles = {
    paperPassportParent: {
        padding: "15px 15px 15px 15px",
        borderRadius: 15,
        backgroundColor: yellow[300],
    },
    paperChildBase: {
        padding: "103px 10px 103px 10px",
        borderRadius: 15,
        minWidth: 290,
        height: 37,
        textAlign: 'center',
    },
    paperChild: {
        padding: 10,
        borderRadius: 15,
        minWidth: 290,
    },
    // paperBudget: {
    //     position: 'absolute',
    //     marginLeft: '20px',
    //     marginRight: '20px',
    //     marginBottom: '20px',
    //     marginTop: '84px',
    //     width: 'calc(100% - 56px)',
    //     height: 'calc(100% - 120px)',
    // },
    // paperChild: {
    //     position: 'absolute',
    //     marginTop: '15px',
    //     width: 'calc(100% - 30px)',
    //     height: 'calc(100% - 65px)',
    // },
    // tabPanelBudget: {
    //     position: 'absolute',
    //     padding: '15px',
    //     width: 'calc(100% - 30px)',
    //     height: 'calc(100% - 78px)',
    // },
    // tabPanelChild: {
    //     padding: '0px',
    //     height: 'calc(100% - 50px)',
    // },
    // tabList: {
    //     backgroundColor: 'rgb(228,228,228)',
    //     borderTopLeftRadius: '4px',
    //     borderTopRightRadius: '4px',
    // },
}

const LkParent = ({user, setUser, setOpenAlert, setAlertType, setAlertMessage}) => {
    let navigate = useNavigate();

    // Данные родителя
    const [parent, setParent] = useState(ParentDefault);
    // Заявка на прикрепление паспорта родителя
    const [parentPassportRequest, setParentPassportRequest] = useState({});

    // Список детей родителя
    const [children, setChildren] = useState(null);
    const [childrenUpdateCounter, setChildrenUpdateCounter] = useState(0);
    const [isChildrenListLoading, setIsChildrenListLoading] = useState(true);

    // Диалоговое окно
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContentType, setDialogContentType] = useState("");
    const [isDialogSendLoading, setIsDialogSendLoading] = useState(false);

    // Прикреплённые документы
    const [selectedFiles, setSelectedFiles] = useState("");
    // Кол-во прикреплённых документов
    const [filesCount, setFilesCount] = useState({});

    // Виджет информации о паспорте родителя
    // Данные паспорта родителя
    const [parentPassport, setParentPassport] = useState("");
    const [parentPassportValidated, setParentPassportValidated] = useState(true);
    const [parentPassportHelpText, setParentPassportHelpText] = useState("");

    // Первая стадия регистрации ребёнка
    const [firstName, setFirstName] = useState("");
    const [firstNameValidated, setFirstNameValidated] = useState(true);
    const [firstNameHelpText, setFirstNameHelpText] = useState("");

    const [secondName, setSecondName] = useState("");
    const [secondNameValidated, setSecondNameValidated] = useState(true);
    const [secondNameHelpText, setSecondNameHelpText] = useState("");

    const [lastName, setLastName] = useState("");
    const [lastNameValidated, setLastNameValidated] = useState(true);
    const [lastNameHelpText, setLastNameHelpText] = useState("");

    const [email, setEmail] = useState("");
    const [emailValidated, setEmailValidated] = useState(true);
    const [emailHelpText, setEmailHelpText] = useState("");

    const [phone, setPhone] = useState("");
    const [phoneValidated, setPhoneValidated] = useState(true);
    const [phoneHelpText, setPhoneHelpText] = useState("");

    // Разрешена ли отправка запроса на первичную регистрацию первой стадии ребёнка.
    const [registrationDisabled, setRegistrationDisabled] = useState(true);

    // Проверка возможности регистрации
    // useEffect(() => {
    //     if (firstNameValidated && secondNameValidated && lastNameValidated &&
    //         emailValidated && passwordValidated && passwordCheckValidated && phoneValidated &&
    //         firstName !== "" && secondName !== "" && email !== "" && password !== "" &&
    //         passwordCheck !== "" && phone !== "") {
    //         setRegistrationDisabled(false);
    //     } else {
    //         setRegistrationDisabled(true);
    //     }
    // }, [firstNameValidated, secondNameValidated, lastNameValidated, emailValidated,
    //     passwordValidated, passwordCheckValidated, phoneValidated]);


    // useEffect(() => {
    //     postRequestHandler('/api/v1/file/download',
    //         {
    //             user_id: 102,
    //             file_name: "passport"
    //         })
    //         .then(response => {
    //         switch (response.status) {
    //             case 200:
    //
    //                 console.log(response.data);
    //
    //                 // const byteCharacters = atob(response.data.files[0].file);
    //                 // const byteNumbers = new Array(byteCharacters.length);
    //                 // for (let i = 0; i < byteCharacters.length; i++) {
    //                 //     byteNumbers[i] = byteCharacters.charCodeAt(i);
    //                 // }
    //                 // const byteArray = new Uint8Array(byteNumbers);
    //                 // const blob = new Blob([byteArray], {type: response.data.files[0].type});
    //
    //                 // console.log(URL.createObjectURL(blob))
    //
    //                 // console.log(URL.createObjectURL(blob));
    //                 // setType(response.data.files[0].type)
    //                 // setPng(URL.createObjectURL(blob));
    //                 break;
    //             case 401:
    //                 // logout();
    //                 break;
    //             default:
    //                 // showBackendFailAlert();
    //                 console.log("back fail");
    //         }
    //     });
    // }, [])

    // Получение данных родителя при загрузке страницы
    useEffect(() => {
        getRequestHandler('/api/v1/user/parent').then(response => {
            // @ts-ignore
            switch (response.status) {
                case 401:
                    logout();
                    break;
                case 200:
                    setParent(response.data);
                    break;
                default:
                    showBackendFailAlert();
            }
        });
    }, [])

    // Получение информации о заявке на прикрепление паспорта если родитель уже его прикреплял
    useEffect(() => {
        if (!parent.passport_verified && parent.passport !== "") {
            getRequestHandler('/api/v1/reg/request/parent/list').then(response => {
                switch (response.status) {
                    case 200:
                        setParentPassportRequest(response.data[0]);
                        break;
                    case 401:
                        console.log("/reg/request/parent/list 401")
                        logout();
                        break;
                    case 404:
                        console.log("/reg/request/parent/list 404")
                        break;
                    default:
                        console.log("/reg/request/parent/list 500");
                        showBackendFailAlert();

                }
            });
        }
    }, [parent])

    // Получение списка детей родителя при изменении childrenUpdateCounter
    useEffect(() => {
        setIsChildrenListLoading(true);
        getRequestHandler('/api/v1/user/parent/children').then(response => {
            if (!response)
                return;
            switch (response.status) {
                case 200:
                    setChildren(response.data);
                    break;
                case 401:
                    logout();
                    break;
                default:
                    showBackendFailAlert();
            }
        });
        setIsChildrenListLoading(false);
    }, [childrenUpdateCounter])

    // Функция логаута
    const logout = () => {
        setAlertType('error');
        setAlertMessage("Необходимо войти в аккаунт.");
        setParent(ParentDefault);
        setUser(UserDefault);
        navigate("/login", {replace: true});
    }

    // Функция для вывода информации об ошибке бекенда
    const showBackendFailAlert = () => {
        setAlertType('error');
        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
        setOpenAlert(true);
    }

    // Расчёт контента таблички ФИО пользователя
    const ProfileChip = () => {
        let fio = `${user.second_name} ${user.first_name[0]}.`;
        if (user.last_name !== "") {
            fio += ` ${user.last_name[0]}.`;
        }
        return <Chip sx={{color: blue[50]}} label={fio}/>
    };

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

    // Очистка файлов нужного типа на сервере
    const filesDelete = async (userId, fileName) => {
        let successful = false;
        await postRequestHandler('/api/v1/file/delete',
            {
                user_id: userId,
                file_name: fileName
            })
            .then(response => {
                switch (response.status) {
                    // case 400:
                    //     console.log("/api/v1/file/upload 400 Поле для ввода паспорта пустое или неправильная структура запроса.");
                    //     setAlertType('error');
                    //     setAlertMessage("Поле для ввода паспорта пустое.");
                    //     setOpenAlert(true);
                    //     return;
                    case 200:
                        console.log("/api/v1/file/delete 200.");
                        successful = true;
                        break;
                    case 400:
                        console.log("/api/v1/file/delete 400.");
                        successful = true;
                        break;
                    case 401:
                        console.log("/api/v1/file/delete 401.");
                        logout();
                        break;
                    case 403:
                        // ?????
                        console.log("/api/v1/file/delete 403.");
                        showBackendFailAlert();
                        break;
                    case 404:
                        // ?????
                        console.log("/api/v1/file/delete 404.");
                        showBackendFailAlert();
                        break;
                    default:
                        console.log("/api/v1/file/delete 500");
                        showBackendFailAlert();
                }
            })
            .then(() => {
                setFilesCount({...filesCount, passport: 0});
                setSelectedFiles("");
            })
        return successful;
    }

    // Выгрузка файлов на сервер
    const fileUpload = async (userID, file, fileBaseName) => {
        await postRequestHandler('/api/v1/file/upload',
            {
                file: file,
                userID: userID,
                filename: fileBaseName
            }, true)
            .then(response => {
                switch (response.status) {
                    case 200:
                        console.log("/api/v1/file/upload 200.");
                        setFilesCount({...filesCount, [fileBaseName]: ++filesCount[fileBaseName]});
                        break;
                    case 401:
                        console.log("/api/v1/file/upload 401.");
                        logout();
                        break;
                    case 400:
                        console.log("/api/v1/file/upload 400.");
                        showBackendFailAlert()
                        break;
                    default:
                        console.log(`/api/v1/file/upload 500 (backend error: (${response.body}).`);
                        showBackendFailAlert()
                }
            })
    }

    const fileUploadHandler = async(userID, selectedFile, fileBaseName) => {
        await fileUpload(userID, selectedFile, fileBaseName)
    }

    const filesUploadHandler = async(userID, selectedFilesCount, selectedFiles, fileBaseName) => {
        for (let i = 0; i < selectedFilesCount; i++) {
            await fileUploadHandler(userID, selectedFiles[i], fileBaseName);
        }
    }

    // Были выбраны файлы для прикрепления
    const filesSelectedHandler = (event, userID, fileBaseName, maxFilesCount, maxFileSize) => {
        const selectedFilesCount = event.target.files.length;
        const selectedFiles = event.target.files;
        const earlySelectedFiles = filesCount[fileBaseName] ? filesCount[fileBaseName] : 0;
        const maxFileSizeBytes = maxFileSize * 1024 * 1024;

        if (earlySelectedFiles + selectedFilesCount <= maxFilesCount) {
            for (let i = 0; i < selectedFilesCount; i++) {
                if (selectedFiles[i].size > maxFileSizeBytes) {
                    setAlertType('info');
                    setAlertMessage(`Максимальный размер одного файла: ${maxFileSize} Мб.`);
                    setOpenAlert(true);
                    return;
                }
            }

            filesUploadHandler(userID, selectedFilesCount, selectedFiles, fileBaseName)
                .then((r) => {
                    if (filesCount[fileBaseName] - earlySelectedFiles !== selectedFilesCount) {
                        filesDelete(userID, fileBaseName).then(() => {});
                    }
                    // if (!r) {
                    //     filesDelete(userID, fileBaseName);
                    // }
                    // if (r) {
                    //     setFilesCount({...filesCount, [fileBaseName]: earlySelectedFiles + selectedFilesCount});
                    // }
                    // else {
                    //     filesDelete(userID, fileBaseName);
                    // }
                });
            // let successful = true;
            // for (let i = 0; i < selectedFilesCount; i++) {
            //     await fileUpload(selectedFiles[i], userID, fileBaseName)
            //         .then((r) => {
            //             if (r) {
            //                 setFilesCount({...filesCount, [fileBaseName]: earlySelectedFiles + 1});
            //             }
            //             // else {
            //             //     successful = false;
            //             // }
            //         });
            // }

            // if (successful) {
            //     setFilesCount({...filesCount, [fileBaseName]: earlySelectedFiles + selectedFilesCount});
            // }
        } else {
            setAlertType('info');
            setAlertMessage(`Максимальное кол-во прикрепляемых файлов: ${maxFilesCount}.`);
            setOpenAlert(true);
        }
    };

    // Рендер виджета с информацией о паспорте родителя
    const ParentPassportSection = () => {
        // Паспорт не проверен и не прикреплялся
        if (!parent.passport_verified && parent.passport === "") {
            return (
                <Paper elevation={6} style={styles.paperPassportParent}>
                    <Typography variant="body1" mb={1}>
                        Для зачисления ребёнка в ЧУ СОШ «Столичный - КИТ» Вам необходимо подтвердить свои паспортные
                        данные. <br/>
                        Если Ваш ребёнок уже обучается в нашей школе, пропустите данный шаг. <br/>
                    </Typography>
                    <Button
                        size={"small"}
                        variant={"outlined"}
                        onClick={openAddParentPassportDialog}
                    >
                        Подтвердить паспортные данные
                    </Button>
                </Paper>
            )
        } else if (parent.passport_verified === false && parent.passport !== "") {
            return (
                <Paper elevation={6} style={styles.paperPassportParent}>
                    <div>ПАСПОРТ</div>
                    <div>Дата отправки заявки: {
                        parentPassportRequest.create_time ? new Intl.DateTimeFormat('ru-RU', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            timeZoneName: 'long'
                        }).format(new Date(parentPassportRequest.create_time * 1000)) : "Загрузка"
                    }</div>
                    <div>Статус: {
                        parentPassportRequest.status === "pending" ? "На проверке." : "Загрузка"
                    }</div>
                </Paper>

            )
        }
        // else if (parent.passport_verified === false && parent.passport !== "") {
        //     return (
        //         <Paper elevation={6} style={styles.paperPassportParent}>
        //             <div>ПАСПОРТ</div>
        //             <div>Дата отправки заявки: {
        //                 parentPassportRequest.create_time?parentPassportRequestDate:"Загрузка"
        //             }</div>
        //             <div>Стутус: {
        //                 parentPassportRequest.status==="pending"?"На проверке.":"Загрузка"
        //             }</div>
        //         </Paper>
        //
        //     )
        // }

    }

    const [parentPassportFilesFromServer, setParentPassportFilesFromServer] = useState([]);

    // Обработчик нажатия на кнопку первого добавления паспорта родителя
    const openAddParentPassportDialog = () => {
        filesDelete(user.id, "passport")
            .then(r => {
                if (r) {
                    setParentPassport("");
                    setParentPassportValidated(true);
                    setParentPassportHelpText("");

                    setDialogTitle("Добавление паспорта родителя");
                    setDialogContentType("parentPassportFirstAdd");
                    setOpenDialog(true);
                }
            });
    };

    // Обработчик изменения серии номера паспорта родителя
    const handleParentPassportChanged = (e) => {
        const val = e.target.value;
        const val_nums = val.replace(/\D/g, "");
        setParentPassport(val);
        setParentPassportValidated(false);
        if (val.length !== 10 || val_nums.length !== 10) {
            setParentPassportHelpText("Неверный формат. Пример: 4253847635");
        } else {
            setParentPassportValidated(true);
            setParentPassportHelpText("");
        }
    };

    // Содержимое диалогового окна для первого прикрепления паспорта родителя
    const ParentPassportFirstAddDialogContent = (
        <div>
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label="Серия и номер паспорта"
                fullWidth
                required
                onChange={handleParentPassportChanged}
                error={!parentPassportValidated}
                helperText={parentPassportHelpText}
            />

            <Button variant="contained" component="label">
                Добавить документ или фото
                <input
                    hidden
                    accept=".png, .jpeg, .jpg, .pdf"
                    multiple
                    type="file"
                    onChange={(event) => {
                        filesSelectedHandler(event, user.id, "passport", 3, 5);
                    }}
                />
            </Button>

            <h5>Прикреплено файлов: {filesCount["passport"]}</h5>

            <Button
                color="inherit"
                onClick={() => {
                    filesDelete(user.id, "passport");
                }}
            >
                Удалить прикреплённые фото
            </Button>
        </div>
    );

    // Обработчик открытия диалоговоего окна регистрации менеджеров
    const openAddChildDialog = () => {
        setDialogTitle("Первичная регистрация ученика");
        setDialogContentType("childFirstStageFirstAdd");
        setOpenDialog(true);
    }

    const [childAlreadyInSchool, setChildAlreadyInSchool] = useState(true);

    const handleChangeChildAlreadyInSchool = (event) => {
        setChildAlreadyInSchool(event.target.checked);
    };


    const [childFirstName, setChildFirstName] = useState("");
    const [childSecondName, setChildSecondName] = useState("");
    const [childLastName, setChildLastName] = useState("");
    const [childEmail, setChildEmail] = useState("");
    const [childPhone, setChildPhone] = useState("");

    const [value, setValue] = React.useState(null);

    // {
    //     "child": {
    //         "first_name": "testik",
    //         "second_name": "Ребенков2",
    //         "last_name": "Ребенкович2",
    //         "email": "testik@mail.ru",
    //         "phone": "+79227244788",
    //         "birth_date": 1121889600
    // },
    //     "is_student": false
    // }

    // Содержимое диалогового окна для первичного выполнения первой стадии регистрации ученика
    const ChildFirstStageFirstAddDialogContent = (
        <div>

            {parent.passport_verified?<div></div>:<div>Для регистрации ребёнка, который ещё не учился в нашей школе необходимо подтвердить Ваш паспорт. Для этого следуйте инструкциям на главном экране личного кабинета.</div>}

            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={childAlreadyInSchool}
                            onChange={handleChangeChildAlreadyInSchool}
                            disabled={!parent.passport_verified}
                        />
                    }
                    label="Ученик уже обучался в нашей школе"
                />
            </FormGroup>

            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Имя'
                fullWidth
                // disabled={parent.passport_verified}
                // required
                onChange={e => {setChildFirstName(e.target.value)}}
                // error={!firstNameValidated}
                // helperText={firstNameHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Фамилия'
                fullWidth
                // required
                onChange={e => {setChildSecondName(e.target.value)}}
                // error={!secondNameValidated}
                // helperText={secondNameHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Отчество'
                fullWidth
                onChange={e => {setChildLastName(e.target.value)}}
                // error={!lastNameValidated}
                // helperText={lastNameHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                type='email'
                label='Электронная почта'
                fullWidth
                // required
                onChange={e => {setChildEmail(e.target.value)}}
                // error={!emailValidated}
                // // helperText={emailHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Номер телефона'
                fullWidth
                // required
                onChange={e => {setChildPhone(e.target.value)}}
                // error={!phoneValidated}
                // helperText={phoneHelpText}
            />

            {/*<Button variant="contained" component="label">*/}
            {/*    Upload*/}
            {/*    <input*/}
            {/*        hidden*/}
            {/*        accept=".png, .jpeg, .jpg, .pdf"*/}
            {/*        multiple*/}
            {/*        type="file"*/}
            {/*        onChange={(event) => {filesSelectedHandler(event, user.id, "passport", 3, 5)}}*/}
            {/*    />*/}
            {/*</Button>*/}

            {/*<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ruLocale}>*/}
            {/*    <DatePicker*/}
            {/*        label="Basic example"*/}
            {/*        value={value}*/}
            {/*        onChange={(newValue) => {*/}
            {/*            console.log(newValue);*/}
            {/*            setValue(newValue);*/}
            {/*        }}*/}
            {/*        renderInput={(params) => <TextField {...params} />}*/}
            {/*    />*/}
            {/*</LocalizationProvider>*/}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ruLocale}>
                <DatePicker
                    disableFuture
                    label="Дата рождения"
                    openTo="year"
                    views={['year', 'month', 'day']}
                    // dayOfWeekFormatter={(day) => `${day}.`}
                    value={value}
                    onChange={(newValue) => {
                        console.log(Date.parse(newValue.$d?newValue.$d:""));
                        setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </div>
    );
    // Обработчик закрытия диалогового окна
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Хендлер нажатия на кнопку отправки паспорта родителя на проверку при первом заполнении паспорта
    const onSendParentPassportFirstTime = () => {
        postRequestHandler('/api/v1/reg/request/parent/passport',
            {
                passport: parentPassport,
            })
            .then(response => {

                switch (response.status) {
                    case 200:
                        setOpenDialog(false);
                        break;
                    case 401:
                        console.log("/reg/request/parent/passport Не авторизован.");
                        break;
                    case 400:
                        console.log("/reg/request/parent/passport Что-то не так со структурой запроса или поле паспорта пустое.");
                        break;
                        logout();
                    case 409:
                        console.log("/reg/request/parent/passport Данные отправлены повторно.");
                        showBackendFailAlert();
                        break;
                    default:
                        showBackendFailAlert();
                }
            });
    };

    // Рендер карточек менеджеров
    const ChildrenCards = () => {
        return (managersList && managersList.map((manager) => (
            <Grid item key={`managerGrid${manager.id}`}>
                <Paper elevation={6} style={styles.paperManager}>
                    <Typography sx={{fontSize: 14}} color="text.secondary">
                        ФИО
                    </Typography>
                    <Typography variant="h6" component="div">
                        {manager.second_name !== "" ? manager.second_name : "Не указана"} <br/>
                        {manager.first_name !== "" ? manager.first_name : "Не указано"} <br/>
                        {manager.last_name !== "" ? manager.last_name : "Не указано"}
                    </Typography>
                    <Typography sx={{fontSize: 14}} color="text.secondary">
                        Номер телефона
                    </Typography>
                    <Typography variant="h6" component="div">
                        {manager.phone !== "" ? manager.phone : "Не указан"}
                    </Typography>
                    <Typography sx={{fontSize: 14}} color="text.secondary">
                        Электронная почта
                    </Typography>
                    <Typography variant="h6" component="div">
                        {manager.email}
                    </Typography>
                </Paper>
            </Grid>
        )))
    };

    // Список менеджеров
    const [managersList, setManagersList] = useState(null);
    const [managersListUpdateCounter, setManagersListUpdateCounter] = useState(0);
    const [isManagersListLoading, setIsManagersListLoading] = useState(false);

    // Диалоговое окно регистрации менеджера
    const [openAddManagerDialog, setOpenAddManagerDialog] = useState(false);

    return (
        <Box>
            <AppBar>
                <Toolbar>
                    <Typography variant="body1" component="div" sx={{flexGrow: 1}}>
                        Личный кабинет родителя
                    </Typography>
                    <ProfileChip/>
                    <Button
                        color="inherit"
                        endIcon={<Logout/>}
                        onClick={onLogoutClick}
                    >
                        Выйти
                    </Button>
                </Toolbar>
            </AppBar>
            <Toolbar/>

            <ParentPassportSection/>

            <Typography variant="h5" mt={2} mb={2}>
                Ученики
            </Typography>

            {/*Кабинет родителя карточки*/}
            <Grid container spacing={2} justifyContent="flex-start">
                <ChildrenCards/>

                {/*Кабинет родителя карточки добавить ученика стандартная карточка*/}
                <Grid item key={`childGridBase`}>
                    <Paper elevation={6} style={styles.paperChildBase}>
                        {isChildrenListLoading ?
                            <PulseLoader speedMultiplier={2} color={blue[500]} size={10}/> :
                            <Button
                                onClick={openAddChildDialog}
                            >
                                Добавить ученика
                            </Button>}
                    </Paper>
                </Grid>
            </Grid>

            {/*Диалог*/}
            <Dialog maxWidth={'xs'} open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>

                <DialogContent>
                    {/*Родитель паспорт этапы отправить диалог контент вызов*/}
                    {dialogContentType === "parentPassportFirstAdd" && ParentPassportFirstAddDialogContent}
                    {dialogContentType === "childFirstStageFirstAdd" && ChildFirstStageFirstAddDialogContent}

                </DialogContent>

                <DialogActions>
                    {/*Родитель паспорт этапы отправить диалог действия вызов*/}
                    {
                        dialogContentType === "parentPassportFirstAdd" ?
                            <Button color={'success'} onClick={onSendParentPassportFirstTime}>Отправить</Button> :
                            <div></div>
                    }
                    {/*<Button color={'success'} onClick={handleCloseDialog}>Отправить</Button>*/}
                    <Button color={'error'} onClick={handleCloseDialog}>Отмена</Button>
                </DialogActions>
            </Dialog>
            {/*{type !== "" ? <iframe src="https://docs.google.com/gview?url=`data:${type};base64,${png}`&embedded=true"/>: ''}*/}

            {/*{type === "" ? <iframe src={`/pdf.js/web/viewer.html?file=${png}`}/>: ''}*/}
        </Box>
    );
};

export default LkParent;