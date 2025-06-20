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
      const res = await axios.post("http://127.0.0.1:8000/upload-resume-multi/", formData, {
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
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0f0ff, #f9faff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "3rem 1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2.5rem 3rem",
    borderRadius: 12,
    boxShadow: "0 12px 28px rgba(0,0,0,0.1)",
    maxWidth: 900,
    width: "100%",
    textAlign: "center",
  },
  title: {
    marginBottom: 24,
    fontWeight: "700",
    color: "#1a73e8",
    fontSize: "2.2rem",
  },
  fileLabel: {
    display: "inline-block",
    padding: "1rem 2rem",
    marginBottom: 20,
    border: "2px dashed #1a73e8",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    color: "#1a73e8",
    userSelect: "none",
    transition: "background-color 0.2s ease",
  },
  fileInput: {
    display: "none",
  },
  textarea: {
    width: "100%",
    fontSize: 16,
    fontFamily: "monospace",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    border: "1.5px solid #ccc",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#1a73e8",
    color: "#fff",
    padding: "0.9rem 2rem",
    border: "none",
    borderRadius: 6,
    fontSize: 18,
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  buttonDisabled: {
    backgroundColor: "#7da7e9",
    color: "#eee",
    padding: "0.9rem 2rem",
    border: "none",
    borderRadius: 6,
    fontSize: 18,
    fontWeight: "600",
    cursor: "not-allowed",
  },
  resultBox: {
    marginTop: 32,
    textAlign: "left",
  },
  subTitle: {
    color: "#0f9d58",
    marginBottom: 12,
  },
  codeBlock: {
    background: "#e6f0ff",
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    whiteSpace: "pre-wrap",
    maxHeight: 220,
    overflowY: "auto",
    fontFamily: "'Courier New', Courier, monospace",
  },
  matchCard: {
    marginTop: 20,
    padding: 20,
    background: "#f9faff",
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(26, 115, 232, 0.15)",
  },
};

export default UploadResumeMulti;
