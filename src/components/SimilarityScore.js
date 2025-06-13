// client/src/components/SimilarityScore.js
import React, { useState } from "react";
import axios from "axios";

const SimilarityScore = ({ resumeText, jobDescription }) => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckSimilarity = async () => {
    if (!resumeText || !jobDescription) {
      alert("Please upload resume and enter/select job description.");
      return;
    }

    console.log("Resume Text:", resumeText);
    console.log("Job Description:", jobDescription); // Should be a string

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/similarity/score", {
        resume_text: resumeText,
        job_description: jobDescription,  // <-- pass string directly here
      });

      setScore(response.data.score);
    } catch (error) {
      console.error("Error fetching similarity score:", error);
      alert("Error calculating similarity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleCheckSimilarity}
        disabled={loading}
      >
        {loading ? "Calculating..." : "Check Similarity Score"}
      </button>

      {score !== null && (
        <div className="mt-2 text-lg font-semibold text-green-700">
          Similarity Score: {score}%
        </div>
      )}
    </div>
  );
};

export default SimilarityScore;
