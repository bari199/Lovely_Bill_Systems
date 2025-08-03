let products = [];

// Calculate amount
function calculateAmount() {
  const qty = parseFloat(document.getElementById("qty").value) || 0;
  const rate = parseFloat(document.getElementById("rate").value) || 0;
  const amount = qty * rate;
  document.getElementById("amount").value = amount.toFixed(2);
}

// Live calculation listeners
document.getElementById("qty").addEventListener("input", calculateAmount);
document.getElementById("rate").addEventListener("input", calculateAmount);

// "Add" button alert validations
document.querySelector(".season-btn-add").addEventListener("click", () => {
  const qty = document.getElementById("qty").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const serial = document.getElementById("serial").value.trim();
  const rate = document.getElementById("rate").value.trim();

  if (!qty) return alert("Please fill the Qty.");
  if (!desc) return alert("Please fill the Description.");
  if (!serial) return alert("Please fill the Serial No.");
  if (!rate) return alert("Please fill the Rate.");

  const amount = parseFloat(qty) * parseFloat(rate);

  products.push({
    qty,
    desc,
    serial,
    rate,
    amount: amount.toFixed(2),
  });

  // Clear input fields
  document.getElementById("qty").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("serial").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("amount").value = "";

  updateTotal();
  updateTotalProduct();
  updateTotalQty(); // ✅ New: update received slip qty
});

// Update total amount
function updateTotal() {
  const total = products.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalValue = total.toFixed(2);
  document.getElementById("total").value = totalValue;
  document.getElementById("season-amount").value = totalValue; // ✅ Sync to Net Amount
}

// Update total product count
function updateTotalProduct() {
  const totalProductInput = document.getElementById("total-product");
  if (totalProductInput) totalProductInput.value = products.length;
}

// ✅ New: Update total quantity and sync to "Received Slip → Qty"
function updateTotalQty() {
  const totalQty = products.reduce((sum, p) => sum + parseFloat(p.qty), 0);
  document.getElementById("season-qty").value = totalQty || 0;
}

// Delete product by Serial No.
function deleteProduct(serialNo) {
  const index = products.findIndex((p) => p.serial === serialNo);
  if (index !== -1) {
    products.splice(index, 1);
    updateTotal();
    updateTotalProduct();
    updateTotalQty(); // ✅ Also update qty on delete
    alert(`Product with Serial No. "${serialNo}" deleted.`);
  } else {
    alert(`No product found with Serial No. "${serialNo}"`);
  }
}

// Delete button handler
document.addEventListener("DOMContentLoaded", () => {
  const deleteBtn = document.getElementById("delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const serialInput = document.getElementById("delete-product");
      const serial = serialInput.value.trim();
      if (serial) {
        deleteProduct(serial);
        serialInput.value = "";
      } else {
        alert("Please enter a Serial No. to delete.");
      }
    });
  }

  const totalProductInput = document.getElementById("total-product");
  if (totalProductInput) totalProductInput.readOnly = true;
});

// ✅ Submit button → store all data in localStorage
document.getElementById("final-submit").addEventListener("click", () => {
  const checkboxes = document.querySelectorAll(".checkbox");
  const selectedHaats = Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.nextElementSibling.innerText.trim());

  const totalAmount = document.getElementById("total").value;

  const invoiceData = {
    billNo: document.getElementById("bill-no").value,
    billTo: document.getElementById("billto").value,
    date: document.getElementById("date").value,
    name: document.getElementById("name").value,
    productDetails: document.getElementById("product").value,
    address: document.getElementById("address").value,
    total: totalAmount,
    totalProduct: document.getElementById("total-product").value,
    rupeesInWord: document.getElementById("words").value,
    seasonName: document.getElementById("season-name").value,
    seasonAddress: document.getElementById("season-address").value,
    seasonAmount: totalAmount, // ✅ synced value
    seasonQty: document.getElementById("season-qty").value,
    seasonBox: document.getElementById("season-box").value,
    seasonSign: document.getElementById("season-sign").value,
    selectedHaats: selectedHaats,
    products: products,
  };

  localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
  window.location.href = "../Editpage/index.html"; // Redirect to Edit page
  alert("Data saved successfully! You can now edit it.");
});
