import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import openai

from routes import job_descriptions
from routes import gpt_analysis
from routes import similarity
from parser import extract_resume_text
from embedding import get_resume_embedding

load_dotenv()  # load .env file

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Register routers with correct prefixes
app.include_router(job_descriptions.router, prefix="/jobs", tags=["jobs"])
app.include_router(gpt_analysis.router, prefix="/gpt", tags=["gpt"])
app.include_router(similarity.router, prefix="/similarity", tags=["similarity"])

# Allow requests from React (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "JobGenie AI Backend is running!"}

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_resume_text(contents, file.filename)
    embedding = get_resume_embedding(text)

    return {
        "filename": file.filename,
        "size_bytes": len(contents),
        "extracted_text": text[:500],
        "embedding_sample": embedding[:5]
    }

# Add GPT analysis here or inside your gpt_analysis router file
class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

@app.post("/gpt/analyze")
async def analyze_fit(data: AnalysisRequest):
    prompt = (
        f"Analyze this resume:\n{data.resume_text}\n\n"
        f"Job Description:\n{data.job_description}\n\n"
        "Provide a detailed fit analysis."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # Or "gpt-4" or "gpt-3.5-turbo"
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7,
        )
        analysis = response['choices'][0]['message']['content']
        return {"analysis": analysis}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
