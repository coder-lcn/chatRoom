// Type

// Varible - dom
const appContainer = document.getElementById("container")!;
const chatList = document.getElementById("chatList")!;
const textarea = document.getElementById("text") as HTMLTextAreaElement;
const userNameBox = document.getElementById("userName")!;
const sendBtn = document.getElementById("send")!;
let compress: Compress;

// Varible - store
let userName = localStorage.getItem("userName") || new Date().getTime().toString();
userNameBox.innerText = userName;

// Varible - function
function fileSize(text: string) {
  console.log(new Blob([text]).size);

  return new Blob([text]).size / 1024
}

function base64ToFile(dataurl: string) {
  var arr = dataurl.split(',') || [''];
  // @ts-ignore
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], 'filename', {
    type: mime
  });
}

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

    reader.onload = async function (e) {
      if (!compress) {
        compress = new Compress();
      }

      const text = (e.target as any).result

      if (fileSize(text) > 0.5) {
        const fileList = [base64ToFile(text)];
        const imgSrc = await compress.compress(fileList, { size: 1, quality: 0.1 })
        const { prefix, data } = imgSrc[0];

        pasteImage(prefix + data);
      } else {
        pasteImage(text)
      }
    };

    reader.readAsDataURL(file);

    evt.preventDefault();
  } catch (error) {
    const text = evt.clipboardData!.getData('Text');
    // TODO: 粘贴大体积文本
  }
}

function adjustNewRecord(newRecode: HTMLElement, newRecordOwner: string) {
  if (newRecordOwner === userName) {
    newRecode.classList.add("self");
  }

  setTimeout(() => {
    newRecode.scrollIntoView({ behavior: "smooth" });
  }, 0);
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
      const mask = document.createElement("div");
      mask.className = "mask";

      mask.onclick = (e) => {
        e.stopPropagation();
        mask.remove();
      };

      mask.style.backgroundImage = `url(${img.src})`;
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
      if (data.message.trim() === '') {
        textarea.focus();
        return;
      }

      textarea.value = "";
      break;
    case "image":
      // ...
      break;
  }

  ws.send(data);
}

function onMessageBoxChange(e: KeyboardEvent) {
  const isEmptyText = textarea.value.trim() === '';

  if (e.keyCode === 13) {
    if (isEmptyText) e.preventDefault();
    try {
      (document.querySelector("#pasteImage span") as HTMLSpanElement)!.click();
    } catch (error) {
      if (!isEmptyText) {
        e.preventDefault();

        ws.send({ userName, type: "message", message: textarea.value });
        textarea.value = "";
      }
    }
  }
}

// DOM Event
userNameBox.addEventListener("input", onChangeUserName);
sendBtn.addEventListener("click", () => onSend({ userName, message: textarea.value, type: "message" }));
textarea.addEventListener('keypress', onMessageBoxChange);
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
