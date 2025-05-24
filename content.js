console.log("🚀 WhatsBlitz content script loaded on WhatsApp Web");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SEND_MESSAGES") {
    sendMessages(request.contacts)
      .then(() => {
        sendResponse({ status: "completed" });
      })
      .catch(err => {
        sendResponse({ status: "error", error: err.message || String(err) });
      });
    return true; // Keep the message channel open for async response
  }
});

async function sendMessages(contacts) {
  for (const contact of contacts) {
    const number = contact.number?.toString().trim();
    const message = contact.message?.toString();

    if (!number || !message) {
      console.warn("⚠️ Skipping invalid contact:", contact);
      continue;
    }

    // Open chat for the number with prefilled message
    const chatUrl = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
    window.location.href = chatUrl;

    // Wait for message input box to be available
    const messageBox = await waitForElement("[contenteditable='true'][data-tab='10']", 30000);
    if (!messageBox) {
      console.error(`❌ Could not find message box for ${number}, skipping.`);
      continue;
    }

    // Clear existing text if any and set message
    messageBox.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
    await setInputValue(messageBox, message);

    // Wait for send button and click it
    const sendButton = await waitForElement("button[data-testid='compose-btn-send']", 10000);
    if (sendButton) {
      sendButton.click();
      console.log(`✅ Sent message to ${number}`);
    } else {
      console.error(`❌ Send button not found for ${number}, message not sent.`);
    }

    // Wait before sending next message
    await delay(7000);
  }
  console.log("✅ Finished sending all messages.");
}

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve) => {
    const interval = 300;
    let waited = 0;
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      }
      waited += interval;
      if (waited >= timeout) {
        clearInterval(timer);
        resolve(null);
      }
    }, interval);
  });
}
//done
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setInputValue(element, text) {
  try {
    await navigator.clipboard.writeText(text);
    element.focus();
    document.execCommand('paste');
  } catch {
    element.textContent = text;
    element.dispatchEvent(new InputEvent('input', { bubbles: true }));
  }
}
