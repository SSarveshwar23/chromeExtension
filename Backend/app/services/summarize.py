import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def summarize(text):
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

    # Construct the prompt with additional instructions
    prompt = [
        "Summarize the given text and give the heaing has Summary",
        text
    ]

    try:
        # Initialize the generative model
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Generate content based on the provided prompt
        response = model.generate_content(prompt)
        
        # Extract the generated text from the response
        generated_text = response.text
        print(generated_text)
        return generated_text
    except Exception as e:
        # Handle errors by returning an appropriate message or the feedback prompt
        print(f"Error: {e}")
        return "An error occurred while processing the text."
