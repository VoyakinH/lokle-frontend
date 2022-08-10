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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box } from '@mui/material';
import { Logout, AccountCircle, VisibilityOff, Visibility } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useNavigate } from "react-router-dom";
import { deleteRequestHandler, getRequestHandler, postRequestHandler } from "./Requests";
import { UserDefault, ParentDefault } from "./Structs_default";
import { blue, yellow } from '@mui/material/colors';
import { PulseLoader } from "react-spinners";
import DocViewer from "react-doc-viewer";

const styles = {
    paperPassportParent: {
        padding: "15px 15px 15px 15px",
        borderRadius: 15,
        backgroundColor: yellow[300],
    },
    paperChildBase: {
        padding: "103px 10px 103px 10px",
        borderRadius: 15,
        minWidth:290,
        height: 37,
        textAlign: 'center',
    },
    paperChild: {
        padding: 10,
        borderRadius: 15,
        minWidth:290,
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

const LkParent = ({ user, setUser, setOpenAlert, setAlertType, setAlertMessage }) => {
    let navigate = useNavigate();

    // Данные родителя
    const [parent, setParent] = useState(ParentDefault);
    // Заяка на прикрепление паспорта родителя
    const [parentPassportRequest, setParentPassportRequest] = useState(null);

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
    const [selectedFile, setSelectedFile] = useState("");
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

    const [isLoading, setIsLoading] = useState(false);

    const [type, setType] = useState("");
    const [png, setPng] = useState("");

    useEffect(() => {
        postRequestHandler('/api/v1/file/download',
            {
                user_id: 102,
                file_name: "passport"
            })
            .then(response => {
            switch (response.status) {
                case 200:
                    const byteCharacters = atob(response.data.files[0].file);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], {type: response.data.files[0].type});

                    console.log(URL.createObjectURL(blob))

                    // console.log(URL.createObjectURL(blob));
                    // setType(response.data.files[0].type)
                    setPng(URL.createObjectURL(blob))
                    break;
                case 401:
                    // logout();
                    break;
                default:
                    // showBackendFailAlert();
                    console.log("back fail");
            }
        });
    }, [])

    // Получение данных родителя при загрузке страницы
    useEffect(() => {
        getRequestHandler('/api/v1/user/parent').then(response => {
            switch (response.status) {
                case 200:
                    setParent(response.data);
                    break;
                case 401:
                    logout();
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
                        setParentPassportRequest(response.data);
                        break;
                    case 401:
                        logout();
                        break;
                    default:
                        showBackendFailAlert();
                }
            });
        }
    }, [parent])

    // Получение списка детей родителя при изменении childrenUpdateCounter
    useEffect(() => {
        setIsChildrenListLoading(true);
        getRequestHandler('/api/v1/user/parent/children').then(response => {
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
        setParent(ParentDefault);
        setUser(UserDefault);
        navigate("/login", { replace: true });
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
        return <Chip sx={{color: blue[50]}} label={fio} />
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
    const filesDelete = (userId, fileName) => {
        postRequestHandler('/api/v1/file/delete',
            {user_id: userId,
                file_name: fileName})
            .then(response => {
                switch (response.status) {
                    case 200:
                        console.log("Файлы удалены");
                        break;
                    case 400:
                        console.log("Файлов нет");
                        break;
                    case 403:
                        break;
                    case 401:
                        logout();
                        break;
                    default:
                        setAlertType('error');
                        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                        setOpenAlert(true);
                }
            })
    }

    // Выгрузка файлов на сервер
    const fileUpload = (file, userID) => {
        postRequestHandler('/api/v1/file/upload',
            {file: file,
                userID: userID}, true)
            .then(response => {
                switch (response.status) {
                    case 200:
                        console.log("файл загружен")
                        break;
                    case 400:
                        break;
                    case 403:
                        break;
                    case 401:
                        break;
                    default:
                        setAlertType('error');
                        setAlertMessage("Сервис временно недоступен. Попробуйте позднее.");
                        setOpenAlert(true);
                }
            })
    }

    // Были выбраны файлы для прикрепления
    const filesSelectedHandler = (event, userID, fileBaseName, maxFilesCount, maxFilesSize) => {
        const selectedFilesCount = event.target.files.length;
        const selectedFiles = event.target.files;
        const filesCountBaseName = filesCount[fileBaseName]? filesCount[fileBaseName]: 0;

        if (filesCountBaseName + selectedFilesCount <= maxFilesCount) {
            for (let i = 0; i < selectedFilesCount; i++) {
                if (selectedFiles[i].size > maxFilesSize * 1024 * 1024) {
                    console.log(`Размер каждого файла не должен превышать ${maxFilesSize}Mb`);
                    return;
                }
            }

            for (let i = 0; i < selectedFilesCount; i++) {
                const file = new File([selectedFiles[i]],
                    `${fileBaseName}_${filesCountBaseName + i}.${selectedFiles[i].type.split('/')[1]}`,
                    {type: selectedFiles[i].type});
                fileUpload(file, userID);
            }

            setFilesCount({...filesCount, [fileBaseName]: filesCountBaseName + selectedFilesCount});
        }
        else {
            console.log("Максимальное кол-во файлов: 3");
        }
    };

    // Рендер виджета с информацией о паспорте родителя
    const ParentPassportSection = () => {
        // Паспорт не проверен и не прикреплялся
        if (!parent.passport_verified && parent.passport === "") {
            return (
                <Paper elevation={6} style={styles.paperPassportParent} >
                    <Typography variant="body1" mb={1}>
                        Для зачисления ребёнка в ЧУ СОШ «Столичный - КИТ» Вам необходимо подтвердить свои паспортные данные. <br/>
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
            return(<div>паспорт на проверке</div>)
        }
    }

    // Обработчик нажатия на кнопку первого добавления паспорта родителя
    const openAddParentPassportDialog = () => {
        setParentPassport("");
        setParentPassportValidated(true);
        setParentPassportHelpText("");

        // setParentPassportFilesCount(0);

        setDialogTitle("Добавление паспорта родителя");
        setDialogContentType("parentPassportFirstAdd");
        setOpenDialog(true);
    };

    // Обработчик изменения серии номера паспорта родителя
    const handleParentPassportChanged = (e) => {
        const val = e.target.value;
        const val_nums = val.replace(/\D/g,"");
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
                Upload
                <input
                    hidden
                    accept=".png, .jpeg, .jpg, .pdf"
                    multiple
                    type="file"
                    onChange={(event) => {filesSelectedHandler(event, user.id, "passport", 3, 5)}}
                />
            </Button>
        </div>
    );

    // Обработчик открытия диалоговоего окна регистрации менеджеров
    const openAddChildDialog = () => {
        setDialogTitle("Первичная регистрация ученика");
        setDialogContentType("childFirstStageFirstAdd");
        setOpenDialog(true);
    }

    // {
    //     "child": {
    //     "first_name": "testik",
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
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Имя'
                fullWidth
                required
                // onChange={handleFirstNameChanged}
                error={!firstNameValidated}
                helperText={firstNameHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Фамилия'
                fullWidth
                required
                // onChange={handleSecondNameChanged}
                error={!secondNameValidated}
                helperText={secondNameHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Отчество'
                fullWidth
                // onChange={handleLastNameChanged}
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
                // onChange={handleEmailChanged}
                error={!emailValidated}
                helperText={emailHelpText}
            />
            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label='Номер телефона'
                fullWidth
                required
                // onChange={handlePhoneChanged}
                error={!phoneValidated}
                helperText={phoneHelpText}
            />
            {/*<TextField*/}
            {/*    style={styles.textFieldStyle}*/}
            {/*    variant="standard"*/}
            {/*    label='Номер телефона'*/}
            {/*    fullWidth*/}
            {/*    required*/}
            {/*    onChange={handlePhoneChanged}*/}
            {/*    error={!phoneValidated}*/}
            {/*    helperText={phoneHelpText}*/}
            {/*/>*/}

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

            <TextField
                style={styles.textFieldStyle}
                variant="standard"
                label=''
                fullWidth
                required
                // onChange={handlePhoneChanged}
                error={!phoneValidated}
                helperText={phoneHelpText}
            />
        </div>
    );
    // Обработчик закрытия диалогового окна
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

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

            <Typography variant="h5" mt={2} mb={2}>
                Ученики
            </Typography>

            <Grid container spacing={2} justifyContent="flex-start">
                {/*<ManagerCards/>*/}

                <Grid item key={`childGridBase`}>
                    <Paper elevation={6} style={styles.paperChildBase}>
                        {isChildrenListLoading?
                            <PulseLoader speedMultiplier={2} color={blue[500]} size={10} />:
                            <Button
                                onClick={openAddChildDialog}
                            >
                                Добавить ученика
                            </Button>}
                    </Paper>
                </Grid>
            </Grid>

            <Dialog maxWidth={'xs'} open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>

                <DialogContent >
                    {dialogContentType === "parentPassportFirstAdd" && ParentPassportFirstAddDialogContent}
                    {dialogContentType === "childFirstStageFirstAdd" && ChildFirstStageFirstAddDialogContent}

                </DialogContent>

                <DialogActions>
                    {/*<Button*/}
                    {/*    onClick={onManagerRegistrationClick}*/}
                    {/*    color={'success'}*/}
                    {/*    disabled={managerRegistrationDisabled}*/}
                    {/*>*/}
                    {/*    {isDialogSendLoading?*/}
                    {/*        <div> <PulseLoader speedMultiplier={2} color={blue[500]} size={7} /></div>:*/}
                    {/*        "Отправить"}*/}
                    {/*</Button>*/}

                    <Button color={'error'} onClick={handleCloseDialog}>Отмена</Button>
                </DialogActions>
            </Dialog>
            {/*{type !== "" ? <iframe src="https://docs.google.com/gview?url=`data:${type};base64,${png}`&embedded=true"/>: ''}*/}

            {type === "" ? <iframe src={`/pdf.js/web/viewer.html?file=${png}`}/>: ''}
        </Box>
    );
};

export default LkParent;