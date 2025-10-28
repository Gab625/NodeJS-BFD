import { createServer } from "node:http";
import { parse } from "node:url";

const server = createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  res.write("<h1>Dados da query string</h1>");

  const result = parse(req.url, true);

  for (var key in result.query) {
    res.write("<h2>" + key + " : " + result.query[key] + "</h2>");
  }

  res.write("<hr><h1>Informacoes adicionais</h1>");

  res.write("<h2>href : " + result.href + "</h2>");
  res.write("<h2>pathname : " + result.pathname + "</h2>");
  res.write("<h2>search : " + result.search + "</h2>");
  res.write("<h2>path : " + result.path + "</h2>");

  res.end();
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1");
});
