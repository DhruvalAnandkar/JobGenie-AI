import React, { useState } from "react";
import UploadResume from "./components/UploadResume";
import GPTAnalysis from "./components/GPTAnalysis";
import JobRankings from "./components/JobRankings";
import SimilarityScore from "./components/SimilarityScore";



function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  return (
    <div className="App p-4 max-w-4xl mx-auto">
      <UploadResume setResumeText={setResumeText} />
      
      {/* For now, set jobDescription manually (later we’ll use a job picker) */}
      <textarea
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full border mt-4 p-2 rounded"
        rows={6}
      />

      <GPTAnalysis
        resumeText={resumeText}
        jobDescription={jobDescription}
      />
      <JobRankings resumeText={resumeText} />
      <SimilarityScore resumeText={resumeText} jobDescription={jobDescription} />


    </div>
    
  );
}

export default App;
