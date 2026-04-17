const API = 'http://localhost:3000/api';

async function seed() {
  try {
    console.log('Seeding data...');
    // Seed Users
    const u1Res = await fetch(`${API}/users/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: 'Alice Johnson', email: 'alice@example.com', role: 'CUSTOMER'})});
    const u1 = await u1Res.json();
    
    const u2Res = await fetch(`${API}/users/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: 'Bob Builder', email: 'bob@example.com', role: 'OWNER'})});
    const u2 = await u2Res.json();

    const u3Res = await fetch(`${API}/users/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: 'Admin User', email: 'admin@example.com', role: 'ADMIN'})});
    
    // Seed Properties
    const p1Res = await fetch(`${API}/properties`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ ownerId: u2.userId, title: 'Luxury Villa in Suburbs', description: 'A beautiful 4BHK villa with a private pool.', price: 25000000, address: { street: '10 Palm Ave', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050'}}) });
    const p1 = await p1Res.json();
    
    const p2Res = await fetch(`${API}/properties`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ ownerId: u2.userId, title: 'Cozy Studio Apartment', description: 'Perfect for bachelors. Close to metro.', price: 4500000, address: { street: '42 Main St', city: 'Pune', state: 'Maharashtra', zipCode: '411001'}}) });
    const p2 = await p2Res.json();

    // Verify Property 1 so it's visible in properties list
    const propertyId1 = p1.propertyId || p1.id;
    if (propertyId1) {
       await fetch(`${API}/properties/${propertyId1}/verify`, { method: 'PATCH' });
    }

    // Add Booking for Property 1
    if (u1.userId && propertyId1) {
       await fetch(`${API}/bookings`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ customerId: u1.userId, propertyId: propertyId1 }) });
    }
    
    console.log('Seeded successfully! Check the dashboard.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  }
}

seed();
