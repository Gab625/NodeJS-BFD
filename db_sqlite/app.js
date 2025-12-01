const express = require("express");
const app = express();
const port = 3000;
const sqlite3 = require("sqlite3");
const fs = require("fs");
const cheerio = require("cheerio");
const { json } = require("stream/consumers");
const { error } = require("console");

const db = new sqlite3.Database("./bd.sqlite", (err) => {
  if (err) console.error(err.message);

  console.log("Conectado ao banco de dados");
});

app.get("/pedidos", (req, res) => {
  const sql = "SELECT * FROM pedido";

  // Execução da instrução SQL no BD
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const htmlBase = fs.readFileSync("./views/pedidos.html", "utf-8");
    const cheerioLoad = cheerio.load(htmlBase);

    const tabelaCorpo = cheerioLoad("#tabela-corpo");
    rows.forEach((pedido) => {
      tabelaCorpo.append(`
<tr>
<th><a href="/pedido/${pedido.NUM_PED}">${pedido.NUM_PED}</a></th>
<td>${pedido.PRAZO_ENTR}</td>
<td>${pedido.CD_CLI}</td>
<td>${pedido.CD_VEND}</td>
<td>
        <form class="deleteForm">
    <input type="hidden" name="codigo" value="${pedido.NUM_PED}">
    <button type="submit">Remover</button>
</form>

</td>
</tr>`);
    });

    const tabelaRodape = cheerioLoad("#tabela-rodape td");
    tabelaRodape.text(rows.length);

    res.send(cheerioLoad.html());
  });
});

app.get("/pedido/:id", (req, res, next) => {
  const sql =
    "SELECT * FROM ITEM_PEDIDO as t1 LEFT JOIN PRODUTO as t2 ON t1.CD_PROD = t2.COD_PROD WHERE NO_PED = ?";

  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const htmlBase = fs.readFileSync("./views/pedido.html", "utf-8");
    const cheerioLoad = cheerio.load(htmlBase);
    const tabelaCorpo = cheerioLoad("#items-pedido");
    tabelaCorpo.empty();

    rows.forEach((pedido) => {
      tabelaCorpo.append(`
                    <div class="row g-0 linha">
                      <div class="col-1 text-center">${pedido.CD_PROD}</div>
                      <div class="col-4">${pedido.DESC_PROD}</div>
                      <div class="col-1 text-center">${pedido.UNID_PROD}</div>
                      <div class="col-2 text-center">${pedido.QTD_PED}</div>
                      <div class="col-2 text-right">${pedido.VAL_UNIT}</div>
                      <div class="col-2 text-right">${
                        pedido.VAL_UNIT * pedido.QTD_PED
                      }</div>
                  </div>
                  `);
    });

    res.send(cheerioLoad.html());
  });
});

app.delete("/pedidos/:id", (req, res, next) => {
  const id = req.params.id;

  const sql_pedido = "DELETE FROM PEDIDO WHERE NUM_PED = ?;";

  const sql_item_pedido = "DELETE FROM ITEM_PEDIDO WHERE NO_PED = ?;";

  db.run(sql_pedido, [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.run(sql_item_pedido, [id], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.status(200);
      res.send();
    });
  });
});
// Servidor
app.listen(port, () => {
  console.log(`Servidor ouvindo a porta ${port}!`);
});
