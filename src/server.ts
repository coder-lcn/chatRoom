import WebSocket, { Server } from "ws";
import http from "http";

class App {
  server: Server;
  port = 3000;
  userList: WebSocket[] = [];

  constructor() {
    this.init.call(this);
  }

  onMessage(msg: WebSocket.Data) {
    this.userList.forEach((ws) => {
      ws.send(msg);
    });
  }

  onConnection(ws: WebSocket, req: http.IncomingMessage) {
    this.userList.push(ws);
    ws.on("message", (msg) => this.onMessage(msg));
  }

  init() {
    this.server = new Server({ port: this.port });
    this.server.on("connection", this.onConnection.bind(this));
  }
}

new App();
