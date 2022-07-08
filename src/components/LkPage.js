import React from "react";
import { Button, Paper, Tab, AppBar, Toolbar, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Navigate } from "react-router-dom";
import { getRequestHandler } from "./Requests";

import Cookies from 'js-cookie'

const LkPage = (props) => {

    const styles = {
        paperStyle: {
            padding :20,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -65,
            marginLeft: -160,
            width: 280,
            height: 90
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

    const [budgetIndex, setBudgetIndex] = React.useState('0');
    const [childIndex, setChildIndex] = React.useState('0');

    const onLogOutClick = () => {
        getRequestHandler('/logout').then(response => {
            if (response.status === 200 || response.status === 401) {
                props.setIsAuthorized(false);
            }
        })
    }

    const arrBudgetTabs = Cookies.get('email') === "kyrov"?["Куров Андрей", "Волкова Лилия"]:["Тассов Кирилл", "Рудаков Игорь", "Кострицкий Александр"];
    const arrBudgetPanels = Cookies.get('email') === "kyrov"?[[60, "28.06.2022"], [45, "20.06.2022"]]:[[120, "29.06.2022"], [240, "10.06.2022"], [0, "01.05.2022"]];
    const arrChildTabs = Cookies.get('email') === "kyrov"?[["Куров Андрей", "Власов Павел"], ["Волкова Лилия"]]:[["Тассов Кирилл", "Рязанова Наталья", "Строганов Юрий"], ["Рудаков Игорь"], ["Кострицкий Александр", "Садулаева Теона"]];

    const rows = [{
                    date: '27.05.2021',
                    weekday: 'Суббота',
                    time: '10:00',
                    teacher: 'Мартынюк',
                    duration: '30',
                    status: 'Отменён со стороны учителя',
                    note: 'Опоздал'
                },{
                    date: '23.05.2021',
                    weekday: 'Суббота',
                    time: '10:00',
                    teacher: 'Власова',
                    duration: '30',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '30.05.2021',
                    weekday: 'Вторник',
                    time: '12:30',
                    teacher: 'Серёгина',
                    duration: '15',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '27.07.2021',
                    weekday: 'Четверг',
                    time: '10:00',
                    teacher: 'Забелин',
                    duration: '60',
                    status: 'Отменён со стороны студента',
                    note: ''
                },{
                    date: '23.05.2021',
                    weekday: 'Суббота',
                    time: '10:00',
                    teacher: 'Власова',
                    duration: '30',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '28.05.2021',
                    weekday: 'Суббота',
                    time: '19:30',
                    teacher: 'Серёгина',
                    duration: '30',
                    status: 'Отменён со стороны студента',
                    note: 'Родителей в школу'
                },{
                    date: '17.04.2021',
                    weekday: 'Вторник',
                    time: '10:00',
                    teacher: 'Мартынюк',
                    duration: '45',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '27.03.2021',
                    weekday: 'Четверг',
                    time: '09:00',
                    teacher: 'Забелин',
                    duration: '30',
                    status: 'Отменён со стороны студента',
                    note: ''
                },{
                    date: '23.05.2021',
                    weekday: 'Суббота',
                    time: '10:00',
                    teacher: 'Власова',
                    duration: '30',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '30.05.2021',
                    weekday: 'Вторник',
                    time: '12:30',
                    teacher: 'Серёгина',
                    duration: '15',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '16.05.2020',
                    weekday: 'Суббота',
                    time: '12:30',
                    teacher: 'Забелин',
                    duration: '45',
                    status: 'Отменён со стороны учителя',
                    note: ''
                },{
                    date: '18.05.2021',
                    weekday: 'Четверг',
                    time: '10:00',
                    teacher: 'Прохорова',
                    duration: '30',
                    status: 'Состоялся',
                    note: 'На больничном'
                },{
                    date: '19.05.2021',
                    weekday: 'Пятница',
                    time: '12:30',
                    teacher: 'Мартынюк',
                    duration: '60',
                    status: 'Отменён со стороны студента',
                    note: ''
                },{
                    date: '23.05.2021',
                    weekday: 'Суббота',
                    time: '10:00',
                    teacher: 'Власова',
                    duration: '30',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '30.05.2021',
                    weekday: 'Вторник',
                    time: '12:30',
                    teacher: 'Серёгина',
                    duration: '15',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '30.05.2021',
                    weekday: 'Четверг',
                    time: '14:50',
                    teacher: 'Прохорова',
                    duration: '45',
                    status: 'Отменён со стороны учителя',
                    note: ''
                },{
                    date: '01.04.2021',
                    weekday: 'Суббота',
                    time: '12:30',
                    teacher: 'Власова',
                    duration: '45',
                    status: 'Отменён со стороны студента',
                    note: 'Опоздал'
                },{
                    date: '30.05.2021',
                    weekday: 'Вторник',
                    time: '12:30',
                    teacher: 'Серёгина',
                    duration: '15',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '23.05.2021',
                    weekday: 'Суббота',
                    time: '10:00',
                    teacher: 'Власова',
                    duration: '30',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '30.05.2021',
                    weekday: 'Вторник',
                    time: '12:30',
                    teacher: 'Серёгина',
                    duration: '15',
                    status: 'Состоялся',
                    note: ''
                },{
                    date: '28.05.2021',
                    weekday: 'Суббота',
                    time: '10:00',
                    teacher: 'Мартынюк',
                    duration: '45',
                    status: 'Отменён со стороны учителя',
                    note: ''
                }];

    const budgetTabs = arrBudgetTabs.map((elem, index) => {
        return (
            <Tab
                label={elem}
                value={String(index)}
                disableRipple
                key={'budgetTab ' + String(index)}
            />
        );
    })

    const childTabs = arrChildTabs[budgetIndex].map((elem, index) => {
        return (
            <Tab
                label={elem}
                value={String(index)}
                disableRipple
                key={'childTab ' + String(index)}
            />
        );
    })

    const childPanels = arrChildTabs.map((elem, index) => {
        return (
            <TabPanel
                value={String(index)}
                style={styles.tabPanelChild}
                key={'childPanel ' + String(index)}
            >
                <TableContainer sx={{height: '100%'}}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Дата<br/>Date</TableCell>
                                <TableCell align="center">День недели<br/>Day of the week</TableCell>
                                <TableCell align="center">Время<br/>Time</TableCell>
                                <TableCell align="center">Учитель<br/>Teacher</TableCell>
                                <TableCell align="center">Длительность<br/>Duration</TableCell>
                                <TableCell align="center">Статус<br/>Status</TableCell>
                                <TableCell align="center">Примечание<br/>Note</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow
                                    key={'Table '+String(index)}
                                >
                                    <TableCell align="center">{row.date}</TableCell>
                                    <TableCell align="center">{row.weekday}</TableCell>
                                    <TableCell align="center">{row.time}</TableCell>
                                    <TableCell align="center">{row.teacher}</TableCell>
                                    <TableCell align="center">{row.duration}</TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">{row.note}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
        );
    })

    const budgetPanels = arrBudgetPanels.map((elem, index) => {
        return (
            <TabPanel
                value={String(index)}
                style={styles.tabPanelBudget}
                key={'budgetPanel ' + String(index)}
            >
                <Typography variant="body2">
                    {"Баланс: " + String(elem[0]) + " минут.   Дата последней оплаты: " + elem[1]}
                </Typography>
                <Paper elevation={4} style={styles.paperChild}>
                    <TabContext value={ childIndex }>
                        <TabList
                            onChange={(event, newIndex) => setChildIndex(newIndex)}
                            sx={styles.tabList}
                            variant="fullWidth"
                            centered
                        >
                            { childTabs }
                        </TabList>
                        { childPanels }
                    </TabContext>
                </Paper>
            </TabPanel>
        );
    })

    return (
        props.isAuthorized?
            Cookies.get('email') === "admin"?
                <div>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Личный кабинет администратора
                            </Typography>
                            <Button
                                color="inherit"
                                endIcon={<Logout />}
                                onClick={onLogOutClick}
                            >
                                Выйти
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Paper elevation={24} style={styles.paperStyle}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Импорт XLSX в базу данных
                        </Typography>
                        <Button
                            sx={{marginTop:'20px'}}
                            color="inherit"
                            variant="outlined"
                        >
                            Выбор файла
                        </Button>
                        <Button
                            sx={{marginLeft:'15px', marginTop:'20px'}}
                            color="inherit"
                            variant="outlined"
                        >
                            Загрузить
                        </Button>
                    </Paper>
                </div>:
                <div>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Личный кабинет
                            </Typography>
                            <Button
                                color="inherit"
                                endIcon={<Logout />}
                                onClick={onLogOutClick}
                            >
                                Выйти
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Paper
                         elevation={8}
                         style={styles.paperBudget}
                    >
                        <TabContext
                            value={ budgetIndex }
                        >
                            <TabList
                                onChange={(event, newIndex) => {
                                    setBudgetIndex(newIndex)
                                    setChildIndex('0')
                                }}
                                sx={styles.tabList}
                                variant="fullWidth"
                                centered
                            >
                                { budgetTabs }
                            </TabList>
                            { budgetPanels }
                        </TabContext>
                    </Paper>
                </div>:
                <Navigate to="/auth" />
    );
};

export default LkPage;