"use strict";
// Type
// Varible - dom
var appContainer = document.getElementById("container");
var chatList = document.getElementById("chatList");
var textarea = document.getElementById("text");
var userNameBox = document.getElementById("userName");
var sendBtn = document.getElementById("send");
// Varible - store
var userName = localStorage.getItem("userName") || new Date().getTime().toString();
userNameBox.innerText = userName;
// Varible - function
function pasteImage(url) {
    var pasteImageContainer = document.createElement("div");
    pasteImageContainer.id = "pasteImage";
    pasteImageContainer.onclick = function () { return (pasteImageContainer.style.display = "none"); };
    var img = document.createElement("img");
    img.src = url;
    img.onclick = function (e) { return e.stopPropagation(); };
    var btn = document.createElement("span");
    btn.innerText = "发送";
    btn.onclick = function (e) {
        e.stopPropagation();
        onSend({ userName: userName, type: "image", message: url });
        pasteImageContainer.style.display = "none";
        pasteImageContainer.remove();
    };
    pasteImageContainer.append(img, btn);
    appContainer.appendChild(pasteImageContainer);
    pasteImageContainer.style.display = "flex";
}
function onPaste(evt) {
    try {
        var cd = evt.clipboardData;
        var file = cd.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            pasteImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    catch (error) { }
}
function adjustNewRecord(newRecode, newRecordOwner) {
    newRecode.scrollIntoView({ behavior: "smooth" });
    if (newRecordOwner === userName) {
        newRecode.classList.add("self");
    }
}
function messageFactory(data) {
    var content = document.createElement("span");
    if (data.type === "message") {
        content.innerText = data.message;
    }
    else if (data.type === "image") {
        content.style.fontSize = "0";
        var img_1 = new Image();
        img_1.src = data.message;
        content.append(img_1);
        img_1.onclick = function () {
            var target = img_1.cloneNode();
            var mask = document.createElement("div");
            mask.className = "mask";
            mask.onclick = function (e) {
                e.stopPropagation();
                mask.remove();
            };
            if (img_1.clientHeight > img_1.clientWidth) {
                target.style.cssText = "width: auto; height: 90vh";
            }
            else {
                target.style.cssText = "width: 90vw; height: auto";
            }
            mask.appendChild(target);
            appContainer.appendChild(mask);
        };
    }
    return content;
}
function addChatToList(data) {
    var oneChat = document.createElement("li");
    var theName = document.createElement("span");
    theName.innerText = data.userName;
    var theContent = messageFactory(data);
    oneChat.append(theName, theContent);
    chatList.appendChild(oneChat);
    adjustNewRecord(oneChat, data.userName);
}
function onChangeUserName(e) {
    userName = e.target.innerText;
    localStorage.setItem("userName", userName);
}
function onSend(data) {
    switch (data.type) {
        case "message":
            textarea.value = "";
            break;
        case "image":
            // ...
            break;
    }
    ws.send(data);
}
function onMessageBoxChange(e) {
    if (e.keyCode === 13) {
        try {
            document.querySelector("#pasteImage span").click();
        }
        catch (error) {
            ws.send({ userName: userName, type: "message", message: textarea.value });
            setTimeout(function () {
                textarea.value = "";
            }, 0);
        }
    }
}
// DOM Event
userNameBox.addEventListener("input", onChangeUserName);
sendBtn.addEventListener("click", function () { return onSend({ userName: userName, message: textarea.value, type: "message" }); });
textarea.addEventListener("keydown", onMessageBoxChange);
textarea.addEventListener("paste", onPaste);
// WebSocket Server
var ws = new WebSocket("ws://localhost:3000");
var oldSend = ws.send;
ws.send = function (data) {
    return oldSend.call(this, JSON.stringify(data));
};
ws.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    addChatToList(data);
};
//# sourceMappingURL=client.js.map