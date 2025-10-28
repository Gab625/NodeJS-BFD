import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });

  if (req.url === "/") {
    res.write("<h1>Main Page</h1>");
  } else if (req.url === "/hello") {
    res.write("<h1>Hello World!</h1>");
  } else {
    res.write("<h1>Not Found</h1>");
  }

  res.end();
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1");
});
