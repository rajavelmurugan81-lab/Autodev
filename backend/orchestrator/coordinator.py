
import asyncio
from backend.agents.prompt_refiner import refine_prompt
from backend.agents.story_parser import parse_story
from backend.agents.db_schema_agent import generate_schema
from backend.agents.backend_agent import generate_backend_code
from backend.agents.frontend_agent import generate_frontend_code
from backend.agents.test_agent import generate_tests
from backend.orchestrator.job_store import job_store


from backend.agents.code_quality_agent import analyze_code_quality

async def run_pipeline(job_id: str, raw_story: str, stack_prefs: dict = None):
    if stack_prefs is None:
        stack_prefs = {}

    try:
        # Step 1: Prompt Refinement
        job_store.update_step(job_id, "PromptRefiner", "RUNNING")
        refined_story = await refine_prompt(raw_story)
        job_store.add_log(job_id, "PromptRefiner", f"Refined story: {refined_story[:50]}...")
        job_store.add_artifact(job_id, "refined_story.md", refined_story)
        job_store.update_step(job_id, "PromptRefiner", "DONE")

        # Step 2: Story Parsing
        job_store.update_step(job_id, "StoryParser", "RUNNING")
        parsed_json = await parse_story(refined_story)
        job_store.save_parsed_json(job_id, parsed_json)
        job_store.add_log(job_id, "StoryParser", f"Parsed JSON length: {len(str(parsed_json))}")
        job_store.update_step(job_id, "StoryParser", "DONE")

        # Step 3: DB Schema
        job_store.update_step(job_id, "DBSchemaAgent", "RUNNING")
        db_stack = stack_prefs.get("database", "PostgreSQL")
        schema_code = await generate_schema(parsed_json, db_stack)
        
        schema_ext = "sql"
        if "Mongo" in db_stack:
            schema_ext = "js"
            
        job_store.add_artifact(job_id, f"schema.{schema_ext}", schema_code)
        job_store.update_step(job_id, "DBSchemaAgent", "DONE")

        # Step 4: Backend
        job_store.update_step(job_id, "BackendAgent", "RUNNING")
        backend_code = await generate_backend_code(parsed_json, stack_prefs.get("backend"))
        
        # Determine filename based on stack
        be_filename = "backend/app.js"
        if "Flask" in stack_prefs.get("backend", "") or "FastAPI" in stack_prefs.get("backend", ""):
             be_filename = "backend/app.py"
             
        job_store.add_artifact(job_id, be_filename, backend_code)
        job_store.update_step(job_id, "BackendAgent", "DONE")

        # Step 5: Frontend
        job_store.update_step(job_id, "FrontendAgent", "RUNNING")
        frontend_code = await generate_frontend_code(parsed_json, stack_prefs.get("frontend"))
        
        fe_filename = "frontend/Feature.jsx"
        if "Vue" in stack_prefs.get("frontend", ""):
            fe_filename = "frontend/Feature.vue"
            
        job_store.add_artifact(job_id, fe_filename, frontend_code)
        job_store.update_step(job_id, "FrontendAgent", "DONE")

        # Step 6: Testing
        job_store.update_step(job_id, "TestAgent", "RUNNING")
        backend_stack = stack_prefs.get("backend", "Node/Express")
        test_code = await generate_tests(parsed_json, backend_stack)
        
        test_filename = "tests/feature.test.js"
        if "Flask" in backend_stack or "FastAPI" in backend_stack:
            test_filename = "tests/test_feature.py"
            
        job_store.add_artifact(job_id, test_filename, test_code)
        job_store.update_step(job_id, "TestAgent", "DONE")
        
        # Step 7: Code Quality
        job_store.update_step(job_id, "CodeQualityAgent", "RUNNING")
        
        # Gather all artifacts for analysis (excluding quality report itself if it exists)
        current_job = job_store.get_job(job_id)
        artifacts_to_analyze = {k: v for k, v in current_job.get("artifacts", {}).items() if not k.endswith(".md")}
        
        quality_report_json = await analyze_code_quality(artifacts_to_analyze)
        job_store.add_artifact(job_id, "quality_report.json", quality_report_json)
        job_store.update_step(job_id, "CodeQualityAgent", "DONE")

        job_store.set_job_status(job_id, "COMPLETED")

    except Exception as e:
        job_store.set_job_status(job_id, "FAILED")
        job_store.add_log(job_id, "ERROR", str(e))
        print(f"Pipeline Error: {e}")

async def regenerate_step(job_id: str, component: str):
    job = job_store.get_job(job_id)
    if not job:
        print(f"Job {job_id} not found for regeneration")
        return

    parsed_json = job.get("parsed_json")
    if not parsed_json:
        print(f"Parsed JSON not found for job {job_id}")
        return

    stack_prefs = job.get("stack_preferences", {})

    try:
        if component == "backend":
            job_store.update_step(job_id, "BackendAgent", "RUNNING")
            backend_code = await generate_backend_code(parsed_json, stack_prefs.get("backend"))
            
            be_filename = "backend/app.js"
            if "Flask" in stack_prefs.get("backend", "") or "FastAPI" in stack_prefs.get("backend", ""):
                 be_filename = "backend/app.py"
                 
            job_store.add_artifact(job_id, be_filename, backend_code)
            job_store.update_step(job_id, "BackendAgent", "DONE")
            
        elif component == "frontend":
            job_store.update_step(job_id, "FrontendAgent", "RUNNING")
            frontend_code = await generate_frontend_code(parsed_json, stack_prefs.get("frontend"))
            
            fe_filename = "frontend/Feature.jsx"
            if "Vue" in stack_prefs.get("frontend", ""):
                fe_filename = "frontend/Feature.vue"
                
            job_store.add_artifact(job_id, fe_filename, frontend_code)
            job_store.update_step(job_id, "FrontendAgent", "DONE")

        elif component == "tests":
            job_store.update_step(job_id, "TestAgent", "RUNNING")
            test_code = await generate_tests(parsed_json, stack_prefs.get("backend"))
            job_store.add_artifact(job_id, "tests/feature_test.js", test_code)
            job_store.update_step(job_id, "TestAgent", "DONE")

    except Exception as e:
        job_store.add_log(job_id, "ERROR", f"Regeneration failed: {e}")

