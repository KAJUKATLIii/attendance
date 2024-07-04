document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const scanButton = document.getElementById('scan-button');
    const responseDiv = document.getElementById('response');

    let codeReader = new ZXing.BrowserBarcodeReader();
    
    codeReader.listVideoInputDevices().then((videoInputDevices) => {
        const firstDeviceId = videoInputDevices[0].deviceId;
        codeReader.decodeOnceFromVideoDevice(firstDeviceId, 'video').then((result) => {
            handleScanResult(result.text);
        }).catch((err) => {
            console.error(err);
            responseDiv.innerText = 'Error scanning QR code.';
        });
    }).catch((err) => {
        console.error(err);
    });

    scanButton.addEventListener('click', () => {
        const barcode = responseDiv.innerText; // Barcode/QR code result is displayed in responseDiv
        const subject = document.querySelector('.subject-button.active')?.dataset.subject;

        if (!barcode || !subject) {
            alert('Please scan a barcode and select a subject.');
            return;
        }

        const branch = 'Your Branch Name'; // Replace this with actual branch name

        fetch('/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ barcode, branch, date: new Date().toISOString().split('T')[0], subject })
        })
        .then(response => response.json())
        .then(data => {
            responseDiv.innerText = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
            responseDiv.innerText = 'Error recording attendance.';
        });
    });

    document.querySelectorAll('.subject-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.subject-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    function handleScanResult(resultText) {
        responseDiv.innerText = `Scanned Barcode/QR Code: ${resultText}`;
        // You may call the scan button handler or any other function if required here
    }
});
