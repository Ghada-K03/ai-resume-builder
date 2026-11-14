import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import AISuggestions from "../components/ai/AISuggestions";

import "../styles/dashboard.css";

const STORAGE_KEY = "ai-resume-builder-resumes";

function getSavedResumes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function AIAssistant() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState(getSavedResumes);
  const [selectedId, setSelectedId] = useState("");

  const selectedResume = resumes.find(
    (resume) => String(resume.id) === selectedId,
  );

  function handleApply(field, value) {
    if (!selectedResume) return;

    const updatedResumes = resumes.map((resume) =>
      String(resume.id) === selectedId
        ? {
            ...resume,
            updatedAt: new Date().toISOString().slice(0, 10),
            data: {
              ...resume.data,
              [field]: value,
            },
          }
        : resume,
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes));
      setResumes(updatedResumes);
    } catch {
      alert("Could not save your changes.");
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="ai-page-header">
          <h1>AI Resume Assistant</h1>
          <p>Choose a resume and get suggestions to improve it.</p>
        </div>

        <section className="ai-resume-selector">
          <label htmlFor="resume-select">Select Resume</label>

          <select
            id="resume-select"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            <option value="">Choose a resume</option>

            {resumes
              .filter((resume) => resume.data)
              .map((resume) => (
                <option key={resume.id} value={String(resume.id)}>
                  {resume.title}
                </option>
              ))}
          </select>
        </section>

        {selectedResume?.data ? (
          <AISuggestions
            key={selectedId}
            form={selectedResume.data}
            onApply={handleApply}
          />
        ) : (
          <div className="ai-page-empty">
            <Sparkles size={28} />
            <h2>No Resume Selected</h2>
            <p>Select a saved resume to start analyzing.</p>
            <button type="button" onClick={() => navigate("/create-cv")}>
              Create New CV
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
