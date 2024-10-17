document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop_zone');
  const downloadIcon = document.getElementById('download-icon');
  const generateButton = document.getElementById('generate-notes');
  const urlInput = document.getElementById('url_input');
  const buttons = document.querySelectorAll('.button:not(#summarize), .footer-button, .download-icon');

  buttons.forEach(button => {
    button.addEventListener('click', hidePreviewBox);
});

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
      generateButton.onclick = () => downloadNotes(url);
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
    const generateButton = document.getElementById('generate-notes');
    const downloadButton = document.getElementById('download-icon');
    const preloader = document.getElementById('loader')
    preloader.style.display='block'
    generateButton.textContent = "Generating notes";
    
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
        return response.json();
    })
    .then(data => {
        if (data && data.path) {
            // Example: Construct download URL based on the returned path
            const downloadUrl = `http://127.0.0.1:5000/download/${encodeURIComponent(data.path)}`;
            preloader.style.display='none'
            
            generateButton.innerHTML = `<img src="icons/tick_logo.png" alt="" class="tick_logo">
            Notes Generated<br>
            <p class='button-text'><span>(To regenerate notes press again)</span></p>`;

            downloadButton.style.display = "inline-block";
            
            downloadButton.addEventListener('click', () => {
                downloadButton.textContent = "Downloading...";
                
                // Example: Create an anchor element to trigger download
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `audio.txt`;
                a.click();
                
                downloadButton.textContent = "Download complete";
                
                // Revert text to "Download Notes" after 3 seconds
                setTimeout(() => {
                    downloadButton.textContent = "Download Notes";
                }, 3000);
            });
        } else {
            throw new Error('Path to file not provided');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        generateButton.textContent = "Generate Notes";
    });
}

function hidePreviewBox() {
  document.getElementById('preview-box').style.display = 'none';
}

function getVideoId(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
}
});


  document.getElementById('summarize').addEventListener('click', function() {
    // Replace with your backend API URL
    const apiUrl = 'http://127.0.0.1:5000/summarize';
  
    // Fetch summary from the backend
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // Include any necessary data for the summarization API
            text: 'Your text to be summarized'
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Network response was not ok');
            });
        }
        return response.json();
    })
    .then(data => {
        // Display the summary in the preview box
        document.getElementById('preview-box').style.display='block'
        document.getElementById('preview-box').textContent = data.summary;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('preview-box').textContent = 'Error retrieving summary: ' + error.message;
    });
  });
  


document.getElementById('Clear').addEventListener('click', () => {
  clearFields();
});

function clearFields() {
  document.getElementById('url_input').value = '';
  document.getElementById('drop_zone').innerText = 'Drag & Drop YouTube URL Here';
}

const pdfFilePath = 'http://127.0.0.1:5000/pdf'; 

    document.getElementById('previewButton').addEventListener('click', function() {
      document.getElementById('pdfPreview').src = pdfFilePath;
      document.getElementById('modalOverlay').style.display = 'block';
      document.getElementById('modalContent').style.display = 'block';
      document.body.classList.add('modal-open');
    });

    document.getElementById('closeButton').addEventListener('click', function() {
      document.getElementById('modalOverlay').style.display = 'none';
      document.getElementById('modalContent').style.display = 'none';
      document.body.classList.remove('modal-open');
    });

    document.getElementById('modalOverlay').addEventListener('click', function() {
      document.getElementById('modalOverlay').style.display = 'none';
      document.getElementById('modalContent').style.display = 'none';
      document.body.classList.remove('modal-open');
    });