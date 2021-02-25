const { Server } = require("ws");
const qs = require("querystring");

class App {
  server;
  port = 3000;
  userList = [];

  constructor() {
    this.init.call(this);
  }

  onMessage(msg, userName) {
    this.userList.forEach((item) => {
      item.ws.send(`${userName}:${msg}`);
    });
  }

  onConnection(ws, req) {
    const { userName } = qs.parse(req.url.slice(2));

    this.userList.push({ userName, ws });
    ws.on("message", (msg) => this.onMessage(msg, userName));
  }

  init() {
    this.server = new Server({ port: this.port });
    this.server.on("connection", this.onConnection.bind(this));
  }
}

new App();
