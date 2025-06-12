from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from embedding import get_resume_embedding  # reuse your embedding function
import numpy as np

router = APIRouter()

# Sample job data (replace with real data later)
jobs = [
    {
        "id": "job1",
        "title": "Machine Learning Engineer",
        "description": "Develop and deploy machine learning models using Python, TensorFlow, and PyTorch. Experience with data pipelines and cloud services.",
        "location": "Remote"
    },
    {
        "id": "job2",
        "title": "Frontend Developer",
        "description": "Build responsive web apps using React.js, Tailwind CSS, and REST APIs. Strong knowledge of JavaScript and UI/UX best practices.",
        "location": "San Francisco, CA"
    },
    # add more sample jobs here...
]

# We'll precompute embeddings for these jobs at startup
job_embeddings = {}

@router.on_event("startup")
async def compute_job_embeddings():
    for job in jobs:
        embedding = get_resume_embedding(job["description"])
        job_embeddings[job["id"]] = embedding

class JobMatchRequest(BaseModel):
    resume_embedding: List[float]
    top_k: int = 3

def cosine_similarity(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

@router.post("/match_jobs")
async def match_jobs(request: JobMatchRequest):
    similarities = []
    for job in jobs:
        job_emb = job_embeddings[job["id"]]
        score = cosine_similarity(request.resume_embedding, job_emb)
        similarities.append({
            "job": job,
            "score": float(score)
        })
    # Sort jobs by similarity descending
    similarities.sort(key=lambda x: x["score"], reverse=True)
    return similarities[:request.top_k]
