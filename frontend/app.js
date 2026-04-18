// Replace YOUR_RENDER_APP_URL with your actual Render deployment URL later
const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://YOUR_RENDER_APP_URL.onrender.com/api';

// ---- Page Navigation ----

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  const btns = document.querySelectorAll('.nav-btn');
  btns.forEach(b => { if (b.getAttribute('onclick').includes(name)) b.classList.add('active'); });

  if (name === 'properties') loadProperties();
  if (name === 'admin') loadAdminPanel();
  if (name === 'home') loadStats();
}

// ---- Modal Helpers ----

function showModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  const resultEl = document.querySelector(`#${id} .result-box`);
  if (resultEl) { resultEl.className = 'result-box hidden'; resultEl.textContent = ''; }
}

function showResult(elId, message, isError = false) {
  const el = document.getElementById(elId);
  el.textContent = message;
  el.className = `result-box ${isError ? 'error' : 'success'}`;
}

// ---- Register User ----

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const role = document.getElementById('reg-role').value;

  try {
    const res = await fetch(`${API}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role }),
    });
    const data = await res.json();
    if (!res.ok) { showResult('reg-result', data.error, true); return; }
    showResult('reg-result', `✅ Registered! Your ID: ${data.userId}`);
    loadStats();
  } catch {
    showResult('reg-result', 'Server unreachable. Is the backend running?', true);
  }
}

// ---- Add Property ----

async function handleAddProperty(e) {
  e.preventDefault();
  const body = {
    ownerId: document.getElementById('prop-owner-id').value.trim(),
    title: document.getElementById('prop-title').value.trim(),
    description: document.getElementById('prop-description').value.trim(),
    price: Number(document.getElementById('prop-price').value),
    address: {
      street: document.getElementById('prop-street').value.trim(),
      city: document.getElementById('prop-city').value.trim(),
      state: document.getElementById('prop-state').value.trim(),
      zipCode: document.getElementById('prop-zip').value.trim(),
    },
  };

  try {
    const res = await fetch(`${API}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { showResult('prop-result', data.error, true); return; }
    showResult('prop-result', `✅ Property listed! ID: ${data.propertyId}`);
    loadProperties();
  } catch {
    showResult('prop-result', 'Server unreachable. Is the backend running?', true);
  }
}

// ---- Load Properties ----

