"use strict";
var chatList = document.getElementById("chatList");
var textDom = document.getElementById("text");
var userNameDom = document.getElementById("userName");
var userName = localStorage.getItem("userName") || new Date().getTime().toString();
userNameDom.innerText = userName;
userNameDom.addEventListener("input", function (e) {
    userName = e.target.innerText;
    localStorage.setItem("userName", userName);
});
// 打开一个WebSocket:
var ws = new WebSocket("ws://localhost:3000");
// 响应onmessage事件:
ws.onmessage = function (msg) {
    var _a = msg.data.split(":"), otherUserName = _a[0], message = _a[1];
    var oneChat = addChatToList(otherUserName, message);
    oneChat.scrollIntoView({ behavior: "smooth" });
    if (otherUserName === userName) {
        oneChat.classList.add("self");
    }
};
document.getElementById("send").onclick = function () {
    ws.send(userName + ":" + textDom.value);
    textDom.value = "";
};
textDom.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        ws.send(userName + ":" + textDom.value);
        setTimeout(function () {
            textDom.value = "";
        }, 0);
    }
});
textDom.addEventListener("focus", function (e) {
    e.preventDefault();
});
function addChatToList(userName, msg) {
    var oneChat = document.createElement("li");
    var theName = document.createElement("span");
    theName.innerText = userName;
    var theContent = document.createElement("span");
    theContent.innerText = msg;
    oneChat.append(theName, theContent);
    chatList.appendChild(oneChat);
    return oneChat;
}
