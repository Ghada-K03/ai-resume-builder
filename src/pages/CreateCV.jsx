import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import CVUpload from "../components/cv/CvUpload";
import { analyzeResumeAPI } from "../api/resumeService";

import "../styles/create-cv.css";

export default function CreateCV() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue(resumeId) {
    if (analyzing) return;

    setAnalyzing(true);
    setError("");

    try {
      const response = await analyzeResumeAPI(resumeId);

      const profile = response.data?.profile_draft ?? response.profile_draft;

      if (!profile) {
        throw new Error("No CV information was extracted.");
      }

      navigate("/cv-editor", {
        state: {
          resumeId,
          analyzedProfile: profile,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyze your CV.",
      );
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="create-cv-header">
          <button type="button" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="create-cv-heading">
            <span>
              <Sparkles size={17} />
              AI Resume Builder
            </span>

            <h1>Upload Your Resume</h1>
            <p>Upload your existing CV and let AI extract your information.</p>
          </div>
        </div>

        <section className="create-cv-panel">
          <CVUpload onContinue={handleContinue} />

          {analyzing && <p role="status">Analyzing your CV, please wait...</p>}

          {error && <p role="alert">{error}</p>}
        </section>
      </main>
    </div>
  );
}
