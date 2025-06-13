// client/src/components/GPTAnalysis.js
import React, { useState } from "react";
import axios from "axios";

function GPTAnalysis({ resumeText, jobDescription }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/gpt/analyze", {
        resume_text: resumeText,
        job_description: jobDescription,
      });

      setResult(response.data.analysis);
    } catch (error) {
      console.error("GPT analysis failed:", error);
      setResult("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg mt-4">
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Analyzing..." : "Analyze Fit with GPT"}
      </button>

      {result && (
        <div className="mt-4 whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
          {result}
        </div>
      )}
    </div>
  );
}

export default GPTAnalysis;
