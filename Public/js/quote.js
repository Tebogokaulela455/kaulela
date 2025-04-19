// public/js/quote.js
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in before generating a quote.');
    return;
  }

  // Generate Quote
  document.getElementById('quoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const customer       = document.getElementById('qCustomer').value;
    const productType    = document.getElementById('qProductType').value;
    const coverageAmount = document.getElementById('qCoverage').value;
    const riskProfile    = document.getElementById('qRisk').value;

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  token
        },
        body: JSON.stringify({ customer, productType, coverageAmount, riskProfile })
      });

      // If non-2xx, read text (HTML or JSON) and throw
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Quote failed (${res.status}): ${errorText}`);
      }

      const quote = await res.json();
      document.getElementById('quoteResult').innerHTML = `
        <p><strong>Quote ID:</strong> ${quote.id}</p>
        <p><strong>Premium per month:</strong> R${quote.premium.toFixed(2)}</p>
        <p>Status: ${quote.status}</p>
      `;
      document.getElementById('iQuoteId').value = quote.id;

    } catch (err) {
      document.getElementById('quoteResult').innerText = `Error: ${err.message}`;
    }
  });

  // Issue Policy
  document.getElementById('issueForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const quoteId = document.getElementById('iQuoteId').value;
    try {
      const res = await fetch(`/api/quotes/${quoteId}/issue`, {
        method:  'POST',
        headers: { 'Authorization': token }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Issuance failed (${res.status}): ${errorText}`);
      }

      const result = await res.json();
      document.getElementById('issueResult').innerHTML = `
        <p>${result.message}</p>
        <p><strong>New Policy ID:</strong> ${result.policy.id}</p>
      `;
    } catch (err) {
      document.getElementById('issueResult').innerText = `Error: ${err.message}`;
    }
  });
});

