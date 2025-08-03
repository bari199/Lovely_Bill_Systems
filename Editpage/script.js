document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("invoiceData")) || {};
  let isProductEditing = false;
  let isSlipEditing = false;

  const formFields = {
    "bill-no": "billNo",
    "billto": "billTo",
    "date": "date",
    "name": "name",
    "product": "productDetails",
    "address": "address",
  };

  // Fill form fields and disable
  Object.entries(formFields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = data[key] || "";
      el.disabled = true;
    }
  });

  // Haat checkboxes
  document.querySelectorAll(".checkbox").forEach((checkbox) => {
    const label = checkbox.nextElementSibling.innerText.trim();
    checkbox.checked = data.selectedHaats?.includes(label);
    checkbox.disabled = true;
  });

  // PRODUCT SECTION
  const tbody = document.querySelector(".product-table tbody");
  tbody.innerHTML = "";

  if (Array.isArray(data.products)) {
    data.products.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="number" value="${product.qty}" class="qty-input" disabled></td>
        <td><input type="text" value="${product.desc}" class="desc-input" disabled></td>
        <td><input type="text" value="${product.serial}" class="serial-input" disabled></td>
        <td><input type="number" value="${product.rate}" class="rate-input" disabled></td>
        <td><input type="text" value="${product.amount}" class="amount-input" readonly disabled></td>
      `;
      tbody.appendChild(row);
    });
  }

  // Live calculation during edit
  tbody.addEventListener("input", (e) => {
    if (!isProductEditing) return;
    const row = e.target.closest("tr");
    const qty = parseFloat(row.querySelector(".qty-input").value) || 0;
    const rate = parseFloat(row.querySelector(".rate-input").value) || 0;
    row.querySelector(".amount-input").value = (qty * rate).toFixed(2);
  });

  const totalInput = document.getElementById("total");
  const rupeesInput = document.getElementById("rupeesInWord");

  if (totalInput) totalInput.value = data.total || "";
  if (rupeesInput) rupeesInput.value = data.rupeesInWord || "";
  if (rupeesInput) rupeesInput.disabled = true;

  // Edit button
  document.querySelector(".btn.edit").addEventListener("click", () => {
    isProductEditing = true;
    document.querySelectorAll(".product-table input").forEach((input) => {
      input.disabled = false;
    });
    if (rupeesInput) rupeesInput.disabled = false;
    alert("You can now edit Product Calculation and Rupees in Words.");
  });

  // Save button
  document.querySelector(".btn.save").addEventListener("click", () => {
    if (!isProductEditing) return alert("Click Edit button before saving.");

    const updatedProducts = [];
    let totalQty = 0;
    let totalAmount = 0;

    document.querySelectorAll(".product-table tbody tr").forEach((row) => {
      const qty = row.querySelector(".qty-input").value.trim();
      const desc = row.querySelector(".desc-input").value.trim();
      const serial = row.querySelector(".serial-input").value.trim();
      const rate = row.querySelector(".rate-input").value.trim();
      const amount = row.querySelector(".amount-input").value.trim();

      if (qty && desc && serial && rate) {
        const qtyVal = parseFloat(qty);
        const amtVal = parseFloat(amount);
        totalQty += isNaN(qtyVal) ? 0 : qtyVal;
        totalAmount += isNaN(amtVal) ? 0 : amtVal;

        updatedProducts.push({ qty, desc, serial, rate, amount });
      }
    });

    const selectedHaats = Array.from(document.querySelectorAll(".checkbox"))
      .filter((cb) => cb.checked)
      .map((cb) => cb.nextElementSibling.innerText.trim());

    data.products = updatedProducts;
    data.selectedHaats = selectedHaats;
    data.total = totalAmount.toFixed(2);
    data.rupeesInWord = rupeesInput.value.trim();
    data.seasonAmount = data.total;
    data.seasonQty = totalQty.toString();

    if (totalInput) totalInput.value = data.total;

    localStorage.setItem("invoiceData", JSON.stringify(data));
    alert("✅ Product section updated.");

    document.querySelectorAll(".product-table input").forEach((input) => {
      input.disabled = true;
    });
    if (rupeesInput) rupeesInput.disabled = true;

    // Update Receive Slip values
    document.querySelectorAll(".receive-slip input").forEach((input) => {
      const ph = input.placeholder;
      if (ph === "Enter Amount") {
        input.value = data.seasonAmount;
        input.disabled = true;
      } else if (ph === "Enter Qty") {
        input.value = data.seasonQty;
        input.disabled = true;
      }
    });

    isProductEditing = false;
  });

  // RECEIVE SLIP
  const slipMap = {
    "Enter Your Full Name": "seasonName",
    "Enter Your Address": "seasonAddress",
    "Enter Amount": "seasonAmount",
    "Enter Qty": "seasonQty",
    "Total Box": "seasonBox",
    "Signature": "seasonSign",
  };

  document.querySelectorAll(".receive-slip input").forEach((input) => {
    const key = slipMap[input.placeholder];
    if (key && data[key]) input.value = data[key];
    input.disabled = true;
  });

  const slipEditBtn = document.querySelectorAll(".receive-slip .btn")[0];
  slipEditBtn.addEventListener("click", () => {
    isSlipEditing = true;
    document.querySelectorAll(".receive-slip input").forEach((inp) => {
      const placeholder = inp.placeholder;
      if (
        placeholder === "Enter Your Full Name" ||
        placeholder === "Enter Your Address" ||
        placeholder === "Total Box" ||
        placeholder === "Signature"
      ) {
        inp.disabled = false;
      } else {
        inp.disabled = true; // Lock Net Amount and Qty
      }
    });
    alert("You can now edit Name, Address, Box, and Signature.");
  });

  const slipSaveBtn = document.querySelectorAll(".receive-slip .btn")[1];
  slipSaveBtn.addEventListener("click", () => {
    if (!isSlipEditing) return alert("⚠️ Please click Edit button before saving.");

    document.querySelectorAll(".receive-slip input").forEach((input) => {
      const key = slipMap[input.placeholder];
      if (key) {
        data[key] = input.value;
      }
      input.disabled = true; // Lock all again after save
    });

    localStorage.setItem("invoiceData", JSON.stringify(data));
    alert("✅ Receive Slip updated.");

    isSlipEditing = false; // Reset flag to require next Edit
  });

  document.querySelector(".submit-btn").addEventListener("click", () => {
    window.location.href = "../Invoice/invoice.html";
  });
});
