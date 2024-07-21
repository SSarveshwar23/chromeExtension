import os
from flask import Blueprint,jsonify, request, send_file, send_from_directory
from flask import send_file
from ..services.extract_audio import download_youtube_audio
from ..services.api_call import transcribe_audio
from ..services.spell_corrector import spell_corrector
from ..services.pdf_converter import text_to_pdf
from ..services.summarize import summarize

main_bp = Blueprint('main', __name__)

base_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(base_dir)

@main_bp.route('/api/extract_audio', methods=['POST'])
def extract_audio():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    try:
        output_directory = os.path.join(parent_dir, 'services')
        output_filename = 'audio'
        key_path = os.path.join(parent_dir, 'key.json')
        output_path = download_youtube_audio(url,output_directory,output_filename)
        print(output_path)
        transcription = transcribe_audio(output_path, key_path)
        print(transcription)
        text = spell_corrector(transcription)
        print(text)
        output_text_file = os.path.join(parent_dir, 'static','transcription.txt')
        with open(output_text_file, 'w') as f:
           f.write(text)
        print(f"Transcription saved to {output_text_file}")
        output_pdf_file = os.path.join(parent_dir, 'static','transcription.pdf')
        text_to_pdf(output_text_file,output_pdf_file)
        response_data = {
        "path": output_pdf_file
        }

        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@main_bp.route('/download/<path:filename>')
def download_file(filename):
    return send_file(filename, as_attachment=True)

@main_bp.route('/summarize', methods=['POST'])
def summarize_txt():
    
    text_path = os.path.join(parent_dir, 'static', 'transcription.txt')
    text_path = text_path.replace("\\","/")
    print(text_path)
    with open(text_path,'r') as f:
        text = f.read()
    summary=summarize(text)
    # Perform summarization (this is just a placeholder logic)
    return jsonify({'summary': summary})

@main_bp.route('/pdf')    
def serve_pdf():
    return send_from_directory('static','transcription.pdf')
