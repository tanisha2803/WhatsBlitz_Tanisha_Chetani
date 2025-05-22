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

function displayTable(data) {
  const container = document.getElementById('tableContainer');
  if (!data || data.length === 0) {
    container.innerHTML = '<p>No data found in file.</p>';
    return;
  }

  let html = '<table><thead><tr><th>Name</th><th>Number</th><th>Message</th></tr></thead><tbody>';

  data.forEach(row => {
    const name = row.Name || row.name || '';
    const number = row.Number || row.number || '';
    const message = row.Message || row.message || '';
    html += `<tr>
      <td>${escapeHtml(name)}</td>
      <td>${escapeHtml(number)}</td>
      <td>${escapeHtml(message)}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// Utility function to escape HTML special chars for safety
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
