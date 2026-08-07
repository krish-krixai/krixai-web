const fetch = require('node-fetch'); // we can just use global fetch in Node 18+

async function testOrder() {
  const payload = {
      currency: 'INR',
      plan_name: 'Starter',
      billing_details: { name: 'Test User', address: '123 Fake St', state: '06', pin_code: '123456', country: 'IN' }
  };
  
  const res = await fetch('http://localhost:3000/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
  });
  
  console.log(res.status, await res.text());
}

testOrder();
