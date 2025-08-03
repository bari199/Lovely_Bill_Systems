document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("invoiceData"));
  if (!data) return;

  // Header
  document.querySelector(".bill-no").innerText = `Bill No. ${data.billNo}`;
  document.querySelector(
    ".invoice-header .right p"
  ).innerHTML = `<strong>Date:</strong> ${data.date}`;

  // Bill To
  const billTo = document.querySelector(".bill-to-row .left");
  billTo.innerHTML = `
    <p><strong>Bill To.</strong></p>
    <p>Company Name: <span>${data.name}</span></p>
    <p>Company Address: <span>${data.address}</span></p>
    <p>Product Details:: <span>${data.productDetails}</span></p>
  `;
  console.log("invoice message "+billTo);

  // Haats (checkboxes)
  if (data.selectedHaats && data.selectedHaats.length > 0) {
    const haatLabels = document.querySelectorAll(".haat-row label");
    haatLabels.forEach((label) => {
      const labelText = label.innerText.trim();
      const checkbox = label.querySelector("input[type='checkbox']");
      if (data.selectedHaats.includes(labelText)) {
        checkbox.checked = true;
      }
    });
  }

  // Products table
const table = document.querySelector(".invoice-table.no-rows");

// Optional: ensure table has border-collapse styling
table.style.borderCollapse = "collapse";

// Clear previous rows if needed
table.innerHTML = "";

// Optional: Add table headers
const headerRow = document.createElement("tr");
["Qty", "Description", "Serial No", "Rate", "Amount"].forEach(text => {
  const th = document.createElement("th");
  th.innerText = text;
  th.style.border = "1px solid black";
  th.style.padding = "8px";
  th.style.backgroundColor = "#eceaeaff";
  table.appendChild(headerRow);
  headerRow.appendChild(th);
});

// Generate table rows
data.products.forEach((item) => {
  const row = document.createElement("tr");

  const createCell = (value) => {
    const td = document.createElement("td");
    td.innerText = value;
    td.style.border = "1px solid #fff";
    td.style.padding = "8px";
    td.style.textAlign = "center";
    td.style.fontFamily = "Arial, sans-serif";
    td.style.fontSize = "12px";
    return td;
  };

  row.appendChild(createCell(item.qty));
  row.appendChild(createCell(item.desc));
  row.appendChild(createCell(item.serial));
  row.appendChild(createCell(item.rate));
  row.appendChild(createCell(item.amount));

  table.appendChild(row);
});


  // Total + Rupees
  document.querySelector(
    ".rupees-cell"
  ).innerHTML = `<strong>Rupees in words:</strong> ${data.rupeesInWord}`;
  document.querySelector(".total-value-cell").innerText = data.total;

  // Footer left
  document.querySelector(
    ".footer-left p"
  ).innerText = `Bill No: ${data.billNo}`;

  // Footer right
  const left = document.querySelector(".footer-right-left");
  const right = document.querySelector(".footer-right-right");

  left.innerHTML = `
    <p>Company Name: <span>${data.seasonName}</span></p>
    <p>Box: <span>${data.seasonBox}</span></p>
    <p>Amount: <span>${data.seasonAmount}</span></p>
  `;

  right.innerHTML = `
    <p>Company Address: <span>${data.seasonAddress}</span></p>
    <p>Qty: <span>${data.seasonQty}</span></p>
    <p>Signature <span>${data.seasonSign}</span></p>
  `;
});
