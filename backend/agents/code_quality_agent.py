
from backend.llm.gemini_client import GeminiClient
import json

async def analyze_code_quality(files: dict) -> str:
    client = GeminiClient()
    
    # helper to format file content
    files_str = "\n".join([f"--- {name} ---\n{content}\n" for name, content in files.items()])

    prompt = f"""
    You are a Code Quality and Security Auditor.
    Analyze the following generated code files and provide a quality assessment.
    
    Return a JSON object with the following structure:
    {{
        "maintainability_score": 0-10,
        "readability_score": 0-10,
        "security_score": 0-10,
        "recommendations": [
            "rec 1",
            "rec 2"
        ],
        "summary": "Short summary of the quality..."
    }}

    Code Files:
    {files_str}
    
    Return ONLY valid JSON.
    """
    
    response = await client.generate_content(prompt)
    cleaned = response.replace("```json", "").replace("```", "").strip()
    return cleaned
