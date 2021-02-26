const chatList = document.getElementById("chatList")!;
const textDom = document.getElementById("text") as HTMLTextAreaElement;
const userNameDom = document.getElementById("userName")!;

let userName =
  localStorage.getItem("userName") || new Date().getTime().toString();
userNameDom.innerText = userName;
userNameDom.addEventListener("input", (e) => {
  userName = (e.target as HTMLElement).innerText;
  localStorage.setItem("userName", userName);
});

// 打开一个WebSocket:
var ws = new WebSocket(`ws://localhost:3000`);
// 响应onmessage事件:

ws.onmessage = function (msg) {
  const [otherUserName, message] = msg.data.split(":");
  const oneChat = addChatToList(otherUserName, message);

  oneChat.scrollIntoView({ behavior: "smooth" });
  if (otherUserName === userName) {
    oneChat.classList.add("self");
  }
};

document.getElementById("send")!.onclick = () => {
  ws.send(`${userName}:${textDom.value}`);
  textDom.value = "";
};

textDom.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    ws.send(`${userName}:${textDom.value}`);

    setTimeout(() => {
      textDom.value = "";
    }, 0);
  }
});

textDom.addEventListener("focus", (e) => {
  e.preventDefault();
});

function addChatToList(userName: string, msg: string) {
  const oneChat = document.createElement("li");

  const theName = document.createElement("span");
  theName.innerText = userName;

  const theContent = document.createElement("span");
  theContent.innerText = msg;

  oneChat.append(theName, theContent);
  chatList.appendChild(oneChat);

  return oneChat;
}
