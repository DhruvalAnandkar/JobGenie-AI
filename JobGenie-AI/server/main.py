from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import pdfplumber
from pydantic import BaseModel
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
import requests
import numpy as np
from openai import OpenAI
import json
import traceback  # <-- added for detailed error logging

# Load environment variables
load_dotenv()

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = AsyncIOMotorClient(MONGO_URI)
db = mongo_client["jobgenie"]
resume_collection = db["resumes"]

# OpenAI setup
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in environment variables")

client = OpenAI(api_key=OPENAI_API_KEY)

# Adzuna setup
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_API_KEY = os.getenv("ADZUNA_APP_KEY")

if not ADZUNA_APP_ID or not ADZUNA_API_KEY:
    print("⚠️ Warning: Adzuna API credentials are missing or incomplete.")

# App initialization
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model
class CompanyRole(BaseModel):
    company: str
    role: str

# Utility functions
def get_embedding(text: str):
    try:
        response = client.embeddings.create(
            model="text-embedding-ada-002",
            input=[text],
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"OpenAI embedding error: {e}")
        return None

def cosine_similarity(vec1, vec2):
    a = np.array(vec1)
    b = np.array(vec2)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def fetch_job_description(query="full stack developer", location="USA"):
    url = "https://api.adzuna.com/v1/api/jobs/us/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_API_KEY,
        "what": query,
        "where": location,
        "results_per_page": 1,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        jobs = response.json().get("results", [])
        if jobs:
            return jobs[0].get("description", "No description available.")
    except Exception as e:
        print("Adzuna API error:", e)

    return "We are hiring a full stack developer with strong experience in React, FastAPI, and deployment."

def generate_job_description(company: str, role: str) -> str:
    prompt = (
        f"Generate a detailed job description for a {role} position at {company}. "
        "Include required skills, responsibilities, and qualifications."
    )
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI error: {e}")
        return f"Job description generation failed for {role} at {company}."

# Routes
@app.get("/")
def home():
    return {"message": "🚀 JobGenie AI Backend Running"}

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    try:
        if file.filename.lower().endswith(".pdf"):
            await file.seek(0)
            with pdfplumber.open(file.file) as pdf:
                resume_text = "".join(page.extract_text() or "" for page in pdf.pages)
        else:
            raw_bytes = await file.read()
            resume_text = raw_bytes.decode("utf-8")

        if not resume_text.strip():
            return {"error": "Resume text extraction failed or file is empty."}

        job_description = fetch_job_description()
        resume_embedding = get_embedding(resume_text)
        job_embedding = get_embedding(job_description)

        if not resume_embedding or not job_embedding:
            return {"error": "Failed to get embeddings."}

        score_percent = round(cosine_similarity(resume_embedding, job_embedding) * 100, 2)

        return {
            "resume_text": resume_text,
            "match_score": f"{score_percent}%",
            "job_description": job_description,
        }
    except Exception as e:
        print("Error in /upload-resume:", e)
        traceback.print_exc()  # <-- detailed stack trace
        return {"error": "Internal server error."}

@app.post("/upload-resume-multi/")
async def upload_resume_multi(
    companies_roles: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        print("🛠 Raw companies_roles string:", companies_roles)
        try:
            parsed = json.loads(companies_roles)
            companies_roles_list = [CompanyRole(**cr) for cr in parsed]
            print("✅ Parsed companies_roles:", companies_roles_list)
        except Exception as parse_err:
            print("JSON parse error:", parse_err)
            raise HTTPException(status_code=400, detail="Invalid companies_roles format")

        if file.filename.lower().endswith(".pdf"):
            await file.seek(0)
            with pdfplumber.open(file.file) as pdf:
                resume_text = "".join(page.extract_text() or "" for page in pdf.pages)
        else:
            raw_bytes = await file.read()
            resume_text = raw_bytes.decode("utf-8")

        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Empty or invalid resume.")

        print(f"📝 Processing resume file: {file.filename}")
        resume_embedding = get_embedding(resume_text)
        if resume_embedding is None:
            raise HTTPException(status_code=500, detail="Failed to embed resume.")

        results = []
        for cr in companies_roles_list:
            print(f"🔎 Generating job description for {cr.company} - {cr.role}")
            job_description = generate_job_description(cr.company, cr.role)
            job_embedding = get_embedding(job_description)

            if job_embedding is None:
                match_score = "N/A"
            else:
                score = cosine_similarity(resume_embedding, job_embedding)
                match_score = f"{round(score * 100, 2)}%"

            results.append({
                "company": cr.company,
                "role": cr.role,
                "job_description": job_description,
                "match_score": match_score,
                "timestamp": datetime.utcnow().isoformat()
            })

        # Save to MongoDB
        await resume_collection.insert_one({
            "file_name": file.filename,
            "resume_text": resume_text,
            "matches": results,
            "uploaded_at": datetime.utcnow()
        })

        print("✅ Successfully saved resume and matches to DB.")
        return {"resume_text": resume_text, "matches": results}

    except HTTPException as he:
        raise he
    except Exception as e:
        print("Error in /upload-resume-multi:", e)
        traceback.print_exc()  # <-- detailed stack trace here
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.get("/resume-history/")
async def get_resume_history():
    try:
        cursor = resume_collection.find().sort("uploaded_at", -1)
        history = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])  # convert ObjectId to string for JSON
            history.append(doc)
        return {"history": history}
    except Exception as e:
        print("Error fetching resume history:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to fetch resume history.")
