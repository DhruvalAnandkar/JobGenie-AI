// client/src/components/UploadResume.js
import React, { useState } from "react";
import axios from "axios";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResponse(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("⚠️ Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("https://jobgenie-ai.onrender.com/upload-resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Upload failed. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📄 Resume Matcher AI</h1>

        <label htmlFor="file-upload" style={styles.fileLabel}>
          {file ? file.name : "Choose Resume File (PDF, DOCX, TXT)"}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.txt,.doc,.docx"
          style={styles.fileInput}
        />

        <button onClick={handleUpload} disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
          {loading ? "🔄 Processing..." : "🚀 Upload & Match"}
        </button>

        {response && (
          <div style={styles.resultBox}>
            {response.error ? (
              <div style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>❌ Error: {response.error}</div>
            ) : (
              <>
                <h2 style={{ color: "#0f9d58", marginBottom: 12 }}>
                  ✅ Match Score: <span style={styles.score}>{response.match_score}</span>
                </h2>

                <section style={styles.section}>
                  <h3>🧾 Job Description</h3>
                  <pre style={styles.codeBlock}>{response.job_description}</pre>
                </section>

                <section style={styles.section}>
                  <h3>📜 Resume Extracted Text</h3>
                  <pre style={styles.codeBlock}>{response.resume_text}</pre>
                </section>
              </>
            )}
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
    maxWidth: 720,
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
  button: {
    backgroundColor: "#1a73e8",
    color: "#fff",
    padding: "0.8rem 2rem",
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
    padding: "0.8rem 2rem",
    border: "none",
    borderRadius: 6,
    fontSize: 18,
    fontWeight: "600",
    cursor: "not-allowed",
  },
  resultBox: {
    marginTop: 32,
    background: "#f5faff",
    borderRadius: 10,
    padding: 20,
    textAlign: "left",
    boxShadow: "0 4px 12px rgba(26, 115, 232, 0.15)",
  },
  score: {
    fontSize: "2rem",
  },
  section: {
    marginTop: 20,
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
};

export default UploadResume;
