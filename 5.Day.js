// ── State ──
let menu    = JSON.parse(localStorage.getItem('sk_menu') || '{"breakfast":[],"lunch":[],"dinner":[]}');
let current = autoMeal();

// Pick meal based on current time
function autoMeal() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'breakfast';
  if (h >= 12 && h < 17) return 'lunch';
  return 'dinner';
}

const TITLES = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };

// ── On page load ──
document.addEventListener('DOMContentLoaded', function () {

  // Date
  document.getElementById('today-date').textContent =
    new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

  // Meal tab clicks
  document.querySelector('.meal-tabs').addEventListener('click', function (e) {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    current = tab.dataset.meal;
    render();
  });

  // Add button
  document.getElementById('add-btn').addEventListener('click', addItem);

  // Enter key on price field
  document.getElementById('inp-price').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addItem();
  });

  // Enter key on name field moves to price
  document.getElementById('inp-name').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('inp-price').focus();
  });

  // Clear all items for current meal
  document.getElementById('clear-btn').addEventListener('click', function () {
    if (menu[current].length === 0) return;
    if (!confirm('Clear all ' + TITLES[current] + ' items?')) return;
    menu[current] = [];
    save();
    render();
  });

  render();
});

// ── Add item ──
function addItem() {
  const nameEl  = document.getElementById('inp-name');
  const priceEl = document.getElementById('inp-price');

  const name  = nameEl.value.trim();
  const price = parseFloat(priceEl.value);

  if (!name)               { nameEl.focus();  return alert('Enter a dish name.'); }
  if (isNaN(price) || price < 0) { priceEl.focus(); return alert('Enter a valid price.'); }

  menu[current].push({ name, price });
  save();
  render();

  nameEl.value  = '';
  priceEl.value = '';
  nameEl.focus();
}

// ── Delete item ──
function deleteItem(index) {
  menu[current].splice(index, 1);
  save();
  render();
}

// ── Render ──
function render() {
  const items = menu[current];

  // Tabs
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.classList.toggle('active', tab.dataset.meal === current);
  });

  // Heading
  document.getElementById('meal-title').textContent = TITLES[current];

  // Empty message
  document.getElementById('empty-msg').style.display = items.length ? 'none' : 'block';

  // List
  document.getElementById('item-list').innerHTML = items.map(function (item, i) {
    return `
      <li>
        <span class="li-name">${esc(item.name)}</span>
        <span class="li-price">₹${item.price.toFixed(2)}</span>
        <button class="li-del" onclick="deleteItem(${i})">Delete</button>
      </li>`;
  }).join('');
}

// ── Save ──
function save() {
  localStorage.setItem('sk_menu', JSON.stringify(menu));
}

// ── Escape HTML ──
function esc(str) {
  return str.replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c];
  });
}
