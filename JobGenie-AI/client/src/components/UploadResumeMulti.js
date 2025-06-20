// client/src/components/UploadResumeMulti.js
import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function UploadResumeMulti() {
  const [file, setFile] = useState(null);
  const [companyRoleInput, setCompanyRoleInput] = useState(
    '[{"company": "Amazon", "role": "Software Engineer"}, {"company": "LinkedIn", "role": "Backend Developer"}]'
  );
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponse(null);
  };

  const handleInputChange = (e) => {
    setCompanyRoleInput(e.target.value);
    setResponse(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("⚠️ Please select a resume file first.");
      return;
    }

    let companiesRoles;
    try {
      companiesRoles = JSON.parse(companyRoleInput);
      if (!Array.isArray(companiesRoles)) throw new Error();
      for (const cr of companiesRoles) {
        if (!cr.company || !cr.role) throw new Error();
      }
    } catch {
      alert("⚠️ Please enter a valid JSON array of {company, role} objects.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("companies_roles", JSON.stringify(companiesRoles));

    try {
      setLoading(true);
      const res = await axios.post("https://jobgenie-ai.onrender.com/upload-resume-multi/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const chartData =
    response?.matches.map((m) => ({
      name: `${m.company} - ${m.role}`,
      score: parseFloat(m.match_score.replace("%", "")) || 0,
    })) || [];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📄 Resume Matcher Multi-Company AI</h1>

        <label htmlFor="file-upload-multi" style={styles.fileLabel}>
          {file ? file.name : "Choose Resume File (PDF, TXT)"}
        </label>
        <input
          id="file-upload-multi"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.txt"
          style={styles.fileInput}
        />

        <textarea
          value={companyRoleInput}
          onChange={handleInputChange}
          rows={6}
          style={styles.textarea}
          placeholder='Enter companies and roles as JSON, e.g. [{"company": "Amazon", "role": "Software Engineer"}]'
        />

        <button onClick={handleUpload} disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
          {loading ? "🔄 Processing..." : "🚀 Upload & Match Multiple"}
        </button>

        {response && (
          <div style={styles.resultBox}>
            <h2 style={styles.subTitle}>
              ✅ Resume Text Extracted ({response.resume_text.length} chars)
            </h2>
            <pre style={styles.codeBlock}>
              {response.resume_text.slice(0, 800)}
              {response.resume_text.length > 800 ? "..." : ""}
            </pre>

            <h2 style={styles.subTitle}>📊 Match Scores by Company & Role</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="score" fill="#1a73e8" />
              </BarChart>
            </ResponsiveContainer>

            {response.matches.map((m, idx) => (
              <div key={idx} style={styles.matchCard}>
                <h3>{m.company} - {m.role}</h3>
                <p><strong>Match Score:</strong> {m.match_score}</p>
                <details style={{ cursor: "pointer" }}>
                  <summary>Job Description</summary>
                  <pre style={styles.codeBlock}>{m.job_description}</pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  ... // (same styles as before — you don’t need to change this)
};

export default UploadResumeMulti;
