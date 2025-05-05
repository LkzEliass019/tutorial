const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3");
const app = express(); // Armazena as chamadas e propriedades da biblioteca EXPRESS

const PORT = 8000;

app.use('/static', express.static(__dirname + '/static'));

app.set('view engine', 'ejs');

app.get ("/", (req, res) => {
    console.log("GET /index");
    // res.send("Alô SESI Sumaré<br>Bem-vindos ao SENAI Sumaré.");
    //res.send("<img src='./static/image.jpg' width='30%'/>" );
    //res.render("./pages/index" );
})

app.get ("/sobre", (req, res) => {
    console.log("pages/sobre");
   //res.render("./pages/sobre");
})

app.get ("/cadastro", (req, res) => {
    console.log("pages/cadastro");
    //res.render("./pages/cadastro");
})

app.get ("/login", (req, res) => {
    console.log("pages/login");
    //res.render("./pages/login");

})

app.get ("/dashboard", (req, res) => {
    console.log("pages/dashboard");
    //res.render("./pages/dashboard");
})

app.listen(PORT, () =>{
    console.log(`Servidor sendo executado na porta ${PORT}`);
    //console.log(__dirname + "\\static");
});
