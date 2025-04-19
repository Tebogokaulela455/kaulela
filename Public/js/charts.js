// public/js/charts.js
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found. Please log in before visiting the dashboard.");
    return;
  }
  console.log("Token found:", token);

  try {
    const res = await fetch('/api/analytics', {
      headers: { 'Authorization': token }
    });
    
    console.log("Fetch /api/analytics response:", res);
    
    if (!res.ok) {
      throw new Error(`Failed to load analytics data. HTTP status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Analytics data received:", data);
    
    const analytics = data.analytics;
    if (!analytics) {
      throw new Error("No analytics data received from endpoint.");
    }
    
    const canvas = document.getElementById('analyticsChart');
    if (!canvas) {
      throw new Error("Canvas element with id 'analyticsChart' not found.");
    }
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Policies', 'Active Policies', 'Trial Policies'],
        datasets: [{
          label: 'Policy Metrics',
          data: [
            analytics.totalPolicies || 0,
            analytics.activePolicies || 0,
            analytics.trialPolicies || 0
          ],
          backgroundColor: [
            'rgba(0, 123, 255, 0.6)',
            'rgba(40, 167, 69, 0.6)',
            'rgba(255, 193, 7, 0.6)'
          ],
          borderColor: [
            'rgba(0, 123, 255, 1)',
            'rgba(40, 167, 69, 1)',
            'rgba(255, 193, 7, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    console.log("Chart rendered successfully.");
    
  } catch (err) {
    console.error("Error fetching analytics data:", err);
  }
});
