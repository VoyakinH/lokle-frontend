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
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    FormHelperText,
    DialogActions,
    Dialog,
    Grid,
    Stack,
    Divider
} from '@mui/material';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
import 'dayjs/locale/ru';
import dayjs from 'dayjs';

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
    const [parentNeedUpdate, setParentNeedUpdate] = useState(true);
    // Заявка на прикрепление паспорта родителя
    const [parentPassportRequest, setParentPassportRequest] = useState({});

    // Список детей родителя
    const [children, setChildren] = useState(null);
    const [childrenNeedUpdate, setChildrenNeedUpdate] = useState(true);
    const [childrenIsLoading, setChildrenIsLoading] = useState(true);

    // Диалоговое окно
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogContentType, setDialogContentType] = useState("");
    const [isDialogSendLoading, setIsDialogSendLoading] = useState(false);

    // Прикреплённые документы
    const [selectedFiles, setSelectedFiles] = useState("");
    // Кол-во прикреплённых документов
    const [filesCount, setFilesCount] = useState({});


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

    // Получение данных родителя
    useEffect(() => {
        getRequestHandler('/api/v1/user/parent').then(response => {
            switch (response.status) {
                case 200:
                    setParent(response.data);
                    break;
                case 401:
                    console.log("/user/parent 401")
                    logout();
                    break;
                default:
                    showBackendFailAlert();
            }
        });
    }, [parentNeedUpdate])

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
                        showBackendFailAlert();

                }
            });
        }
    }, [parent])

    // Получение списка детей родителя при изменении childrenUpdateCounter
    useEffect(() => {
        setChildrenIsLoading(true);
        getRequestHandler('/api/v1/user/parent/children').then(response => {
            switch (response.status) {
                case 200:
                    setChildren(response.data);
                    break;
                case 401:
                    console.log("/user/parent/children 401");
                    logout();
                    break;
                default:
                    showBackendFailAlert();
            }
        });
        setChildrenIsLoading(false);
    }, [childrenNeedUpdate])

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
                    case 200:
                        console.log("/file/delete 200.");
                        successful = true;
                        break;
                    case 400:
                        console.log("/file/delete 400.");
                        successful = true;
                        break;
                    case 401:
                        console.log("/file/delete 401.");
                        logout();
                        break;
                    case 403:
                        // ?????
                        console.log("/file/delete 403.");
                        showBackendFailAlert();
                        break;
                    case 404:
                        // ?????
                        console.log("/file/delete 404.");
                        showBackendFailAlert();
                        break;
                    default:
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
                        console.log("/file/upload 200.");
                        setFilesCount({...filesCount, [fileBaseName]: ++filesCount[fileBaseName]});
                        break;
                    case 401:
                        console.log("/file/upload 401.");
                        logout();
                        break;
                    case 400:
                        console.log("/file/upload 400.");
                        showBackendFailAlert()
                        break;
                    default:
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
                });
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

    // Обработчик нажатия на кнопку первого добавления паспорта родителя
    const openAddParentPassportDialog = () => {
        filesDelete(user.id, "passport")
            .then(r => {
                if (r) {
                    setParentPassport("");
                    setParentPassportValidated(true);

                    setDialogTitle("Добавление паспорта родителя");
                    setDialogContentType("parentPassportFirstAdd");
                    setOpenDialog(true);
                }
            });
    };

    // Виджет информации о паспорте родителя
    // Данные паспорта родителя
    const [parentPassport, setParentPassport] = useState("");
    const [parentPassportValidated, setParentPassportValidated] = useState(true);
    const [parentPassportHelpText, setParentPassportHelpText] = useState("");

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

    const FileAddComponent = (userID, fileBaseName, maxFilesCount, maxFileSize) => {
        return (
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                justifyContent="space-around"
                alignItems="center"
            >
                <IconButton
                    sx={{
                        borderRadius: 2,
                        backgroundColor: 'rgba(50, 200, 70, 0.3)'
                    }}
                    color='success'
                    component="label"
                >
                    <input
                        hidden
                        accept=".png, .jpeg, .jpg, .pdf"
                        multiple
                        type="file"
                        onChange={(event) => {
                            filesSelectedHandler(event, userID, fileBaseName, maxFilesCount, maxFileSize);
                        }}
                    />
                    <AddIcon fontSize="inherit" />
                </IconButton>

                <Stack
                    direction="column"
                    alignItems="center"
                >
                    <Typography variant="caption">
                        ПРИКРЕПЛЕНО
                    </Typography>
                    <Typography variant="button">
                        {filesCount[fileBaseName]}
                    </Typography>
                </Stack>

                <IconButton
                    sx={{
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 20, 20, 0.3)'
                    }}
                    color='error'
                    onClick={() => {
                        filesDelete(user.id, fileBaseName);
                    }}
                >
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </Stack>
        )
    }

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
                helperText={parentPassportValidated? " ": parentPassportHelpText}
            />

            {FileAddComponent(user.id, "passport", 3, 5)}
        </div>
    );

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
                        setParentNeedUpdate(!parentNeedUpdate);
                        break;
                    case 401:
                        console.log("/reg/request/parent/passport 401");
                        break;
                    case 400:
                        console.log("/reg/request/parent/passport 400");
                        logout();
                        break;
                    case 409:
                        console.log("/reg/request/parent/passport 409");
                        showBackendFailAlert();
                        break;
                    default:
                        showBackendFailAlert();
                }
            });
    };

    // Кнопка отправки на диалоговом окне
    const ParentPassportFirstAddDialogSubmitButton = (
        <Button
            color={'success'}
            onClick={onSendParentPassportFirstTime}
            disabled={parentPassport==="" || !parentPassportValidated || filesCount["passport"] === 0}
        >
            Отправить
        </Button>
    );

    // Обработчик открытия диалогового окна регистрации менеджеров
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
    const [childFirstNameValidated, setChildFirstNameValidated] = useState(true);
    const [childFirstNameHelpText, setChildFirstNameHelpText] = useState("");

    const [childSecondName, setChildSecondName] = useState("");
    const [childSecondNameValidated, setChildSecondNameValidated] = useState(true);
    const [childSecondNameHelpText, setChildSecondNameHelpText] = useState("");

    const [childLastName, setChildLastName] = useState("");
    const [childLastNameValidated, setChildLastNameValidated] = useState(true);
    const [childLastNameHelpText, setChildLastNameHelpText] = useState("");

    const [childEmail, setChildEmail] = useState("");
    const [childEmailValidated, setChildEmailValidated] = useState(true);
    const [childEmailHelpText, setChildEmailHelpText] = useState("");

    const [childPhone, setChildPhone] = useState("");
    const [childPhoneValidated, setChildPhoneValidated] = useState(true);
    const [childPhoneHelpText, setChildPhoneHelpText] = useState("");

    const [childBirthDate, setChildBirthDate] = useState(null);
    const [childBirthDateValidated, setChildBirthDateValidated] = useState(true);
    const [childBirthDateHelpText, setChildBirthDateHelpText] = useState("");

    const handleChildFirstNameChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setChildFirstName(val);
        setChildFirstNameValidated(false);
        if (len < 1) {
            setChildFirstNameHelpText("Укажите имя.");
        } else if (len > 32) {
            setChildFirstNameHelpText("Имя не может превышать 32 символа.");
        } else if (/\d/.test(val)) {
            setChildFirstNameHelpText("Имя не может содержать цифры.");
        } else if (val[len - 1] === ' ') {
            setChildFirstNameHelpText("В конце имени не может быть пробелов.");
        } else if (val[0] === ' ') {
            setChildFirstNameHelpText("В начале имени не может быть пробелов.");
        } else {
            setChildFirstNameValidated(true);
        }
    };

    const handleChildSecondNameChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setChildSecondName(val);
        setChildSecondNameValidated(false);
        if (len < 1) {
            setChildSecondNameHelpText("Укажите фамилию.");
        } else if (len > 32) {
            setChildSecondNameHelpText("Фамилия не может превышать 32 символа.");
        } else if (/\d/.test(val)) {
            setChildSecondNameHelpText("Фамилия не может содержать цифры.");
        } else if (val[len - 1] === ' ') {
            setChildSecondNameHelpText("В конце фамилии не может быть пробелов.");
        } else if (val[0] === ' ') {
            setChildSecondNameHelpText("В начале фамилии не может быть пробелов.");
        } else {
            setChildSecondNameValidated(true);
        }
    };

    const handleChildLastNameChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setChildLastName(val);
        setChildLastNameValidated(false);
        if (len > 32) {
            setChildLastNameHelpText("Отчество не может превышать 32 символа.");
        } else if (/\d/.test(val)) {
            setChildLastNameHelpText("Отчество не может содержать цифры.");
        } else if (val[len - 1] === ' ') {
            setChildLastNameHelpText("В конце отчества не может быть пробелов.");
        } else if (val[0] === ' ') {
            setChildLastNameHelpText("В начале отчества не может быть пробелов.");
        } else {
            setChildLastNameValidated(true);
        }
    };

    const handleChildEmailChanged = (e) => {
        const val = e.target.value;
        const len = val.length;
        setChildEmail(val);
        setChildEmailValidated(false);
        if (val[len - 1] === ' ') {
            setChildEmailHelpText("В конце почты не может быть пробелов.");
        } else if (val[0] === ' ') {
            setChildEmailHelpText("В начале почты не может быть пробелов.");
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) {
            setChildEmailHelpText("Электронная почта некорректна.");
        }
        else {
            setChildEmailValidated(true);
        }
    };

    const handleChildPhoneChanged = (e) => {
        const val = e.target.value.replace(/\D/g,"");
        const len = val.length;
        setChildPhone(val);
        setChildPhoneValidated(true);
        if (len !==0 && (len < 10 || len > 16)) {
            setChildPhoneHelpText("Неверный формат. Пример: 79151234567");
            setChildPhoneValidated(false);
        }
    };

    // Содержимое диалогового окна для первичного выполнения первой стадии регистрации ученика
    const ChildFirstStageFirstAddDialogContent = (
        <div>

            {!parent.passport_verified &&
            <Typography variant="subtitle1">
                Для регистрации ребёнка, который ещё не учился в нашей школе необходимо подтвердить Ваш паспорт. Для этого следуйте инструкциям на главном экране личного кабинета.
            </Typography>}

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
                variant="standard"
                label='Имя'
                fullWidth
                required
                value={childFirstName}
                onChange={handleChildFirstNameChanged}
                error={!childFirstNameValidated}
                helperText={childFirstNameValidated?" ":childFirstNameHelpText}
            />
            <TextField
                variant="standard"
                label='Фамилия'
                fullWidth
                required
                value={childSecondName}
                onChange={handleChildSecondNameChanged}
                error={!childSecondNameValidated}
                helperText={childSecondNameValidated?" ":childSecondNameHelpText}
            />
            <TextField
                variant="standard"
                label='Отчество'
                fullWidth
                value={childLastName}
                onChange={handleChildLastNameChanged}
                error={!childLastNameValidated}
                helperText={childLastNameValidated?" ":childLastNameHelpText}
            />
            <TextField
                variant="standard"
                type='email'
                label='Электронная почта'
                fullWidth
                required
                value={childEmail}
                onChange={handleChildEmailChanged}
                error={!childEmailValidated}
                helperText={childEmailValidated?" ":childEmailHelpText}
            />
            <TextField
                sx={{marginBottom:'10px'}}
                variant="standard"
                label='Номер телефона'
                fullWidth
                value={childPhone}
                onChange={handleChildPhoneChanged}
                error={!childPhoneValidated}
                helperText={childPhoneValidated?" ":childPhoneHelpText}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
                <DatePicker
                    disableFuture
                    label="Дата рождения"
                    openTo="year"
                    views={['year', 'month', 'day']}
                    value={childBirthDate}
                    onChange={(val) => {
                        setChildBirthDate(val);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </div>
    );

    // Хендлер нажатия на кнопку отправки данных ребёнка на проверку при первом заполнении данных ребёнка
    const onSendChildSignUpFirstStageFirstTime = () => {
        postRequestHandler('/api/v1/reg/request/child/stage/first',
            {
                child: {
                    first_name: childFirstName,
                    second_name: childSecondName,
                    last_name: childLastName,
                    email: childEmail,
                    phone: childPhone,
                    birth_date: Date.parse(childBirthDate? childBirthDate.$d: "") / 1000
                },
                is_student: childAlreadyInSchool
            })
            .then(response => {
                switch (response.status) {
                    case 200:
                        setOpenDialog(false);
                        setChildFirstName("");
                        setChildSecondName("");
                        setChildLastName("");
                        setChildEmail("");
                        setChildPhone("");
                        setChildBirthDate(null);
                        setChildAlreadyInSchool(true);

                        setChildrenNeedUpdate(!childrenNeedUpdate);
                        setAlertType("success");
                        setAlertMessage("Заявка на регистрацию ребёнка отправлена.");
                        setOpenAlert(true);
                        break;
                    case 400:
                        console.log("/reg/request/child/stage/first 400");
                        setAlertType('info');
                        setAlertMessage("Для добавления ученика, который ещё не учился в нашей школе, необходимо подтвердить Ваш паспорт.");
                        setOpenAlert(true);
                        break;
                    case 401:
                        console.log("/reg/request/child/stage/first 401");
                        logout();
                        break;
                    case 409:
                        console.log("/reg/request/child/stage/first 409");
                        setChildEmailValidated(false);
                        setChildEmailHelpText("Введённая почта уже занята.");
                        setAlertType("info");
                        setAlertMessage("Введённая почта уже занята.");
                        setOpenAlert(true);
                        break;
                    default:
                        showBackendFailAlert();
                }
            });
    };

    // Кнопка отправки на диалоговом окне
    const ChildFirstStageFirstAddDialogSubmitButton = (
        <Button
            color={'success'}
            onClick={onSendChildSignUpFirstStageFirstTime}
            disabled={!childFirstNameValidated || !childSecondNameValidated || !childLastNameValidated ||
                !childEmailValidated || !childPhoneValidated || childFirstName==="" || childSecondName===""
                || childEmail==="" || childBirthDate === null || isNaN(childBirthDate.$y)}
        >
            Отправить
        </Button>
    );

    // Обработчик закрытия диалогового окна
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Рендер карточек детей
    const ChildrenCards = () => {
        return (children && children.map((childItem) => (
            <Grid item key={`childGrid${childItem.child.id}`}>
                <Paper elevation={6} style={styles.paperChild}>
                    <Typography sx={{fontSize: 14}} color="text.secondary">
                        ФИО
                    </Typography>
                    <Typography variant="h6" component="div">
                        {childItem.child.second_name !== "" ? childItem.child.second_name : "Не указана"} <br/>
                        {childItem.child.first_name !== "" ? childItem.child.first_name : "Не указано"} <br/>
                        {childItem.child.last_name !== "" ? childItem.child.last_name : "Не указано"}
                    </Typography>
                    {/*<Typography sx={{fontSize: 14}} color="text.secondary">*/}
                    {/*    Номер телефона*/}
                    {/*</Typography>*/}
                    {/*<Typography variant="h6" component="div">*/}
                    {/*    {manager.phone !== "" ? manager.phone : "Не указан"}*/}
                    {/*</Typography>*/}
                    <Typography sx={{fontSize: 14}} color="text.secondary">
                        Электронная почта
                    </Typography>
                    <Typography variant="h6" component="div">
                        {childItem.child.email}
                    </Typography>
                </Paper>
            </Grid>
        )))
    };

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
                        {childrenIsLoading ?
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
                    {dialogContentType === "parentPassportFirstAdd" && ParentPassportFirstAddDialogContent}
                    {dialogContentType === "childFirstStageFirstAdd" && ChildFirstStageFirstAddDialogContent}

                </DialogContent>

                <DialogActions>
                    {dialogContentType === "parentPassportFirstAdd" && ParentPassportFirstAddDialogSubmitButton}
                    {dialogContentType === "childFirstStageFirstAdd" && ChildFirstStageFirstAddDialogSubmitButton}

                    <Button color={'error'} onClick={handleCloseDialog}>Отмена</Button>
                </DialogActions>
            </Dialog>
            {/*{type !== "" ? <iframe src="https://docs.google.com/gview?url=`data:${type};base64,${png}`&embedded=true"/>: ''}*/}

            {/*{type === "" ? <iframe src={`/pdf.js/web/viewer.html?file=${png}`}/>: ''}*/}
        </Box>
    );
};

export default LkParent;