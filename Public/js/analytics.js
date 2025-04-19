document.addEventListener('DOMContentLoaded', async () => {
  // Retrieve the JWT token from localStorage (must have been stored upon login)
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error("No token found. Please log in to view analytics data.");
    return;
  }

  try {
    // Fetch analytics data from the analytics endpoint
    const res = await fetch('/api/analytics', {
      headers: { 'Authorization': token }
    });

    // Ensure the response is successful
    if (!res.ok) {
      throw new Error(`Failed to load analytics data. HTTP status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Fetched analytics data:", data);

    const analytics = data.analytics;
    if (!analytics) {
      throw new Error("No analytics data received from the endpoint.");
    }

    // Retrieve the canvas element and its 2D context
    const canvas = document.getElementById('analyticsChart');
    if (!canvas) {
      throw new Error("Canvas element with ID 'analyticsChart' not found.");
    }
    const ctx = canvas.getContext('2d');

    // Create a new bar chart using Chart.js
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
            'rgba(0, 123, 255, 0.6)',  // Blue
            'rgba(40, 167, 69, 0.6)',   // Green
            'rgba(255, 193, 7, 0.6)'    // Yellow
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
          y: {
            beginAtZero: true,
            ticks: {
              // Optionally, you can define the maximum value or step size here.
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  } catch (err) {
    console.error('Error fetching analytics data:', err);
  }
});
