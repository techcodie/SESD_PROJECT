// Replace YOUR_RENDER_APP_URL with your actual Render deployment URL later
const API = window.location.hostname === 'sesd-project-sa7h.onrender.com'
  ? 'https://sesd-project-sa7h.onrender.com/api'
  : 'http://127.0.0.1:3000/api';

let loggedInUser = null;

function updateNavState() {
  if (loggedInUser) {
    document.getElementById('nav-bookings').style.display = 'inline-block';
    document.getElementById('auth-actions').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('logged-in-name').textContent = loggedInUser.name;
    const addPropBtn = document.querySelector('#page-properties .btn-primary');
    if (addPropBtn) {
      addPropBtn.style.display = (loggedInUser.role === 'OWNER' || loggedInUser.role === 'ADMIN') ? 'inline-block' : 'none';
    }
    document.getElementById('booking-customer-id').value = loggedInUser.userId;
    document.getElementById('booking-customer-id').readOnly = true;
  } else {
    document.getElementById('nav-bookings').style.display = 'none';
    document.getElementById('auth-actions').style.display = 'flex';
    document.getElementById('user-info').style.display = 'none';
    const addPropBtn = document.querySelector('#page-properties .btn-primary');
    if (addPropBtn) addPropBtn.style.display = 'none';
  }
}

// ---- Page Navigation ----

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  const btns = document.querySelectorAll('.nav-btn');
  btns.forEach(b => { if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(name)) b.classList.add('active'); });

  if (name === 'properties') loadProperties();
  if (name === 'admin') loadAdminPanel();
  if (name === 'home') loadStats();
}

function switchPortal(type) {
  if (type === 'admin') {
    showModal('adminAuthModal');
    // We don't change the UI to admin until they verify
    return;
  }
  
  // They selected User portal
  grantAdminAccess(false);
}

function verifyAdmin() {
  const pin = document.getElementById('admin-pin').value;
  if (pin === '1234') {
    closeModal('adminAuthModal');
    document.getElementById('admin-pin').value = '';
    grantAdminAccess(true);
  } else {
    showResult('admin-auth-result', 'Incorrect PIN. Try 1234.', true);
  }
}

function cancelAdminAuth() {
  closeModal('adminAuthModal');
  document.getElementById('portal-selector').value = 'user';
}

