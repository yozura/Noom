import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import path, { parse } from "path";
import express from "express";

const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from the browser"));
    socket.on("message", (msg) => {
        const parsedMsg = JSON.parse(msg);
        switch (parsedMsg.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${parsedMsg.payload}`));
                break;
            case "nickname":
                socket["nickname"] = parsedMsg.payload;
                break;
        }
    });
});

server.listen(3000, handleListen);