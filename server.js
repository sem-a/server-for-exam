const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Пример данных пользователя
const userData = {
    login: 'root',
    name: 'admin',
    createdAt: new Date().toISOString(),
    pass: 'password'
};

// Главная страница
app.get('/', (req, res) => {
    res.send('Сервер работает стабильно!');
});

// Маршрут для отключения сервера с проверкой логина и пароля
app.get('/api/shutdown', (req, res) => {
    const { login, password } = req.query;

    if (login === userData.login && password === userData.password) {
        console.log('Сервер будет остановлен...');
        res.send('Остановка сервера...');
        setTimeout(() => { 
            process.exit(); 
        }, 1000); // Остановить сервер через 1 секунду после запроса
    } else {
        res.status(401).send('Неверный логин или пароль.');
    }
});

// Новый маршрут для получения данных пользователя
app.get('/api/user', (req, res) => {
   const responseMessage = `Логин: ${userData.login}, Имя: Анастасия`;
   res.send(responseMessage);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
});
