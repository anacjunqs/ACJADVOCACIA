// Servidor falso da API do Resend, só para os testes de ponta a ponta.
// POST /emails → guarda o corpo; GET /__requests → lista; DELETE /__requests → limpa.
import { createServer } from "node:http";

const port = Number(process.env.MOCK_RESEND_PORT || 4010);
/** @type {unknown[]} */
let received = [];

createServer((req, res) => {
  const json = (code, body) => {
    res.writeHead(code, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };
  if (req.url === "/__requests") {
    if (req.method === "DELETE") {
      received = [];
      return json(200, { ok: true });
    }
    return json(200, received);
  }
  if (req.url === "/emails" && req.method === "POST") {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        received.push(JSON.parse(data));
      } catch {
        received.push({ raw: data });
      }
      json(200, { id: `mock-${received.length}` });
    });
    return;
  }
  json(404, { message: "not found" });
}).listen(port, () => console.log(`mock resend em http://localhost:${port}`));
