document.getElementById('barcode').addEventListener('input', function(event) {
    if (event.target.value.length >= 10) { // Adjust length as needed
        submitAttendance();
    }
});

async function submitAttendance() {
    const barcode = document.getElementById('barcode').value;
    if (!barcode) {
        document.getElementById('response').textContent = 'Please scan a barcode.';
        return;
    }

    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    try {
        const response = await fetch('/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ barcode, date })
        });

        const result = await response.json();
        document.getElementById('response').textContent = result.message;
        document.getElementById('barcode').value = ''; // Clear input field
    } catch (error) {
        document.getElementById('response').textContent = 'An error occurred.';
    }
}
