
import json
import os
from typing import Dict, Any, Optional

JOBS_DIR = "jobs_data"

class JobStore:
    def __init__(self):
        self.jobs: Dict[str, Dict[str, Any]] = {}
        if not os.path.exists(JOBS_DIR):
            os.makedirs(JOBS_DIR)
        self._load_jobs()

    def _load_jobs(self):
        # simple load from disk
        for filename in os.listdir(JOBS_DIR):
            if filename.endswith(".json"):
                job_id = filename.replace(".json", "")
                with open(os.path.join(JOBS_DIR, filename), "r") as f:
                    try:
                        self.jobs[job_id] = json.load(f)
                    except:
                        pass

    def _save_job(self, job_id: str):
        if job_id in self.jobs:
            with open(os.path.join(JOBS_DIR, f"{job_id}.json"), "w") as f:
                json.dump(self.jobs[job_id], f, indent=2)

    def create_job(self, job_id: str):
        self.jobs[job_id] = {
            "status": "RUNNING",
            "steps": [],
            "logs": {},
            "artifacts": {},
            "parsed_json": None,
            "stack_preferences": {}
        }
        self._save_job(job_id)

    def update_step(self, job_id: str, step_name: str, status: str):
        if job_id not in self.jobs:
            return
        
        # Check if step exists
        existing_step = next((s for s in self.jobs[job_id]["steps"] if s["name"] == step_name), None)
        if existing_step:
            existing_step["status"] = status
        else:
            self.jobs[job_id]["steps"].append({"name": step_name, "status": status})
        self._save_job(job_id)

    def add_log(self, job_id: str, step_name: str, message: str):
        if job_id in self.jobs:
            self.jobs[job_id]["logs"][step_name] = message
            self._save_job(job_id)

    def add_artifact(self, job_id: str, filename: str, content: str):
        if job_id in self.jobs:
            self.jobs[job_id]["artifacts"][filename] = content
            self._save_job(job_id)

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        return self.jobs.get(job_id)

    def set_job_status(self, job_id: str, status: str):
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = status
            self._save_job(job_id)

    def save_stack_preferences(self, job_id: str, prefs: dict):
        if job_id in self.jobs:
            self.jobs[job_id]["stack_preferences"] = prefs
            self._save_job(job_id)

    def save_parsed_json(self, job_id: str, parsed: dict):
        if job_id in self.jobs:
            self.jobs[job_id]["parsed_json"] = parsed
            self._save_job(job_id)

# Global instance
job_store = JobStore()
