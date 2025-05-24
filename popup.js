// Global variable to hold parsed contacts
let parsedContacts = [];

// File input change handler
document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.name.endsWith('.csv')) {
    parseCSV(file);
  } else if (file.name.endsWith('.xlsx')) {
    parseXLSX(file);
  } else {
    alert('Unsupported file format. Please upload a .csv or .xlsx file.');
  }
});

// Parse CSV using PapaParse
function parseCSV(file) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log('Parsed CSV Data:', results.data);
      displayTable(results.data);
    },
    error: function(err) {
      alert('Error parsing CSV: ' + err.message);
    }
  });
}

// Parse XLSX using SheetJS
function parseXLSX(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: ''});
    console.log('Parsed XLSX Data:', jsonData);
    displayTable(jsonData);
  };
  reader.onerror = function() {
    alert('Error reading Excel file');
  };
  reader.readAsArrayBuffer(file);
}

// Display parsed contacts in table and enable send button
function displayTable(data) {
  parsedContacts = data;
  const container = document.getElementById('tableContainer');
  const sendBtn = document.getElementById('sendMessagesBtn');

  if (!data || data.length === 0) {
    container.innerHTML = '<p>No data found in file.</p>';
    sendBtn.disabled = true;
    return;
  }

  let html = '<table><thead><tr><th>Name</th><th>Number</th><th>Message</th></tr></thead><tbody>';
  data.forEach(row => {
    const name = row.Name || row.name || '';
    const number = row.Number || row.number || '';
    const message = row.Message || row.message || '';
    html += `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(number)}</td><td>${escapeHtml(message)}</td></tr>`;
  });
  html += '</tbody></table>';

  container.innerHTML = html;
  sendBtn.disabled = false;
}

// Escape HTML to avoid injection issues
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}

// Send messages button click handler
document.getElementById('sendMessagesBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) {
      alert('No active tab found.');
      return;
    }
    const tabId = tabs[0].id;
    const url = tabs[0].url;

    if (!url.includes('https://web.whatsapp.com/')) {
      alert('Please open WhatsApp Web in the active tab before sending messages.');
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).then(() => {
      chrome.tabs.sendMessage(tabId, {
        type: "SEND_MESSAGES",
        contacts: parsedContacts
      }, (response) => {
        if (chrome.runtime.lastError) {
          alert('Error sending messages: ' + chrome.runtime.lastError.message);
          return;
        }
        if (!response) {
          alert('No response from content script.');
          return;
        }

        if (response.status === "completed") {
          alert("✅ Messages sent successfully!");
        } else if (response.status === "error") {
          alert("❌ Error sending messages: " + response.error);
        } else {
          alert("⚠️ Unknown response status.");
        }
      });
    }).catch((err) => {
      alert('Failed to inject content script: ' + err.message);
    });
  });
});
//done