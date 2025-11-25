const express = require("express");
const app = express();
const port = 3000;

const path = require("path");
app.use("/public", express.static("static"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  res.send("Got a POST request at /user");
});

app.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

//tratamento
app.use((req, res, next) => {
  res.status(404); // mensagem na web
  res.sendFile(path.join(__dirname, "error", "404page.html"));
  console.log("Rota não encontrada"); // mensagem na linha de comando
});

// res.status(404).sendFile(path.join(__dirname, "error", "404page.html"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
