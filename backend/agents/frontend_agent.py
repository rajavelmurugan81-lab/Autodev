
from backend.llm.gemini_client import GeminiClient

async def generate_frontend_code(parsed_story_json: str, stack_pref: str = "React") -> str:
    client = GeminiClient()
    
    stack = stack_pref or "React"
    
    prompt = f"""
    You are a Senior Frontend Engineer.
    Generate a main Feature component using {stack} and Tailwind CSS.
    
    Requirements:
    - If React: Return JSX/TSXCode. Export default function.
    - If Vue: Return Vue Single File Component (.vue) logic.
    - Implement the UI described.
    - Return ONLY the code.
    
    System Definition:
    {parsed_story_json}
    """
    response = await client.generate_content(prompt)
    return response.replace("```jsx", "").replace("```tsx", "").replace("```vue", "").replace("```html", "").replace("```", "").strip()
