document.addEventListener('DOMContentLoaded', () => {
  const underwritingForm = document.getElementById('underwritingForm');
  const resultDiv = document.getElementById('underwritingResult');

  if (underwritingForm) {
    underwritingForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const policyData = {
        // Gather necessary inputs from your form
        field1: document.getElementById('field1').value,
        field2: document.getElementById('field2').value
      };
      
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/underwriting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ policyData })
        });
        const data = await res.json();
        resultDiv.innerHTML = `<p>Risk Score: ${data.riskScore}</p><p>Decision: ${data.decision}</p>`;
      } catch (err) {
        resultDiv.innerText = 'Error running underwriting analysis.';
      }
    });
  }
});

