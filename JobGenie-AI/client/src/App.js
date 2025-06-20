// client/src/App.js
import React from "react";
import UploadResumeMulti from "./components/UploadResumeMulti";

function App() {
  return (
    <div style={appStyles.page}>
      <header style={appStyles.header}>
        <h1 style={appStyles.title}>JobGenie AI 🚀</h1>
        <p style={appStyles.subtitle}>Your smart resume matching assistant</p>
      </header>

      <main style={appStyles.main}>
        <UploadResumeMulti />
      </main>

      <footer style={appStyles.footer}>
        <p>© 2025 JobGenie AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

const appStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #f0f4ff, #dfefff)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  header: {
    padding: "2rem 1rem 1rem",
    textAlign: "center",
    backgroundColor: "#1a73e8",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontSize: "1.2rem",
    fontWeight: "400",
    opacity: 0.85,
  },
  main: {
    flexGrow: 1,
    padding: "2rem 1rem",
    display: "flex",
    justifyContent: "center",
  },
  footer: {
    textAlign: "center",
    padding: "1rem",
    fontSize: 14,
    color: "#666",
  },
};

export default App;
