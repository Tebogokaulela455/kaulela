document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  
  const subscriptionInfoDiv = document.getElementById('subscriptionInfo');
  const subscribeBtn = document.getElementById('subscribeBtn');
  
  async function loadSubscriptionStatus() {
    try {
      const res = await fetch('/api/subscription', {
        headers: {
          'Authorization': token
        }
      });
      const data = await res.json();
      subscriptionInfoDiv.innerHTML = `
        <p>Status: ${data.subscriptionStatus}</p>
        <p>Trial Expires: ${new Date(data.trialExpires).toLocaleString()}</p>
      `;
    } catch (err) {
      console.error(err);
      subscriptionInfoDiv.innerText = 'Error loading subscription info.';
    }
  }
  
  subscribeBtn.addEventListener('click', async function () {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      const data = await res.json();
      alert(data.message);
      loadSubscriptionStatus();
    } catch (err) {
      console.error(err);
      alert('Error during subscription activation.');
    }
  });
  
  loadSubscriptionStatus();
});
