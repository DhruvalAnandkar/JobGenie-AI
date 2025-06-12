from fastapi import APIRouter, HTTPException, Request
from embedding import get_resume_embedding, get_job_embedding
from utils import cosine_similarity
from db import db  # Your MongoDB client (make sure it's initialized properly)

router = APIRouter()

@router.post("/score")
async def similarity_score(request: Request):
    try:
        # Log incoming request
        data = await request.json()
        print("🔥 Received JSON Payload:", data)

        # Extract and validate data
        resume_text = data.get("resume_text", "").strip()
        job_description = data.get("job_description", "").strip()

        if not resume_text or not job_description:
            raise HTTPException(status_code=400, detail="Missing resume_text or job_description")

        # Log before embedding
        print("🧠 Generating embeddings...")
        resume_embedding = get_resume_embedding(resume_text)
        job_embedding = get_job_embedding(job_description)

        # Calculate score
        score = cosine_similarity(resume_embedding, job_embedding) * 100
        final_score = round(score, 2)

        # Prepare result object
        result = {
            "resume_text": resume_text,
            "job_description": job_description,
            "score": final_score
        }

        # Log before DB insert
        print("💾 Inserting into MongoDB...")
        insert_result = await db["similarity_scores"].insert_one(result)
        print("✅ Inserted document ID:", insert_result.inserted_id)

        return {"score": final_score}

    except Exception as e:
        print("❌ Error in /score route:", e)
        raise HTTPException(status_code=500, detail=str(e))
