"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var emoticons = [
    "/assets/0.png",
    "/assets/1.png",
    "/assets/2.png",
    "/assets/3.png",
    "/assets/4.png",
    "/assets/5.png",
    "/assets/6.png",
    "/assets/7.png",
    "/assets/8.png",
    "/assets/9.png",
    "/assets/10.png",
    "/assets/11.png",
    "/assets/12.png",
    "/assets/13.png",
    "/assets/14.png",
    "/assets/15.png",
    "/assets/16.png",
    "/assets/17.png",
    "/assets/18.png",
    "/assets/19.png",
    "/assets/20.png",
    "/assets/21.png",
    "/assets/22.png",
    "/assets/23.png",
];
// Varible
var appContainer = document.getElementById("container");
var chatList = document.getElementById("chatList");
var controllerContainer = document.getElementById("controllerContainer");
var textarea = document.getElementById("text");
var adminLogin = document.getElementById("adminLogin");
var controller = document.getElementById("controller");
var upload = document.getElementById("upload");
var userName = new Date().getTime().toString();
// 图片大小超过 100 kb 时，启动分批传输
var BATCH_TRANSFER_SIZE = 100;
var emotiContainer;
var compress;
// Varible - function
function fileSize(base64) {
    if (base64) {
        base64 = base64.split(",")[1].split("=")[0];
        var strLength = base64.length;
        var fileLength = strLength - (strLength / 8) * 2;
        return Math.round(fileLength / 1000);
    }
    else {
        return 0;
    }
}
function compressImage(url) {
    if (!compress) {
        compress = new Compress();
    }
    var file = base64ToFile(url);
    return compress.compress([file], { size: 1, quality: 1 });
}
function base64ToFile(dataurl) {
    var arr = dataurl.split(",") || [""];
    // @ts-ignore
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "filename", {
        type: mime,
    });
}
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
        onSend({ type: "image", message: url, userName: userName });
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
            return __awaiter(this, void 0, void 0, function () {
                var text, imgSrc, _a, prefix, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            text = e.target.result;
                            if (!(fileSize(text) > 100)) return [3 /*break*/, 2];
                            return [4 /*yield*/, compressImage(text)];
                        case 1:
                            imgSrc = _b.sent();
                            _a = imgSrc[0], prefix = _a.prefix, data = _a.data;
                            pasteImage(prefix + data);
                            return [3 /*break*/, 3];
                        case 2:
                            pasteImage(text);
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        reader.readAsDataURL(file);
        evt.preventDefault();
    }
    catch (error) {
        var text = evt.clipboardData.getData("Text");
        // TODO: 粘贴大体积文本
    }
}
function generateEmoit(container) {
    emoticons.forEach(function (item) {
        var img = new Image();
        img.src = item;
        container.appendChild(img);
    });
}
function onSelectEmoti(evt) {
    var target = evt.target;
    if (target.tagName === "IMG") {
        controllerContainer.classList.remove("active");
        ws.send({ type: "emoti", userName: userName, message: target.src });
    }
}
function onControllerClick(evt) {
    var target = evt.target;
    var name = target.getAttribute("name");
    if (name === "emoti") {
        if (!emotiContainer) {
            emotiContainer = document.createElement("div");
            emotiContainer.className = "emoti-container";
            emotiContainer.addEventListener("click", onSelectEmoti);
            generateEmoit(emotiContainer);
            controllerContainer.appendChild(emotiContainer);
        }
        var status_1 = controllerContainer === null || controllerContainer === void 0 ? void 0 : controllerContainer.classList.toggle("active");
        emotiContainer.style.display = status_1 ? "grid" : "none";
    }
    else if (name === "upload") {
        upload.click();
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
            var mask = document.createElement("div");
            mask.className = "mask";
            mask.onclick = function (e) {
                e.stopPropagation();
                mask.remove();
            };
            mask.style.backgroundImage = "url(" + img_1.src + ")";
            appContainer.appendChild(mask);
        };
    }
    else {
        content.classList.add(data.type);
        var img = new Image();
        img.src = data.message;
        content.append(img);
    }
    return content;
}
function reciveBigImage(data) { }
function addChatToList(data) {
    if (data.type === "bigImage")
        return reciveBigImage(data);
    var oneChat = document.createElement("li");
    if (data.userName === userName)
        oneChat.classList.add("self");
    var theName = document.createElement("i");
    theName.className = "iconfont iconuser";
    var theContent = messageFactory(data);
    oneChat.append(theName, theContent);
    chatList.appendChild(oneChat);
    setTimeout(function () {
        oneChat.scrollIntoView({ behavior: "smooth" });
    }, 0);
}
function sendBigImage(data, sec) {
    return new Promise(function (resolve) {
        var size = 10000;
        var pice = "";
        var index = 0;
        var count = 0;
        var message = data.message;
        var timer = setInterval(function () {
            pice = message.slice(index, index + size);
            if (pice === "") {
                clearInterval(timer);
                index = 0;
                resolve(count);
                return;
            }
            index += size;
            count++;
            data.message = pice;
            ws.send(data);
        }, sec);
    });
}
function onSend(data) {
    return __awaiter(this, void 0, void 0, function () {
        var size, _a, _b, imgData, prefix, sec, time, count;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    size = fileSize(data.message);
                    _a = data.type;
                    switch (_a) {
                        case "message": return [3 /*break*/, 1];
                        case "image": return [3 /*break*/, 4];
                        case "bigImage": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1:
                    if (data.message.trim() === "") {
                        textarea.focus();
                        return [2 /*return*/];
                    }
                    if (!data.message.startsWith("data:image")) return [3 /*break*/, 3];
                    data.type = "image";
                    return [4 /*yield*/, compressImage(data.message)];
                case 2:
                    _b = (_c.sent())[0], imgData = _b.data, prefix = _b.prefix;
                    data.message = prefix + imgData;
                    return [2 /*return*/, onSend(data)];
                case 3:
                    ws.send(data);
                    return [3 /*break*/, 7];
                case 4:
                    if (size > BATCH_TRANSFER_SIZE) {
                        data.type = "bigImage";
                        return [2 /*return*/, onSend(data)];
                    }
                    else {
                        ws.send(data);
                    }
                    // ...
                    return [3 /*break*/, 7];
                case 5:
                    sec = 10;
                    time = new Date();
                    console.time(time + "\u2014\u2014\u2014\u2014\u603B\u8017\u65F6\uFF1A");
                    return [4 /*yield*/, sendBigImage(data, sec)];
                case 6:
                    count = _c.sent();
                    console.log("===================================================================================");
                    console.log("\u6BCF" + sec + "\u6BEB\u79D2\u53D1\u9001\u4E00\u6B21\u6570\u636E");
                    console.log("\u6BCF\u6B21\u53D1\u9001\u6570\u636E\u5927\u5C0F\uFF1A", (size / count).toFixed(2) + "kb");
                    console.log("发送次数：", count);
                    console.log("图片总大小：", size + "kb");
                    console.timeEnd(time + "\u2014\u2014\u2014\u2014\u603B\u8017\u65F6\uFF1A");
                    return [3 /*break*/, 7];
                case 7:
                    textarea.value = "";
                    return [2 /*return*/];
            }
        });
    });
}
function onMessageBoxChange(e) {
    var isEmptyText = textarea.value.trim() === "";
    if (e.keyCode === 13) {
        if (isEmptyText)
            e.preventDefault();
        try {
            document.querySelector("#pasteImage span").click();
        }
        catch (error) {
            if (!isEmptyText) {
                e.preventDefault();
                ws.send({ type: "message", message: textarea.value, userName: userName });
                textarea.value = "";
            }
        }
    }
}
// DOM Event
textarea.addEventListener("keypress", onMessageBoxChange);
textarea.addEventListener("paste", onPaste);
controller.addEventListener("click", onControllerClick);
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