document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop_zone');
  const downloadIcon = document.getElementById('download-icon');
  const urlInput = document.getElementById('url_input');

  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');

    const data = event.dataTransfer.getData('text/plain');
    urlInput.value = data;
    handleYouTubeURL(data);
  });

  urlInput.addEventListener('input', () => {
    handleYouTubeURL(urlInput.value);
  });

  function handleYouTubeURL(url) {
    if (isValidYouTubeUrl(url)) {
      downloadIcon.style.display = 'inline-block';
      displayThumbnail(url);
      downloadIcon.onclick = () => downloadNotes(url);
    } else {
      alert('Invalid YouTube URL');
      downloadIcon.style.display = 'none';
      dropZone.innerHTML = 'Drag & Drop YouTube URL Here';
    }
  }

  function isValidYouTubeUrl(url) {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  }

  function displayThumbnail(url) {
    const videoId = getVideoId(url);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const img = document.createElement('img');
    img.src = thumbnailUrl;
    img.alt = 'YouTube Thumbnail';
    dropZone.innerHTML = '';
    dropZone.appendChild(img);
  }

    function downloadNotes(url) {
        fetch('http://127.0.0.1:5000/api/extract_audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Receive response as JSON
        })
        .then(data => {
            if (data && data.path) {
                // Example: Construct download URL based on the returned path
                const downloadUrl = `http://127.0.0.1:5000/download/${encodeURIComponent(data.path)}`;

                // Example: Create an anchor element to trigger download
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `audio.txt`; // Set desired file name or extract from the path
                console.log('About to click the download link');
                a.click();
                console.log('Download link clicked');
            } else {
                throw new Error('Path to file not provided');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function getVideoId(url) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
    }
});
