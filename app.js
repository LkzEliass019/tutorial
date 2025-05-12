const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3");
const app = express(); // Armazena as chamadas e propriedades da biblioteca EXPRESS

const PORT = 8000;

// Conexão com o banco de dados
const db = new sqlite3.Database("users.db");

db.serialize( () => {
    db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
    )
});

app.use(
    session({
        secret: "senhaforte",
        resave: true,
        saveUninitialized: true,
    })
)

app.use('/static', express.static(__dirname + '/static'));

//configuração Express para processar requisões POST com BODY PARAMETERS
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.get ("/", (req, res) => {
    console.log("GET /index");
    // res.send("Alô SESI Sumaré<br>Bem-vindos ao SENAI Sumaré.");
    //res.send("<img src='./static/image.jpg' width='30%'/>" );
    res.render("./pages/index", {titulo: "index"});
})

app.get ("/logout", (req, res) => {
console.log("GET /logout");
req.session.destroy(() => {
    res.redirect("/");

}); 
})

app.get ("/sobre", (req, res) => {
    console.log("GET /sobre");
   res.render("./pages/sobre" , {titulo: "sobre"});
})

app.get ("/cadastro", (req, res) => {
    console.log("GET /cadastro");
    res.render("./pages/cadastro" ,  {titulo: "cadastro"});
})

app.post("/cadastro", (req, res) =>{
    console.log("POST /cadastro")
    console.log(JSON.stringify(req.body));
    const {username, password} = req.body;

    const query = "SELECT * FROM users WHERE username=?"

    db.get(query, [username], (err, row) => {
        if (err) throw err;

           //1. Verificar se o usuário existe
        console.log("Query SELECT do Cadastro:", JSON.stringify(row));
        if(row) {
            //2. Se o usuário existir e a senha é válida no BD, executar processo de login
           console.log(`Usuário: ${username} já cadastrado.`);
           res.send("Usuário já Cadastrado");
        } else {
            //3. Se não, executar processo de negação de login
            const insert = "INSERT INTO users (username, password) VALUES (?,?)"
            db.get(insert, [username, password], (err, row) => {
                if(err) throw err;

                console.log(`Usuário: ${username} cadastrado com sucesso.`);
                res.redirect("/login");
            })
        }

    })

});
   

// app.get ("/login", (req, res) => {
//     console.log("GET /login");
//     //res.render("./pages/login");

// })
//Rota /login para processamento dos dados do formulário de LOGIN no cliente
app.post ("/login", (req, res) => {
    console.log("POST /login");
    console.log(JSON.stringify(req.body));
    const {username, password} = req.body;
    const query = "SELECT * FROM users WHERE username=? AND password=?"
    db.get(query, [username, password], (err, row) => {
        if (err) throw err;

         //1. verificar se o Usuário existe
         console.log(JSON.stringify(row));
        if(row) {
        //2. Se  existir e a senha é válida no BD, executar processo de login
        req.session.username = username;
        req.session.loggedin = true;    
        res.redirect("/dashboard")  
        } else {
        //3. Se não, executar processo de negação de login 
            res.send("usuário inválido")
        }
       
    })

    //res.render("pages/sobre");
    
})

app.get("/login", (req, res) =>{
    console.log("GET /login")
    res.render("./pages/login", {titulo: "login"});
});

app.post("/login", (req, res) =>{
    console.log("POST /login")
    console.log(JSON.stringify(req.body));
    const {username, password} = req.body;

    const query = "SELECT * FROM users WHERE username=? AND password=?"
    db.get(query, [username, password], (err, row) => {
        if (err) throw err;

//1. Verificar se o usuário existe
        console.log(JSON.stringify(row));
        if(row) {
            //2. Se o usuário existir e a senha é válida no BD, executar processo de login
            res.redirect("/dashboard");
        } else {
            //3. Se não, executar processo de negação de login
            res.send("Usuário inválido");
        }

       
    })

    //res.render("./pages/login");
});


app.get("/dashboard", (req, res) => {
    console.log("GET /dashboard")
    if (req.session.loggedin) {
    //res.render("./pages/dashboard", {titulo: "Dashboard"});
    //Listar todos os usuários
    const query = "SELECT * FROM users";
    db.all(query, [], (err, row) => {
        if (err) throw err;
        console.log(JSON.stringify(row));
        res.render("pages/dashboard", { titulo: "Tabela de usuários", dados: row });
    });
}else {
    res.send("Usuário não logado")

}
});

app.listen(PORT, () => {
    console.log(`Servidor sendo executado na porta ${PORT}`);
    console.log(__dirname + "\\static");
});