async function loadProperties() {
  const grid = document.getElementById('properties-grid');
  try {
    const res = await fetch(`${API}/properties`);
    const data = await res.json();

    const cityFilter = document.getElementById('filter-city').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;

    const filtered = data.filter(p => {
      const cityMatch = !cityFilter || p.location.city.toLowerCase().includes(cityFilter);
      const statusMatch = !statusFilter || p.status === statusFilter;
      return cityMatch && statusMatch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="empty-state">No properties match your filters.</p>';
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="property-card">
        <h4>${escapeHtml(p.title)}</h4>
        <div class="price">₹${Number(p.price).toLocaleString('en-IN')}</div>
        <div class="location">📍 ${escapeHtml(p.location.city)}, ${escapeHtml(p.location.state)}</div>
        <div class="description">${escapeHtml(p.description || 'No description provided.')}</div>
        <div class="property-meta">
          <span class="badge ${statusBadgeClass(p.status)}">${p.status.replace('_', ' ')}</span>
          ${p.status === 'AVAILABLE' ? `<button class="btn-sm btn-book" onclick="openBookModal('${p.propertyId}')">Book</button>` : ''}
        </div>
      </div>
    `).join('');
  } catch {
    grid.innerHTML = '<p class="empty-state">Could not load properties. Is the backend running?</p>';
  }
}

function renderProperties() {
  loadProperties();
}

function statusBadgeClass(status) {
  if (status === 'AVAILABLE') return 'badge-available';
  if (status === 'PENDING_VERIFICATION') return 'badge-pending';
  return 'badge-sold';
}

// ---- Book Property ----

function openBookModal(propertyId) {
  document.getElementById('book-property-id').value = propertyId;
  showModal('bookPropertyModal');
}

async function handleBookProperty(e) {
  e.preventDefault();
  const propertyId = document.getElementById('book-property-id').value;
  const customerId = document.getElementById('book-customer-id').value.trim();

  try {
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, propertyId }),
    });
    const data = await res.json();
    if (!res.ok) { showResult('book-result', data.error, true); return; }
    showResult('book-result', `✅ Booking requested! Booking ID: ${data.bookingId}`);
  } catch {
    showResult('book-result', 'Server unreachable.', true);
  }
}

// ---- Customer Bookings ----

async function loadCustomerBookings() {
  const customerId = document.getElementById('booking-customer-id').value.trim();
  const list = document.getElementById('bookings-list');

  if (!customerId) {
    list.innerHTML = '<p class="empty-state">Please enter a customer ID.</p>';
    return;
  }

  try {
    const res = await fetch(`${API}/bookings/customer/${customerId}`);
    const data = await res.json();

    if (data.length === 0) {
      list.innerHTML = '<p class="empty-state">No bookings found for this customer ID.</p>';
      return;
    }

    list.innerHTML = data.map(b => `
      <div class="booking-card">
        <div class="booking-info">
          <strong>Property: ${b.propertyId}</strong>
          <span>Requested: ${new Date(b.requestDate).toLocaleDateString('en-IN')}</span>
        </div>
        <div class="booking-actions">
          <span class="badge ${statusBadgeClass(b.status)}">${b.status}</span>
        </div>
      </div>
    `).join('');
  } catch {
    list.innerHTML = '<p class="empty-state">Could not load bookings.</p>';
  }
}

// ---- Admin Panel ----

async function loadAdminPanel() {
  await loadPendingProperties();
  await loadAllUsers();
}

async function loadPendingProperties() {
  const container = document.getElementById('pending-properties');
  try {
    const res = await fetch(`${API}/properties`);
    const data = await res.json();
    const pending = data.filter(p => p.status === 'PENDING_VERIFICATION');

    if (pending.length === 0) {
      container.innerHTML = '<p class="empty-state" style="padding:1rem 0">No properties pending verification.</p>';
      return;
    }

    container.innerHTML = pending.map(p => `
      <div class="admin-item">
        <span>${escapeHtml(p.title)} — ${escapeHtml(p.location.city)}</span>
        <button class="btn-sm btn-accept" onclick="verifyProperty('${p.propertyId}')">Verify</button>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<p class="empty-state" style="padding:1rem 0">Error loading data.</p>';
  }
}

async function verifyProperty(propertyId) {
  try {
    await fetch(`${API}/properties/${propertyId}/verify`, { method: 'PATCH' });
    loadAdminPanel();
    loadProperties();
  } catch {
    alert('Failed to verify property.');
  }
}

async function loadAllUsers() {
  const container = document.getElementById('all-users-list');
  try {
    const res = await fetch(`${API}/users`);
    const data = await res.json();

    if (data.length === 0) {
      container.innerHTML = '<p class="empty-state" style="padding:1rem 0">No users registered yet.</p>';
      return;
    }

    container.innerHTML = data.map(u => `
      <div class="user-item">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>${escapeHtml(u.name)} <span style="color:var(--text-secondary);font-size:0.8rem">(${escapeHtml(u.email)})</span></span>
          <span class="user-role">${u.role}</span>
        </div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<p class="empty-state" style="padding:1rem 0">Error loading users.</p>';
  }
}

// ---- Stats ----

async function loadStats() {
  try {
    const [pRes, uRes, bRes] = await Promise.all([
      fetch(`${API}/properties`),
      fetch(`${API}/users`),
      fetch(`${API}/bookings/customer/all`).catch(() => ({ json: () => [] })),
    ]);
    const properties = await pRes.json();
    const users = await uRes.json();

    animateNumber('stat-properties', properties.length);
    animateNumber('stat-users', users.length);
  } catch {}
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 20));
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 50);
}

// ---- Util ----

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Init
loadStats();
