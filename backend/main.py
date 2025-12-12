
import asyncio
import uuid
import json
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, HTTPException
from fastapi.responses import Response, JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.orchestrator.coordinator import run_pipeline
from backend.orchestrator.job_store import job_store
from backend.utils.bundler import create_bundle
from backend.agents.legacy_agent import analyze_legacy_code

app = FastAPI(title="AutoDev CAP API")

# Allow CORS for main frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StackPreferences(BaseModel):
    frontend: str = "React"
    backend: str = "Node/Express"
    database: str = "PostgreSQL"

class RunRequest(BaseModel):
    story: str
    stack_preferences: StackPreferences = StackPreferences()

class RegenerateRequest(BaseModel):
    job_id: str

@app.post("/api/run")
async def start_run(request: RunRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    job_store.create_job(job_id)
    # Store preferences in job
    job_store.save_stack_preferences(job_id, request.stack_preferences.dict())
    
    background_tasks.add_task(run_pipeline, job_id, request.story, request.stack_preferences.dict())
    return {"job_id": job_id}

@app.post("/api/regenerate/{component}")
async def regenerate_component_endpoint(component: str, request: RegenerateRequest, background_tasks: BackgroundTasks):
    # component: backend, frontend, tests
    job = job_store.get_job(request.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    from backend.orchestrator.coordinator import regenerate_step
    background_tasks.add_task(regenerate_step, request.job_id, component)
    return {"status": "started", "job_id": request.job_id, "component": component}

@app.get("/api/status/{job_id}")
async def get_status(job_id: str):
    job = job_store.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.get("/api/result/{job_id}")
async def get_result(job_id: str):
    try:
        data = create_bundle(job_id)
        return Response(
            content=data,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=generated_feature_{job_id}.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/api/legacy/analyze")
async def analyze_legacy(file: UploadFile = File(...)):
    content = await file.read()
    decoded_content = content.decode("utf-8")
    analysis = await analyze_legacy_code(decoded_content)
    # Return JSON directly
    try:
        return json.loads(analysis)
    except:
        return {"raw_analysis": analysis}

@app.get("/")
def health_check():
    return {"status": "ok", "service": "AutoDev CAP"}