function grantAdminAccess(isAdmin) {
  if (isAdmin) {
    document.querySelectorAll('.user-nav').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.admin-nav').forEach(el => el.style.display = 'inline-block');
    document.getElementById('auth-actions').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
    showPage('admin');
  } else {
    document.querySelectorAll('.user-nav').forEach(el => el.style.display = 'inline-block');
    document.querySelectorAll('.admin-nav').forEach(el => el.style.display = 'none');
    updateNavState();
    showPage('home');
  }
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
    
    loggedInUser = data;
    updateNavState();
    closeModal('registerModal');
    loadStats();
    if (loggedInUser.role === 'ADMIN') {
      document.getElementById('portal-selector').value = 'admin';
      switchPortal('admin');
    }
  } catch {
    showResult('reg-result', 'Server unreachable. Is the backend running?', true);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();

  try {
    const res = await fetch(`${API}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) { showResult('login-result', data.error, true); return; }
    
    loggedInUser = data;
    updateNavState();
    closeModal('loginModal');
    if (loggedInUser.role === 'ADMIN') {
      document.getElementById('portal-selector').value = 'admin';
      switchPortal('admin');
    }
  } catch {
    showResult('login-result', 'Server unreachable.', true);
  }
}

function handleLogout() {
  loggedInUser = null;
  updateNavState();
  showPage('home');
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

    let userBookings = [];
    if (loggedInUser) {
      try {
        const bRes = await fetch(`${API}/bookings/customer/${loggedInUser.userId}`);
        const bData = await bRes.json();
        if (Array.isArray(bData)) userBookings = bData;
      } catch (e) {}
    }

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

    if (!loggedInUser) {
      // Guest View: Grouped by category
      grid.style.display = 'block'; // Turn off pure grid for sections
      
      const featured = filtered.slice(0, 2);
      const budget = filtered.filter(p => p.price < 5000000);
      const luxury = filtered.filter(p => p.price > 20000000);
      
      grid.innerHTML = `
        <div style="margin-bottom: 2rem;">
          <h3 style="color:var(--accent); margin-bottom: 1rem;">🔥 Trending & Featured</h3>
          <div class="properties-grid">${featured.map(p => propertyCardHtml(p, userBookings)).join('')}</div>
        </div>
        <div style="margin-bottom: 2rem;">
          <h3 style="color:var(--green); margin-bottom: 1rem;">💰 Budget-friendly</h3>
          <div class="properties-grid">${budget.map(p => propertyCardHtml(p, userBookings)).join('')}</div>
        </div>
        <div style="margin-bottom: 2rem;">
          <h3 style="color:var(--yellow); margin-bottom: 1rem;">💎 Luxury Properties</h3>
          <div class="properties-grid">${luxury.map(p => propertyCardHtml(p, userBookings)).join('')}</div>
        </div>
      `;
    } else {
      // Logged in View: Pure filtered grid
      grid.style.display = 'grid';
      grid.innerHTML = filtered.map(p => propertyCardHtml(p, userBookings)).join('');
    }
  } catch {
    grid.innerHTML = '<p class="empty-state">Could not load properties. Is the backend running?</p>';
  }
}

const UN_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1600607687931-ceeb8ce36e15',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde'
];

function getPropImg(id) {
  let acc = 0;
  for(let i=0; i<id.length; i++) acc += id.charCodeAt(i);
  return UN_IMAGES[acc % UN_IMAGES.length] + '?auto=format&fit=crop&w=600&q=80';
}

function propertyCardHtml(p, userBookings = []) {
  const existingBooking = userBookings.find(b => b.propertyId === p.propertyId);
  let actionHtml = '';
  
  if (existingBooking) {
    if (existingBooking.status === 'PENDING') {
      actionHtml = `<span class="badge badge-pending">Requested</span>`;
    } else {
      actionHtml = `<span class="badge ${statusBadgeClass(existingBooking.status)}">${existingBooking.status}</span>`;
    }
  } else if (p.status === 'AVAILABLE') {
    actionHtml = `<button class="btn-sm btn-book" onclick="openBookModal('${p.propertyId}')">Book</button>`;
  }

  return `
    <div class="property-card">
      <div class="property-image" style="background-image: url('${getPropImg(p.propertyId)}')"></div>
      <div class="property-content">
        <h4>${escapeHtml(p.title)}</h4>
        <div class="price">₹${Number(p.price).toLocaleString('en-IN')}</div>
        <div class="location">📍 ${escapeHtml(p.location.city)}, ${escapeHtml(p.location.state)}</div>
        <div class="description">${escapeHtml(p.description || 'No description provided.')}</div>
        <div class="property-meta">
          <span class="badge ${statusBadgeClass(p.status)}">${p.status.replace('_', ' ')}</span>
          ${actionHtml}
        </div>
      </div>
    </div>
  `;
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
  if (!loggedInUser) {
    showModal('loginModal');
    return;
  }
  document.getElementById('book-property-id').value = propertyId;
  document.getElementById('book-customer-id').value = loggedInUser.userId;
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
    
    // Automatically close the modal after a brief pause and refresh properties
    setTimeout(() => {
      closeModal('bookPropertyModal');
      loadProperties();
    }, 1500);
  } catch {
    showResult('book-result', 'Server unreachable.', true);
  }
}

// ---- Customer Bookings ----

async function loadCustomerBookings() {
  if (!loggedInUser) return;
  const customerId = loggedInUser.userId;
  const list = document.getElementById('bookings-list');

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
          ${b.status !== 'REJECTED' && b.status !== 'COMPLETED' ? `<button class="btn-sm btn-reject" onclick="cancelBooking('${b.bookingId}')">Cancel</button>` : ''}
        </div>
      </div>
    `).join('');
  } catch {
    list.innerHTML = '<p class="empty-state">Could not load bookings.</p>';
  }
}

