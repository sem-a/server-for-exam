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
    const { login, pass } = req.query;

    if (login === userData.login && pass === userData.password) {
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
   const responseMessage = `Логин: ${userData.login}\nИмя: admin\nДата запроса: ${userData.createdAt}`;
   res.send(responseMessage);
});

app.get('/api/docs', (req, res) => {
    const documentation = `
        <h1>Документация к API сервера на Express.js</h1>
        <h2>Общая информация</h2>
        <p>Данный сервер предоставляет два основных маршрута: для получения данных пользователя и для отключения сервера. Сервер работает на Node.js с использованием фреймворка Express.</p>

        <h2>Базовый URL</h2>
        <p><code>http://<ваш_домен>:<PORT></code></p>
        <p>Где <ваш_домен> — это доменное имя или IP-адрес вашего сервера, а <PORT> — порт, на котором запущен сервер (по умолчанию 3000).</p>

        <h2>Маршруты API</h2>

        <h3>1. Главная страница</h3>
            - URL: /<br/>
            - Метод: GET<br/>
            - Описание: Возвращает сообщение о том, что сервер работает стабильно.<br/>

            Пример запроса:<br/>
            GET http://<ваш_домен>:<PORT>/<br/>

            Ответ:<br/>
            Сервер работает стабильно!<br/><hr/>

        


       <h3>2. Отключение сервера</h3>
           - URL: /api/shutdown<br/>
           - Метод: GET<br/>
           - Параметры запроса:<ul><li><strong>login </strong>(string): Логин администратора.</li><li><strong>Password </strong>(string): Пароль администратора.</li></ul>

          Описание:
          Этот маршрут позволяет остановить работу сервера при условии правильного ввода логина и пароля.

          Пример запроса:
          GET http://<ваш_домен>>/api/shutdown?login=root&pass=password

          
         
         Успешный ответ (200 OK):
         Остановка сервера...<br/> 

   Ошибка авторизации (401 Unauthorized):
   Если введены неверные учетные данные:
   
    Неверный логин или пароль.
    
    



      <h3>3. Получение данных пользователя </h3><br/>
            URL : / api/user <br/>
              Метод : GET <br/>
               
                Описание :
                 Возвращает информацию о пользователе в виде строки .<br/>

                  Пример запроса :
                   http://<ваш_домен>>/api/user
                     Пример ответа будет выглядеть следующим образом :

                      Логин : root , Имя : Анастасия ,
                       Дата создания :   текущая дата в формате ISO  <br/>
                       
                      
                     
     `;
    
    res.send(documentation);
});

// Маршрут для скачивания текстового файла
app.get('/api/download', (req, res) => {
   const filePath = path.join(__dirname,'example.txt'); // Путь к файлу
   
   // Отправляем файл пользователю при запросе по этому маршруту.
   return res.download(filePath , err =>{
       if(err){
           console.error("Ошибка при отправке файла:", err);
           returnres.status(500).send("Не удалось скачать файл.");
       }
   });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
});
