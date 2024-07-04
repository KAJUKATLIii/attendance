// Ensure QR Code library is loaded
const codeReader = new ZXing.BrowserMultiFormatReader();

let selectedSubject = '';

// Function to initialize video and QR code scanning
async function initializeScanner() {
    const videoElement = document.getElementById('video');
    try {
        // Get available video input devices
        const devices = await codeReader.listVideoInputDevices();
        if (devices.length === 0) {
            throw new Error('No video input devices found.');
        }

        // Use the first available device
        const selectedDeviceId = devices[0].deviceId;
        codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, error) => {
            if (result) {
                handleScanResult(result.text);
            }
            if (error) {
                console.error('Error decoding QR code:', error);
            }
        });
    } catch (error) {
        console.error('Error initializing QR code scanner:', error);
    }
}

// Handle scan result
function handleScanResult(data) {
    console.log('QR Code Data:', data);

    // Split data based on your QR code format
    // For example, assuming format: "name,branch"
    const [name, branch] = data.split(',');

    // Validate and send data to server
    if (name && branch && selectedSubject) {
        sendScanData({ name, branch, subject: selectedSubject });
    } else {
        console.error('Invalid QR code data format or no subject selected.');
    }
}

// Send scanned data to server
async function sendScanData(data) {
    try {
        const response = await fetch('/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            document.getElementById('response').innerText = result.message;
        } else {
            console.error('Error sending scan data:', result.error);
            document.getElementById('response').innerText = 'Failed to record attendance.';
        }
    } catch (error) {
        console.error('Network error:', error);
        document.getElementById('response').innerText = 'Network error. Please try again.';
    }
}

// Handle subject button clicks
document.querySelectorAll('.subject-button').forEach(button => {
    button.addEventListener('click', () => {
        selectedSubject = button.getAttribute('data-subject');
        document.querySelectorAll('.subject-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        console.log(`Selected Subject: ${selectedSubject}`);
    });
});

// Initialize the QR code scanner when the page loads
window.addEventListener('load', initializeScanner);
