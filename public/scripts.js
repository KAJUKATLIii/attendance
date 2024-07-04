const codeReader = new ZXing.BrowserQRCodeReader();
const videoElement = document.getElementById('video');
const responseElement = document.getElementById('response');
let selectedSubject = '';

// Event listener for subject buttons
document.querySelectorAll('.subject-button').forEach(button => {
    button.addEventListener('click', function() {
        selectedSubject = this.getAttribute('data-subject');
        document.querySelectorAll('.subject-button').forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        responseElement.innerText = `Selected Subject: ${selectedSubject}`;
    });
});

// Function to start scanning
function startScanning() {
    codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
        if (result) {
            const scannedData = JSON.parse(result.text);

            if (selectedSubject) {
                fetch('/scan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: scannedData.name,
                        branch: scannedData.branch,
                        subject: selectedSubject
                    })
                })
                .then(response => response.json())
                .then(data => {
                    responseElement.innerText = data.message;
                })
                .catch(error => {
                    console.error('Error:', error);
                    responseElement.innerText = 'Failed to record attendance';
                });
            } else {
                responseElement.innerText = 'Please select a subject first.';
            }
        }
        if (err) {
            console.error
