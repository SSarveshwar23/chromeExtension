
from google.cloud import speech_v1p1beta1 as speech


def transcribe_audio(file_path, key_file):
    try:
        # Initialize Speech client using service account key
        client = speech.SpeechClient.from_service_account_file(key_file)

        # Read audio file
        with open(file_path, 'rb') as f:
            audio_data = f.read()

        # Configure audio file
        audio = speech.RecognitionAudio(content=audio_data)

        # Configure speech recognition settings
        config = speech.RecognitionConfig(
            sample_rate_hertz=44100,
            enable_automatic_punctuation=True,
            language_code='en-US'
        )

        # Perform speech recognition
        operation = client.long_running_recognize(config=config, audio=audio)
        response = operation.result()

        # Process response
        transcription = ""
        for result in response.results:
            transcription += result.alternatives[0].transcript + "\n"

        return transcription

    except FileNotFoundError as e:
        # Handle file not found error
        return f"File not found: {e}"

    except Exception as e:
        # Handle other exceptions
        return f"Error during transcription: {e}"