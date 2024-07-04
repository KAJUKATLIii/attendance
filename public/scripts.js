const { BrowserMultiFormatReader, NotFoundException } = ZXing;

// Initialize ZXing
const codeReader = new BrowserMultiFormatReader();
const videoElement = document.getElementById('video');
const responseElement = document.getElementById('response');

// Start barcode scanning
const startScanner = () => {
    codeReader.decodeFromVideoDevice(null, videoElement, (result, error) => {
        if (result) {
            const barcode = result.text;
            const branch = 'BCA 2nd Yr'; // Replace with dynamic branch info if needed
            handleBarcode(barcode, branch);
        }
        if (error && !(error instanceof NotFoundException)) {
            console.error(error);
        }
    }).catch(err => console.error('Error:', err));
};

// Handle barcode data
const handleBarcode = async (barcode, branch) => {
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    try {
        const response = await fetch('/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ barcode, date, branch })
        });

        const result = await response.json();
        responseElement.textContent = result.message;
    } catch (error) {
        responseElement.textContent = 'An error occurred.';
    }
};

// Start the scanner when the page loads
window.onload = () => {
    startScanner();
};
