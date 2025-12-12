
from backend.llm.gemini_client import GeminiClient
import json

async def parse_story(refined_story: str) -> str:
    client = GeminiClient()
    prompt = f"""
    You are a System Architect.
    Parse the following story into a strict JSON structure describing the system.
    Return ONLY valid JSON, no markdown formatting.
    
    Story:
    {refined_story}
    
    Structure:
    {{
      "ui_components": [
        {{ "type": "form|list|dashboard", "name": "ComponentName", "fields": ["field1", "field2"] }}
      ],
      "api_endpoints": [
        {{ "method": "GET|POST|PUT|DELETE", "path": "/path", "operation": "operationName" }}
      ],
      "entities": [
        {{ "name": "EntityName", "fields": {{ "fieldName": "type" }} }}
      ],
      "validation_rules": ["rule1", "rule2"]
    }}
    """
    response = await client.generate_content(prompt)
    # Clean up potentially markdown formatted JSON
    cleaned = response.replace("```json", "").replace("```", "").strip()
    return cleaned