async function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;
  try {
    await fetch(`${API}/bookings/${bookingId}`, { method: 'DELETE' });
    loadCustomerBookings();
  } catch {
    alert("Error canceling booking");
  }
}

// ---- Admin Panel ----

async function loadAdminPanel() {
  await loadAllProperties();
  await loadAllBookings();
  await loadAllUsers();
}

async function loadAllBookings() {
  const container = document.getElementById('all-bookings-list');
  try {
    const res = await fetch(`${API}/bookings`);
    const data = await res.json();

    if (data.length === 0) {
      container.innerHTML = '<p class="empty-state" style="padding:1rem 0">No bookings in system.</p>';
      return;
    }

    container.innerHTML = data.map(b => `
      <div class="admin-item">
        <div>
          <strong>${b.propertyId}</strong> 
          <span style="color:var(--text-secondary);font-size:0.8rem">(${b.customerId})</span>
          <span class="badge ${statusBadgeClass(b.status)}">${b.status}</span>
        </div>
        <div>
          ${b.status === 'PENDING' ? `<button class="btn-sm btn-accept" onclick="updateBookingState('${b.bookingId}', 'accept')">Accept</button>` : ''}
          ${b.status === 'PENDING' ? `<button class="btn-sm btn-reject" onclick="updateBookingState('${b.bookingId}', 'reject')">Reject</button>` : ''}
        </div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<p class="empty-state" style="padding:1rem 0">Error loading bookings.</p>';
  }
}

async function updateBookingState(id, action) {
  try {
    await fetch(`${API}/bookings/${id}/${action}`, { method: 'PATCH' });
    loadAllBookings();
  } catch {
    alert('Failed to update booking state.');
  }
}

async function loadAllProperties() {
  const container = document.getElementById('pending-properties');
  const header = document.querySelector('#page-admin h3');
  if (header) header.textContent = "All Properties (Manage)";
  
  try {
    const res = await fetch(`${API}/properties`);
    const data = await res.json();

    if (data.length === 0) {
      container.innerHTML = '<p class="empty-state" style="padding:1rem 0">No properties in system.</p>';
      return;
    }

    container.innerHTML = data.map(p => `
      <div class="admin-item">
        <span>${escapeHtml(p.title)} <span class="badge ${statusBadgeClass(p.status)}">${p.status}</span></span>
        <div>
          ${p.status === 'PENDING_VERIFICATION' ? `<button class="btn-sm btn-accept" onclick="verifyProperty('${p.propertyId}')">Verify</button>` : ''}
          <button class="btn-sm btn-reject" onclick="deleteProperty('${p.propertyId}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<p class="empty-state" style="padding:1rem 0">Error loading data.</p>';
  }
}

async function deleteProperty(id) {
  if (!confirm("Delete this property entirely?")) return;
  await fetch(`${API}/properties/${id}`, { method: 'DELETE' });
  loadAllProperties();
  loadProperties();
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
      <div class="user-item" style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <span>${escapeHtml(u.name)} <span style="color:var(--text-secondary);font-size:0.8rem">(${escapeHtml(u.email)})</span></span>
          <span class="user-role">${u.role}</span>
        </div>
        <button class="btn-sm btn-reject" onclick="deleteUser('${u.userId}')">Remove</button>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<p class="empty-state" style="padding:1rem 0">Error loading users.</p>';
  }
}

async function deleteUser(id) {
  if (!confirm("Remove this user?")) return;
  await fetch(`${API}/users/${id}`, { method: 'DELETE' });
  loadAllUsers();
  loadStats();
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
