const emoticons = [
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
const appContainer = document.getElementById("container")!;
const chatList = document.getElementById("chatList")!;
const controllerContainer = document.getElementById("controllerContainer")!;
const textarea = document.getElementById("text") as HTMLTextAreaElement;
const adminLogin = document.getElementById("adminLogin");
const controller = document.getElementById("controller")!;
const upload = document.getElementById("upload")!;
const userName = new Date().getTime().toString();

// 图片大小超过 100 kb 时，启动分批传输
const BATCH_TRANSFER_SIZE = 100;

let emotiContainer: HTMLDivElement;
let compress: Compress;

// Varible - function
function fileSize(base64: string) {
  if (base64) {
    base64 = base64.split(",")[1].split("=")[0];
    var strLength = base64.length;
    var fileLength = strLength - (strLength / 8) * 2;
    return Math.round(fileLength / 1000);
  } else {
    return 0;
  }
}

function compressImage(url: string) {
  if (!compress) {
    compress = new Compress();
  }

  const file = base64ToFile(url);
  return compress.compress([file], { size: 1, quality: 1 });
}

function base64ToFile(dataurl: string) {
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
    onSend({ type: "image", message: url, userName });
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
      const text = (e.target as any).result;

      if (fileSize(text) > 100) {
        const imgSrc = await compressImage(text);
        const { prefix, data } = imgSrc[0];

        pasteImage(prefix + data);
      } else {
        pasteImage(text);
      }
    };

    reader.readAsDataURL(file);

    evt.preventDefault();
  } catch (error) {
    const text = evt.clipboardData!.getData("Text");
    // TODO: 粘贴大体积文本
  }
}

function generateEmoit(container: HTMLDivElement) {
  emoticons.forEach((item) => {
    const img = new Image();
    img.src = item;
    container.appendChild(img);
  });
}

function onSelectEmoti(evt: MouseEvent) {
  const target = evt.target as HTMLImageElement;
  if (target.tagName === "IMG") {
    controllerContainer.classList.remove("active");
    ws.send({ type: "emoti", userName, message: target.src });
  }
}

function onControllerClick(evt: MouseEvent) {
  const target = evt.target as HTMLElement;
  const name = target.getAttribute("name");

  if (name === "emoti") {
    if (!emotiContainer) {
      emotiContainer = document.createElement("div");
      emotiContainer.className = "emoti-container";
      emotiContainer.addEventListener("click", onSelectEmoti);

      generateEmoit(emotiContainer);

      controllerContainer.appendChild(emotiContainer);
    }

    const status = controllerContainer?.classList.toggle("active");
    emotiContainer.style.display = status ? "grid" : "none";
  } else if (name === "upload") {
    upload.click();
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
      const mask = document.createElement("div");
      mask.className = "mask";

      mask.onclick = (e) => {
        e.stopPropagation();
        mask.remove();
      };

      mask.style.backgroundImage = `url(${img.src})`;
      appContainer.appendChild(mask);
    };
  } else {
    content.classList.add(data.type);
    const img = new Image();
    img.src = data.message;
    content.append(img);
  }

  return content;
}

function reciveBigImage(data: MessageProps) {}

function addChatToList(data: MessageProps) {
  if (data.type === "bigImage") return reciveBigImage(data);

  const oneChat = document.createElement("li");
  if (data.userName === userName) oneChat.classList.add("self");

  const theName = document.createElement("i");
  theName.className = "iconfont iconuser";

  const theContent = messageFactory(data);
  oneChat.append(theName, theContent);

  chatList.appendChild(oneChat);

  setTimeout(() => {
    oneChat.scrollIntoView({ behavior: "smooth" });
  }, 0);
}

function sendBigImage(data: MessageProps, sec: number): Promise<number> {
  return new Promise((resolve) => {
    const size = 10000;
    let pice = "";
    let index = 0;
    let count = 0;
    const message = data.message;

    const timer = setInterval(() => {
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

async function onSend(data: MessageProps): Promise<void> {
  const size = fileSize(data.message);

  switch (data.type) {
    case "message":
      if (data.message.trim() === "") {
        textarea.focus();
        return;
      }

      if (data.message.startsWith("data:image")) {
        data.type = "image";
        const [{ data: imgData, prefix }] = await compressImage(data.message);
        data.message = prefix + imgData;
        return onSend(data);
      }

      ws.send(data);

      break;
    case "image":
      if (size > BATCH_TRANSFER_SIZE) {
        data.type = "bigImage";
        return onSend(data);
      } else {
        ws.send(data);
      }
      // ...
      break;
    case "bigImage":
      const sec = 10;

      const time = new Date();
      console.time(`${time}————总耗时：`);
      const count = await sendBigImage(data, sec);
      console.log("===================================================================================");
      console.log(`每${sec}毫秒发送一次数据`);
      console.log(`每次发送数据大小：`, `${(size / count).toFixed(2)}kb`);
      console.log("发送次数：", count);
      console.log("图片总大小：", size + "kb");
      console.timeEnd(`${time}————总耗时：`);

      break;
  }

  textarea.value = "";
}

function onMessageBoxChange(e: KeyboardEvent) {
  const isEmptyText = textarea.value.trim() === "";

  if (e.keyCode === 13) {
    if (isEmptyText) e.preventDefault();
    try {
      (document.querySelector("#pasteImage span") as HTMLSpanElement)!.click();
    } catch (error) {
      if (!isEmptyText) {
        e.preventDefault();

        ws.send({ type: "message", message: textarea.value, userName });
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
const ws = new WebSocket(`ws://localhost:3000`) as ChatRoom;

const oldSend = ws.send;
ws.send = function (data: MessageProps) {
  return oldSend.call(this, JSON.stringify(data));
};
ws.onmessage = function (msg: MessageEvent) {
  const data = JSON.parse(msg.data) as MessageProps;
  addChatToList(data);
};
