
from backend.llm.gemini_client import GeminiClient
import json

async def analyze_legacy_code(code_content: str) -> str:
    client = GeminiClient()
    prompt = f"""
    You are a Legacy Code Specialist.
    Analyze the following code file and return a JSON summary.
    Return ONLY valid JSON.

    Key fields:
    - framework
    - routes (list of paths)
    - db (database type/library)
    - integration_strategy (suggestion on how to add new features)

    Code Content:
    {code_content}
    """
    response = await client.generate_content(prompt)
    cleaned = response.replace("```json", "").replace("```", "").strip()
    return cleaned
