// LocalStorage-based Inventory DB

let products = JSON.parse(localStorage.getItem('products') || '[]');
let categories = JSON.parse(localStorage.getItem('categories') || '["Fruits","Vegetables","Dairy"]');
let suppliers = JSON.parse(localStorage.getItem('suppliers') || '["Fresh Farms","Dairy Best"]');

function save() {
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('categories', JSON.stringify(categories));
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
}

// Products
function renderProductTable() {
  const tbody = document.querySelector('#productTable tbody');
  tbody.innerHTML = '';
  products.forEach((p, i) => {
    const row = document.createElement('tr');
    if (p.stock <= p.minStock) row.classList.add('table-danger');
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.supplier}</td>
      <td>$${p.price}</td>
      <td>${p.stock}</td>
      <td>${p.minStock}</td>
      <td>
        <button onclick="editProduct(${i})" class="btn btn-sm btn-primary">Edit</button>
        <button onclick="deleteProduct(${i})" class="btn btn-sm btn-danger">Delete</button>
      </td>`;
    tbody.appendChild(row);
  });
  save();
}

function addProduct() {
  const name = prompt("Product name?");
  const category = prompt(`Category?\nOptions: ${categories.join(", ")}`, categories[0]);
  const supplier = prompt(`Supplier?\nOptions: ${suppliers.join(", ")}`, suppliers[0]);
  const price = parseFloat(prompt("Price?", "1.00"));
  const stock = parseInt(prompt("Stock?", "50"));
  const minStock = parseInt(prompt("Min Stock Level?", "10"));

  if (name) {
    products.push({ name, category, supplier, price, stock, minStock });
    renderProductTable();
    renderStockChart();
  }
}

function editProduct(i) {
  const p = products[i];
  p.name = prompt("Product name?", p.name);
  p.category = prompt(`Category?\nOptions: ${categories.join(", ")}`, p.category);
  p.supplier = prompt(`Supplier?\nOptions: ${suppliers.join(", ")}`, p.supplier);
  p.price = parseFloat(prompt("Price?", p.price));
  p.stock = parseInt(prompt("Stock?", p.stock));
  p.minStock = parseInt(prompt("Min Stock?", p.minStock));
  renderProductTable();
  renderStockChart();
}

function deleteProduct(i) {
  if (confirm("Delete this product?")) {
    products.splice(i, 1);
    renderProductTable();
    renderStockChart();
  }
}

document.getElementById('addProductBtn')?.addEventListener('click', addProduct);

// Categories
function renderCategories() {
  const list = document.getElementById('categoryList');
  list.innerHTML = '';
  categories.forEach((c, i) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between';
    item.innerHTML = `${c} <button onclick="deleteCategory(${i})" class="btn btn-sm btn-danger">Delete</button>`;
    list.appendChild(item);
  });
  save();
}

function addCategory() {
  const name = document.getElementById('categoryName').value.trim();
  if (name) categories.push(name);
  document.getElementById('categoryName').value = '';
  renderCategories();
}

function deleteCategory(i) {
  categories.splice(i, 1);
  renderCategories();
}

// Suppliers
function renderSuppliers() {
  const list = document.getElementById('supplierList');
  list.innerHTML = '';
  suppliers.forEach((s, i) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between';
    item.innerHTML = `${s} <button onclick="deleteSupplier(${i})" class="btn btn-sm btn-danger">Delete</button>`;
    list.appendChild(item);
  });
  save();
}

function addSupplier() {
  const name = document.getElementById('supplierName').value.trim();
  if (name) suppliers.push(name);
  document.getElementById('supplierName').value = '';
  renderSuppliers();
}

function deleteSupplier(i) {
  suppliers.splice(i, 1);
  renderSuppliers();
}

// Chart.js Stock Report
function renderStockChart() {
  const ctx = document.getElementById('stockChart').getContext('2d');
  const data = {};
  products.forEach(p => {
    if (!data[p.category]) data[p.category] = { total: 0, low: 0 };
    data[p.category].total++;
    if (p.stock <= p.minStock) data[p.category].low++;
  });

  const labels = Object.keys(data);
  const total = labels.map(k => data[k].total);
  const low = labels.map(k => data[k].low);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Total Products', data: total, backgroundColor: 'blue' },
        { label: 'Low Stock', data: low, backgroundColor: 'red' }
      ]
    }
  });
}
