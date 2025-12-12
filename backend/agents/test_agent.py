
from backend.llm.gemini_client import GeminiClient

async def generate_tests(parsed_story_json: str, backend_stack: str = "Node/Express") -> str:
    client = GeminiClient()

    stack = backend_stack or "Node/Express"
    
    prompt = f"""
    You are a QA Engineer.
    Generate a functional test file for the API described.
    
    Backend Stack: {stack}
    
    Requirements:
    - If Node/Express: Generate Jest test file (`feature.test.js`).
    - If Python (Flask/FastAPI): Generate Pytest file (`test_feature.py`).
    - Return ONLY the code.
    
    System Definition:
    {parsed_story_json}
    """
    response = await client.generate_content(prompt)
    return response.replace("```javascript", "").replace("```js", "").replace("```python", "").replace("```py", "").replace("```", "").strip()

    return response.replace("```javascript", "").replace("```js", "").replace("```", "").strip()
