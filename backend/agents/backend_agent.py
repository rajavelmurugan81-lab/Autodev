
from backend.llm.gemini_client import GeminiClient

async def generate_backend_code(parsed_story_json: str, stack_pref: str = "Node/Express") -> str:
    client = GeminiClient()

    stack = stack_pref or "Node/Express"
    
    prompt = f"""
    You are a Senior Backend Engineer.
    Generate a complete backend application file for the system described below.
    
    Tech Stack: {stack}
    
    Requirements:
    - If Node/Express: Generate `app.js` with express, body-parser.
    - If Flask: Generate `app.py`.
    - If FastAPI: Generate `app.py` with Pydantic models.
    - Assume a dummy in-memory DB or simple mocked responses.
    - Return ONLY the code (no markdown blocks).
    
    System Definition:
    {parsed_story_json}
    """
    response = await client.generate_content(prompt)
    
    cleaned = response.replace("```javascript", "").replace("```js", "").replace("```python", "").replace("```py", "").replace("```", "").strip()
    return cleaned

