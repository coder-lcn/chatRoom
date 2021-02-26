// Type

// Varible - dom
const appContainer = document.getElementById("container")!;
const chatList = document.getElementById("chatList")!;
const textarea = document.getElementById("text") as HTMLTextAreaElement;
const userNameBox = document.getElementById("userName")!;
const sendBtn = document.getElementById("send")!;

// Varible - store
let userName = localStorage.getItem("userName") || new Date().getTime().toString();
userNameBox.innerText = userName;

// Varible - function
function pasteImage(url: string) {
  const pasteImageContainer = document.createElement("div");

  pasteImageContainer.id = "pasteImage";
  pasteImageContainer.onclick = () => (pasteImageContainer.style.display = "none");

  const img = document.createElement("img");
  img.src = url;
  img.onclick = (e) => e.stopPropagation();

  const btn = document.createElement("span");
  btn.innerText = "发送";
  btn.onclick = (e) => {
    e.stopPropagation();
    onSend({ userName, type: "image", message: url });
    pasteImageContainer.style.display = "none";
    pasteImageContainer.remove();
  };

  pasteImageContainer.append(img, btn);
  appContainer.appendChild(pasteImageContainer);

  pasteImageContainer.style.display = "flex";
}

function onPaste(evt: ClipboardEvent) {
  try {
    const cd = evt.clipboardData!;
    const file = cd.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      pasteImage((e.target as any).result);
    };

    reader.readAsDataURL(file);
  } catch (error) {}
}

function adjustNewRecord(newRecode: HTMLElement, newRecordOwner: string) {
  newRecode.scrollIntoView({ behavior: "smooth" });
  if (newRecordOwner === userName) {
    newRecode.classList.add("self");
  }
}

function messageFactory(data: MessageProps) {
  const content = document.createElement("span");

  if (data.type === "message") {
    content.innerText = data.message;
  } else if (data.type === "image") {
    content.style.fontSize = "0";

    const img = new Image();
    img.src = data.message;
    content.append(img);
    img.onclick = () => {
      const target = img.cloneNode() as HTMLImageElement;

      const mask = document.createElement("div");
      mask.className = "mask";
      mask.onclick = (e) => {
        e.stopPropagation();
        mask.remove();
      };

      if (img.clientHeight > img.clientWidth) {
        target.style.cssText = "width: auto; height: 90vh";
      } else {
        target.style.cssText = "width: 90vw; height: auto";
      }

      mask.appendChild(target);
      appContainer.appendChild(mask);
    };
  }

  return content;
}

function addChatToList(data: MessageProps) {
  const oneChat = document.createElement("li");

  const theName = document.createElement("span");
  theName.innerText = data.userName;

  const theContent = messageFactory(data);
  oneChat.append(theName, theContent);

  chatList.appendChild(oneChat);
  adjustNewRecord(oneChat, data.userName);
}

function onChangeUserName(e: Event) {
  userName = (e.target as HTMLElement).innerText;
  localStorage.setItem("userName", userName);
}

function onSend(data: MessageProps) {
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

function onMessageBoxChange(e: KeyboardEvent) {
  if (e.keyCode === 13) {
    try {
      (document.querySelector("#pasteImage span") as HTMLSpanElement)!.click();
    } catch (error) {
      ws.send({ userName, type: "message", message: textarea.value });

      setTimeout(() => {
        textarea.value = "";
      }, 0);
    }
  }
}

// DOM Event
userNameBox.addEventListener("input", onChangeUserName);
sendBtn.addEventListener("click", () => onSend({ userName, message: textarea.value, type: "message" }));
textarea.addEventListener("keydown", onMessageBoxChange);
textarea.addEventListener("paste", onPaste);

// WebSocket Server
const ws = new WebSocket(`ws://localhost:3000`) as ChatRoom;

const oldSend = ws.send;
ws.send = function (data: MessageProps) {
  return oldSend.call(this, JSON.stringify(data));
};
ws.onmessage = function (msg: MessageEvent) {
  const data = JSON.parse(msg.data) as MessageProps;
  addChatToList(data);
};
