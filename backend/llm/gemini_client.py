
import os
import google.generativeai as genai
from typing import Optional

# Configure Gemini
# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=api_key)

class GeminiClient:
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        self.model = genai.GenerativeModel(model_name)

    async def generate_content(self, prompt: str) -> str:
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            error_msg = f"// Error calling Gemini API: {str(e)}\n// Please check your API Key in .env and your Google Cloud quotas."
            print(error_msg)
            return error_msg
