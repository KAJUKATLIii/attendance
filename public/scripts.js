import jsQR from 'jsqr'; // Ensure jsqr is installed (`npm install jsqr`)

const fileInput = document.getElementById('fileInput');
const statusDiv = document.getElementById('status');
const scannerContainer = document.getElementById('scanner-container');

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const code = jsQR(imageData.data, img.width, img.height);

                if (code) {
                    const barcode = code.data;
                    statusDiv.innerText = `Barcode detected: ${barcode}`;
                    submitAttendance(barcode);
                } else {
                    statusDiv.innerText = 'No QR code or barcode found.';
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function submitAttendance(barcode) {
    const date = new Date().toISOString().split('T')[0];
    const branch = 'Default Branch'; // Update as necessary

    try {
        const response = await fetch('/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ barcode, date, branch })
        });

        const result = await response.json();
        if (response.ok) {
            statusDiv.innerText = result.message;
        } else {
            statusDiv.innerText = `Error: ${result.message}`;
        }
    } catch (error) {
        console.error('Error submitting attendance:', error);
        statusDiv.innerText = 'Error submitting attendance.';
    }
}
