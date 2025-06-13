// client/src/components/JobRankings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import jobList from "../data/job_data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function JobRankings({ resumeText }) {
  const [rankedJobs, setRankedJobs] = useState([]);

  const getRankings = async () => {
    try {
      const scoresPromises = jobList.map(async (job) => {
        const response = await axios.post("http://localhost:8000/similarity/score", {
          resume_text: resumeText,
          job_description: job.description,
        });
        return { ...job, score: response.data.score };
      });

      const jobsWithScores = await Promise.all(scoresPromises);
      jobsWithScores.sort((a, b) => b.score - a.score);
      setRankedJobs(jobsWithScores);
    } catch (err) {
      console.error("Ranking failed", err);
    }
  };

  useEffect(() => {
    if (resumeText) getRankings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeText]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Top Job Matches</h2>

      {/* TEXT LIST OF JOB MATCHES */}
      {rankedJobs.map((job, index) => (
        <div key={job.title} className="p-4 border rounded mb-2 shadow bg-white">
          <p className="font-semibold">
            {index + 1}. {job.title}
          </p>
          <p className="text-gray-600">Match Score: {job.score.toFixed(2)}%</p>
        </div>
      ))}

      {/* BAR CHART */}
      {rankedJobs.length > 0 && (
        <div className="mt-10 p-4 border rounded shadow bg-white">
          <h3 className="text-lg font-bold mb-2">📊 Visual Comparison</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={rankedJobs} margin={{ top: 20, right: 30, left: 10, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="title"
                interval={0}
                angle={-20}
                textAnchor="end"
                tick={{ fontSize: 11 }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#6366f1" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default JobRankings;
