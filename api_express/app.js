const express = require ("express");
const app = express();

app.use("/xyz", express.static("public"))

app.get("/",(req, res) => {
    res.send("home");
})

app.get("/artigos",(req, res) => {
    res.send("teste.html");
})

app.get("/contato",(req, res) => {
    res.send("Pagina com as informações de contato");
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})