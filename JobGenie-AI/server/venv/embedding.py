from dotenv import load_dotenv
import os
from openai import OpenAI

# Load .env file from the same directory as this script
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in environment variables.")

client = OpenAI(api_key=api_key)

def get_resume_embedding(text: str):
    # Guard against empty input
    if not text.strip():
        raise ValueError("Input text for embedding is empty.")
    
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    embedding = response.data[0].embedding
    return embedding

def get_job_embedding(text: str):
    # Same logic as get_resume_embedding, separate for clarity
    if not text.strip():
        raise ValueError("Input text for embedding is empty.")
    
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    embedding = response.data[0].embedding
    return embedding
