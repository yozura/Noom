const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#msg");
const nickForm = document.querySelector("#nick");

const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open", (socket) => {
    console.log("Connected to Server");
});
socket.addEventListener("message", (msg) => {
    const li = document.createElement("li");
    li.innerText = msg.data;
    msgList.append(li);
});
socket.addEventListener("close", () => {
    console.log("Disconnected from Server");
});

// Send Msg
function makeMsg(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

function handleMsgSubmit(event) {
    event.preventDefault();
    const input = msgForm.querySelector("input");
    socket.send(makeMsg("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    msgList.append(li);
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMsg("nickname", input.value));
    input.value = "";
}

msgForm.addEventListener("submit", handleMsgSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
