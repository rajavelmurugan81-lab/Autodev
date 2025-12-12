
from backend.llm.gemini_client import GeminiClient

async def generate_schema(parsed_story_json: str, stack_pref: str = "PostgreSQL") -> str:
    client = GeminiClient()

    stack = stack_pref or "PostgreSQL"
    
    prompt = f"""
    You are a Database Administrator.
    Generate a database schema for the system definition.
    
    Tech Stack: {stack}
    
    Requirements:
    - If PostgreSQL/MySQL: Return SQL `CREATE TABLE` statements.
    - If MongoDB: Return Mongoose schema definitions (JavaScript).
    - Return ONLY the code.
    
    System Definition:
    {parsed_story_json}
    """
    response = await client.generate_content(prompt)
    return response.replace("```sql", "").replace("```javascript", "").replace("```js", "").replace("```", "").strip()

    return response.replace("```sql", "").replace("```", "").strip()
