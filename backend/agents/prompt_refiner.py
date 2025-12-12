
from backend.llm.gemini_client import GeminiClient

async def refine_prompt(story: str) -> str:
    client = GeminiClient()
    prompt = f"""
    You are an expert Product Manager.
    Refine and expand the following user story to be technical, clear, and complete. 
    Infer missing details logically. Return ONLY the refined story text.
    
    Original Story:
    {story}
    """
    return await client.generate_content(prompt)
