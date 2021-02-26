"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var App = /** @class */ (function () {
    function App() {
        this.port = 3000;
        this.userList = [];
        this.init.call(this);
    }
    App.prototype.onMessage = function (msg) {
        this.userList.forEach(function (ws) {
            ws.send(msg);
        });
    };
    App.prototype.onConnection = function (ws, req) {
        var _this = this;
        this.userList.push(ws);
        ws.on("message", function (msg) { return _this.onMessage(msg); });
    };
    App.prototype.init = function () {
        this.server = new ws_1.Server({ port: this.port });
        this.server.on("connection", this.onConnection.bind(this));
    };
    return App;
}());
new App();
