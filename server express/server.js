// подключение express
const express = require("express");
// создаем объект приложения
const app = express();
app.use(express.static(__dirname + "/public"));
// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
     
    // отправляем ответ
    response.send("<h2>Привет Express!<br/><img src=\"android-chrome-192x192.png\"></h2>");
});
app.get("/about", function(request, response){
     
  response.send("<h1>О сайте</h1>");
});

app.get("/api/test", function(request, response){
     
  response.json({ a: 1 });
});
const port = process.env.PORT || '3000';
app.listen(port);