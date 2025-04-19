document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const policyForm = document.getElementById('policyForm');
  const policyMessageDiv = document.getElementById('policyMessage');
  const policiesListDiv = document.getElementById('policiesList');
  const deactivateBtn = document.getElementById('deactivateBtn');
  const reactivateBtn = document.getElementById('reactivateBtn');
  const policyActionMessage = document.getElementById('policyActionMessage');
  const searchBtn = document.getElementById('searchBtn');
  const searchResultsDiv = document.getElementById('searchResults');

  // Function to load all policies
  async function loadPolicies() {
    try {
      const res = await fetch('/api/policies', { headers: { 'Authorization': token } });
      const data = await res.json();
      let html = '<ul>';
      data.policies.forEach(policy => {
        html += `<li>
                    <strong>ID:</strong> ${policy.id}<br>
                    <strong>Customer:</strong> ${policy.customer}<br>
                    <strong>Details:</strong> ${policy.policyDetails}<br>
                    <strong>Status:</strong> ${policy.status}<br>
                    <button onclick="populatePolicy('${policy.id}')">Edit</button>
                  </li>`;
      });
      html += '</ul>';
      policiesListDiv.innerHTML = html;
    } catch (err) {
      policiesListDiv.innerText = 'Error loading policies.';
    }
  }

  // Function to populate the form for editing
  window.populatePolicy = async function(policyId) {
    try {
      const res = await fetch('/api/policies', { headers: { 'Authorization': token } });
      const data = await res.json();
      const policy = data.policies.find(p => p.id === policyId);
      if (policy) {
        document.getElementById('policyId').value = policy.id;
        document.getElementById('customer').value = policy.customer;
        document.getElementById('policyDetails').value = policy.policyDetails;
        document.getElementById('effectiveDate').value = policy.effectiveDate ? new Date(policy.effectiveDate).toISOString().split('T')[0] : '';
        document.getElementById('expiryDate').value = policy.expiryDate ? new Date(policy.expiryDate).toISOString().split('T')[0] : '';
      }
    } catch (err) {
      console.error('Error fetching policy:', err);
    }
  };

  // Form submission: Create new policy or update existing one
  policyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Gather form data
    const policyId = document.getElementById('policyId').value;
    const customer = document.getElementById('customer').value;
    const policyDetails = document.getElementById('policyDetails').value;
    const effectiveDate = document.getElementById('effectiveDate').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const payload = { customer, policyDetails, effectiveDate, expiryDate };
    let url = '/api/policies';
    let method = 'POST';
    if (policyId) {
      // If policyId exists, update the policy
      url = `/api/policies/${policyId}`;
      method = 'PUT';
    }
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      policyMessageDiv.innerText = data.message;
      policyForm.reset();
      loadPolicies();
    } catch (err) {
      policyMessageDiv.innerText = 'Error saving policy.';
    }
  });

  // Deactivate Policy
  deactivateBtn.addEventListener('click', async () => {
    const policyId = document.getElementById('policyDeactivateId').value;
    if (!policyId) {
      policyActionMessage.innerText = 'Enter a valid policy ID.';
      return;
    }
    try {
      const res = await fetch(`/api/policies/${policyId}/deactivate`, {
        method: 'PATCH',
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      policyActionMessage.innerText = data.message;
      loadPolicies();
    } catch (err) {
      policyActionMessage.innerText = 'Error deactivating policy.';
    }
  });

  // Reactivate Policy
  reactivateBtn.addEventListener('click', async () => {
    const policyId = document.getElementById('policyDeactivateId').value;
    if (!policyId) {
      policyActionMessage.innerText = 'Enter a valid policy ID.';
      return;
    }
    try {
      const res = await fetch(`/api/policies/${policyId}/reactivate`, {
        method: 'PATCH',
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      policyActionMessage.innerText = data.message;
      loadPolicies();
    } catch (err) {
      policyActionMessage.innerText = 'Error reactivating policy.';
    }
  });

  // Search Policies
  searchBtn.addEventListener('click', async () => {
    const searchTerm = document.getElementById('searchCustomer').value;
    if (!searchTerm) {
      searchResultsDiv.innerText = 'Enter a customer name to search.';
      return;
    }
    try {
      const res = await fetch(`/api/policies/search?customer=${searchTerm}`, {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (data.policies.length === 0) {
        searchResultsDiv.innerText = 'No policies found.';
        return;
      }
      let html = '<ul>';
      data.policies.forEach(policy => {
        html += `<li>
                   <strong>ID:</strong> ${policy.id} | 
                   <strong>Customer:</strong> ${policy.customer} | 
                   <strong>Status:</strong> ${policy.status}
                 </li>`;
      });
      html += '</ul>';
      searchResultsDiv.innerHTML = html;
    } catch (err) {
      searchResultsDiv.innerText = 'Error searching policies.';
    }
  });

  // Initial load of policies
  loadPolicies();
});
