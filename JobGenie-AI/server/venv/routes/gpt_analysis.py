from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os

router = APIRouter()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable missing")

client = OpenAI(api_key=api_key)

class GPTAnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/analyze")
async def gpt_analyze(data: GPTAnalyzeRequest):
    prompt = f"""
You are a career advisor. Given the candidate's resume and a job description, provide:
1. Summary of how well the candidate fits the job.
2. Skills missing from the resume compared to the job description.
3. Suggestions to improve the resume or chances.

Resume:
{data.resume_text}

Job Description:
{data.job_description}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7
        )
        analysis = response.choices[0].message.content
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
