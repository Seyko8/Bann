const video = document.getElementById('video');
const captureButton = document.getElementById('capture');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Kamera konnte nicht aktiviert werden:', err);
    });

captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'snapshot.png');

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert('Bild erfolgreich gesendet!');
            } else {
                alert('Fehler beim Senden des Bildes.');
            }
        })
        .catch(error => {
            console.error('Fehler beim Senden des Bildes:', error);
        });
    }, 'image/png');
});