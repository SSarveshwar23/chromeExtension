import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def spell_corrector(text):
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

    # Construct the prompt with additional instructions
    prompt = [
        "Correct the spelling mistakes and grammar in the given text. Then divide the text into paragraphs, "
        "provide suitable headings for each paragraph, and also give a main heading for the entire text.",
        text
    ]

    try:
        # Initialize the generative model
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Generate content based on the provided prompt
        response = model.generate_content(prompt)
        
        # Extract the generated text from the response
        generated_text = response.text

        return generated_text
    except Exception as e:
        # Handle errors by returning an appropriate message or the feedback prompt
        print(f"Error: {e}")
        return "An error occurred while processing the text."
