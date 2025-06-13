import React from "react";
import axios from "axios";

function UploadResume({ setResumeText }) {
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload-resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload Response:", response.data);
      setResumeText(response.data.extracted_text); // Pass text to parent
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Upload Your Resume (PDF or DOCX)</label>
      <input type="file" onChange={handleUpload} className="border p-2 rounded w-full" />
    </div>
  );
}

export default UploadResume;
