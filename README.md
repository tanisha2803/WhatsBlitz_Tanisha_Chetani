WhatsApp Blitz – Chrome Extension
WhatsApp Blitz is a custom Chrome Extension designed to enhance the WhatsApp Web experience by enabling automation features and interface customization.

Project Structure
manifest.json
This file contains the metadata required for Chrome to recognize and load the extension. It defines important properties such as:

Extension name, description, and version

Required permissions

Scripts to be executed (e.g., content.js)

Matching URL patterns (e.g., https://web.whatsapp.com/*)

content.js
This is the core script injected into WhatsApp Web. It interacts directly with the page's DOM, allowing for:

Automation of certain actions (e.g., sending messages, extracting chats)

UI enhancements and customizations

Event handling and real-time monitoring of the chat interface

