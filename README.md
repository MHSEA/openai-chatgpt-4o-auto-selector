# 🔄 ChatGPT GPT 4o + Temp Chat Automation

A fast and lightweight Tampermonkey userscript that:

✅ Automatically enables **Temporary Chat** mode  
✅ Automatically selects **GPT-4o**  
✅ Adds a **Ctrl + Space** keyboard shortcut to toggle Temporary Chat  
✅ Skips execution entirely if URL already has `?model=gpt-4o&temporary-chat=true`  
✅ Optimized for speed and reliability — even on route changes

---

## 🚀 Features

- 🧠 **Auto-enables Temporary Chat** on every page load
- ⚡ **Forces GPT-4o model selection** after temp chat
- 🎛️ **Ctrl + Space toggle** to manually switch temp chat on/off
- 🧪 Smart checks to **avoid redundant actions**
- 🔁 Detects route changes and reapplies settings if needed
- 🛑 **Does not run** if URL already includes the correct query params

---

![2025-08-12_01-54-37-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/0a8d0653-2c5f-4500-b60e-1a71c34dea98)

---

📝 Important Notes
If you're not seeing GPT-4o in the model selector:
  1- Go to chatgpt.com on a PC or browser
  2- Open Settings → General
  3- Enable "Show legacy models"
❌ This script does not work in the ChatGPT mobile app

---

## 💻 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Click “Create a new script” in the Tampermonkey dashboard.
3. Paste in the contents of [chatgpt-gpt4o-automation.js](https://github.com/MHSEA/openai-chatgpt-4o-auto-selector/blob/main/chatgpt-gpt4o-automation.js).
4. Save the script and reload [https://chatgpt.com](https://chatgpt.com).

---

## ⌨️ Shortcut

| Key Combo     | Action                         |
|---------------|--------------------------------|
| `Ctrl + Space`| Toggle Temporary Chat manually |

---

## 🧩 How it works

- Uses fast polling (`15ms`) for near-instant detection
- Mimics real mouse and keyboard events for compatibility
- Uses mutation-safe selectors and retry strategies
- Runs in strict order: **Temp Chat → GPT-4o**

---

## 🔒 Note on Direct URL Parameters
OpenAI no longer allows selecting models or toggling Temporary Chat via URL parameters alone. For example, visiting: https://chatgpt.com/?model=gpt-4o won’t apply the desired settings automatically.

This script solves that by simulating real user interaction to:

- ✅ Enable Temporary Chat
- ✅ Select GPT-4o via the dropdown

🛑 If the URL contains model=gpt-5, the script respects your choice and will not force GPT-4o.
Additionally, if model=gpt-4o&temporary-chat=true is already set, the script won’t run at all to avoid unnecessary processing.

---

## 📜 License

[MIT License](https://mit-license.org/)

---

## 👨‍💻 Author

Maintained by [MHSEA](https://github.com/MHSEA)

---

## 🧠 Tip

Pin this script to the top of your Tampermonkey list to ensure it runs before others!
