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

app.post("/api/users", async(req, res)=> {
          
    if(!req.body) return res.sendStatus(400);
          
    const userName = req.body.name;
    const userAge = req.body.age;
    const user = {id: crypto.randomUUID(), name: userName, age: userAge};
          
    users.push(user);
    res.send(user);
});


const port = process.env.PORT || '3000';
app.listen(port);