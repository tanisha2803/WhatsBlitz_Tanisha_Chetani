# WhatsBlitz 

## 🔍 Objective
Understand how Chrome Extensions work and inspect WhatsApp Web's DOM to locate important elements for automation.

## ✅ Tasks Completed

- Researched Chrome Extensions: manifest, content scripts, host permissions.
- Inspected WhatsApp Web DOM to identify:
  - Search input field
  - Chat title area
  - Message input box
  - Send button
- Injected content script into WhatsApp Web.
- Verified with console logs.

## 🧪 DOM Selectors Used

| Element            | Selector                                                          |
|--------------------|-------------------------------------------------------------------|
| Search Input       | `div[contenteditable="true"][data-tab="3"]`                       |
| Chat Title         | `header span[title]`                                              |
| Message Input      | `div[contenteditable="true"][data-tab="10"]` or dynamic fallback |
| Send Button        | `span[data-icon="send"]`                                          |

## 📁 Files Included

- `manifest.json` – Chrome Extension configuration
- `content.js` – Content script injected into WhatsApp Web

## 🧾 Console Output

```plaintext
✅ Content script injected!
⏳ Waiting for DOM to load...
✅ All elements found!
# WhatsBlitz_UTKARSH
