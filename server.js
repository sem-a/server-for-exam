const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

// Пример данных пользователя
const userData = {
    login: 'root',
    name: 'admin',
    createdAt: new Date().toISOString(),
    pass: 'mega-slozhniy-parol'
};
app.use((req, res, next) => {
    console.log(`Запрос ${req.method} к ${req.url}`);
    next(); // Передаем управление следующему обработчику
});
// Главная страница
app.get('/', (req, res) => {
    res.send('Сервер работает стабильно!');
});

// Маршрут для отключения сервера с проверкой логина и пароля
app.get('/api/shutdown', (req, res) => {
    const { login, pass, student } = req.query;

    if (login === userData.login && pass === userData.pass) {
        console.log('Сервер будет остановлен...');
        
        // Запись сообщения о выполнении операции в текстовый файл
        const logMessage = `Остановка сервера... Выполнена студентом ${student} \n`;
        fs.appendFile(path.join(__dirname, 'shutdown_log.txt'), logMessage, err => {
            if(err){
                console.error("Ошибка при записи файла:", err);
            }
        });

        res.send(`Остановка сервера... Выполнена студентом ${student}`);
        
        setTimeout(() => { 
            process.exit(); 
        }, 1000); // Остановить сервер через 1 секунду после запроса

    } else {
        res.status(401).send('Неверный логин или пароль.');
    }
});

app.get('/api/log', (req,res)=>{
   const filePath=path.join(__dirname,'shutdown_log.txt');

   fs.readFile(filePath,'utf8',(err,data)=>{
      if(err){
          console.error("Ошибка при чтении файла:",err);
          return res.status(500).send("Не удалось прочитать файл.");
      }

      // Отправляем данные пользователю по строкам разделяя их тегами <br/>
      let lines=data.split('\n').map(line=> `<p>${line}</p>`).join('');
      
      // Форматируем ответ HTML-страницей  
      let htmlResponse=`<html><body><h1>Логи остановок сервера:</h1>${lines}</body></html>`;
      
      return res.send(htmlResponse);    
     });
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
        <p><code>http://<ваш_домен></code></p>
        <p>Где <ваш_домен> — это доменное имя или IP-адрес вашего сервера а именно sem-a-server-for-exam-2da0.twc1.net,</p>

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
           - Параметры запроса:<ul><li><strong>login </strong>(string): Логин администратора.</li><li><strong>Password </strong>(string): Пароль администратора.</li><li><strong>student </strong>(string): имя студента.</li></ul>

          Описание:
          Этот маршрут позволяет остановить работу сервера при условии правильного ввода логина и пароля.

          Пример запроса:
          GET http://<ваш_домен>>/api/shutdown?login=root&pass=password&student=<ваше_имя>

          
         
         Успешный ответ (200 OK):
         Остановка сервера...<br/> 

   Ошибка авторизации (401 Unauthorized):
   Если введены неверные учетные данные:
   
    Неверный логин или пароль.
    
    



      <h3>3. Получение данных пользователя </h3><br/>
            URL : /api/user <br/>
              Метод : GET <br/>
               
                Описание :
                 Возвращает информацию о пользователе в виде строки .<br/>

                  Пример запроса :
                   http://<ваш_домен>>/api/user
                     Пример ответа будет выглядеть следующим образом :

                      Логин : root , Имя : Анастасия ,
                       Дата создания :   текущая дата в формате ISO  <br/>
                       
        <h3>4. Скачивание пароля пользователя</h3><br/>
         URL : /api/download <br/>
              Метод : GET <br/>
               
                Описание :
                 Скачивает текстовый файл с паролем.<br/>

                  Пример запроса :
                   http://<ваш_домен>>/api/download <br/>
                     
     `;
    
    res.send(documentation);
});

// Маршрут для скачивания текстового файла
app.get('/api/download', (req, res) => {
   const filePath = path.join(__dirname,'pass.txt'); // Путь к файлу
   
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
