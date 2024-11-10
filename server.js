
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Главная страница
app.get('/', (req, res) => {
    res.send('Сервер работает стабильно!');
});

// Маршрут для отключения сервера
app.get('/shutdown', (req, res) => {
    // Здесь можно добавить проверку прав доступа перед выполнением shutdown
    console.log('Сервер будет остановлен...');
    res.send('Остановка сервера...'); 
    setTimeout(() => { // Задержка перед завершением процесса
        process.exit(); 
    }, 1000); // Остановить сервер через 1 секунду после запроса
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
