# JobGenie AI – LLM-Powered Job Matcher

A full-stack AI-powered platform that intelligently matches your resume to job descriptions using OpenAI's GPT-4 and Embedding models. Built for students, developers, and recruiters looking for smart resume-job fit analysis with visual dashboards.

---

##  Features
 
-  **Smart Resume Upload** – Upload PDF, DOCX, or TXT resumes
-  **LLM-Powered Matching** – Uses OpenAI embeddings + GPT-4 for match scoring & feedback
-  **Interactive Dashboard** – View job match scores with visual charts (Recharts)
-  **AI Suggestions** – Recommends job roles, skill improvements, and optional cover letter generation

---

##  Tech Stack

| Layer        | Tech Used |
| ------------ | --------- |
| Frontend     | React.js, TailwindCSS, Recharts |
| Backend      | FastAPI (Python), Uvicorn |
| AI/LLM       | OpenAI GPT-4 / Embeddings, LangChain |
| Database     | MongoDB Atlas |
| Deployment   | Render (backend), Vercel (frontend) |
| Optional     | Pinecone, Stripe API, Firebase Auth |

---

##  Live Demo

 **Frontend**: [job-genie-ai.vercel.app](https://job-genie-ai-five.vercel.app)  
 **Backend API**: [jobgenie-ai.onrender.com](https://jobgenie-ai.onrender.com)

---

##  Folder Structure

jobgenie-ai/
├── client/ # React Frontend
│ ├── components/
│ ├── pages/
│ └── services/
├── server/ # FastAPI Backend
│ ├── routes/
│ ├── embeddings/
│ └── models/
├── .github/workflows/ # GitHub Actions (CI/CD)
├── Dockerfile
├── README.md # You’re here!


---

##  Setup Instructions

### 1. Clone the Repository


git clone https://github.com/DhruvalAnandkar/JobGenie-AI.git
cd jobgenie-ai
2. Frontend Setup (client/)

cd client
npm install
npm run dev   # or npm run build && npm start for production
3. Backend Setup (server/)

cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
Create a .env file for your OpenAI API key, MongoDB URI, etc.

How It Works
User uploads resume

Job descriptions are parsed via API or entered

OpenAI Embeddings compare skills between resume and job

Match score + LLM explanation is generated

Results visualized via bar charts and match cards

Contributing
Pull requests are welcome! If you'd like to improve UI, add GPT agents, or connect new job APIs—feel free to contribute. 🤗

Contact
Dhruval Anandkar
dhruvalabroad@gmail.com
LinkedIn | GitHub

Future Roadmap
LinkedIn/Indeed real-time job scraping

Cover letter + email pitch generator

Resume rewrite tool

🌍 Multi-language support

Built with ❤️ by a student for students and job seekers worldwide 🌐
