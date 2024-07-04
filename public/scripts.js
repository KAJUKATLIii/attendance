const { BrowserMultiFormatReader, NotFoundException } = ZXing;

const codeReader = new BrowserMultiFormatReader();
const videoElement = document.getElementById('video');
const responseElement = document.getElementById('response');

let currentSubject = '';

const startScanning = () => {
    codeReader.listVideoInputDevices()
        .then((videoInputDevices) => {
            const firstDeviceId = videoInputDevices[0].deviceId;
            codeReader.decodeFromVideoDevice(firstDeviceId, videoElement, (result, err) => {
                if (result) {
                    const barcode = result.text;
                    handleScanResult(barcode);
                }
                if (err && !(err instanceof NotFoundException)) {
                    console.error(err);
                }
            });
        })
        .catch((err) => {
            console.error(err);
        });
};

const handleScanResult = (barcode) => {
    console.log('Scanned Barcode:', barcode);
    // Display scanned barcode on the screen
    responseElement.textContent = `Scanned Barcode: ${barcode}`;

    // Send the barcode data to the server
    const data = {
        barcode: barcode,
        date: new Date().toISOString().split('T')[0],
        branch: currentSubject
    };

    fetch('/attendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        responseElement.textContent = `Attendance recorded successfully for Barcode: ${barcode}`;
    })
    .catch((error) => {
        console.error('Error:', error);
        responseElement.textContent = 'Failed to record attendance';
    });
};

const setSubject = (subject) => {
    currentSubject = subject;
};

document.querySelectorAll('.subject-button').forEach(button => {
    button.addEventListener('click', (event) => {
        setSubject(event.target.dataset.subject);
        responseElement.textContent = `Subject set to ${event.target.textContent}`;
    });
});

// Start scanning when the page loads
startScanning();
