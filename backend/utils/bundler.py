
import zipfile
import io
import json
from backend.orchestrator.job_store import job_store

def create_bundle(job_id: str) -> bytes:
    job = job_store.get_job(job_id)
    if not job:
        raise ValueError("Job not found")

    artifacts = job.get("artifacts", {})
    stack_prefs = job.get("stack_preferences", {})
    
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for filename, content in artifacts.items():
            if isinstance(content, (dict, list)):
                content = json.dumps(content, indent=2)
            zip_file.writestr(filename, str(content))
            
        # Add README.md
        readme_content = f"""# Generated Project
        
## Stack
- Frontend: {stack_prefs.get('frontend', 'React')}
- Backend: {stack_prefs.get('backend', 'Node/Express')}
- Database: {stack_prefs.get('database', 'PostgreSQL')}

## Instructions
1. Unzip the file
2. Read the source code in `backend` and `frontend` folders.
"""
        zip_file.writestr("README.md", readme_content)
    
    return zip_buffer.getvalue()
