from flask import Blueprint
import yt_dlp
from pydub import AudioSegment
import os

extract_audio_bp = Blueprint('extract_audio_bp',__name__)

def download_youtube_audio(video_url, output_dir, output_filename):
    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Define the full output paths
    output_audio_path = os.path.join(output_dir, output_filename + '.mp3')
    temp_audio_path = os.path.join(output_dir, 'temp_audio.m4a')

    # Download audio stream from YouTube using yt-dlp
    ydl_opts = {
        'format': 'bestaudio[ext=m4a]/bestaudio',
        'outtmpl': temp_audio_path,
        'postprocessor_args': ['-ar', '16000'],  # Adjust sample rate if needed
        'quiet': True,  # Suppress the download messages
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

    # Convert to MP3 using pydub
    try:
        audio = AudioSegment.from_file(temp_audio_path)
        audio.export(output_audio_path, format="mp3")
    except Exception as e:
        print(f"Error during audio conversion: {e}")
        return None

    # Clean up the temporary file
    os.remove(temp_audio_path)
    print(output_audio_path)
    return output_audio_path