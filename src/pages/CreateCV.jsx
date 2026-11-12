import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import CVStartOptions from "../components/cv/CvStartOptions";
import CVUpload from "../components/cv/CvUpload";

import "../styles/dashboard.css";
import "../styles/create-cv.css";

export default function CreateCV() {
  const navigate = useNavigate();
  const [step, setStep] = useState("options");

  function handleSelect(option) {
    if (option === "upload") {
      setStep("upload");
    } else {
      navigate("/cv-editor");
    }
  }

  function handleContinue(file) {
    // The actual file will be processed in the next stage.
    // Do not store File objects in localStorage.
    console.log("Selected CV:", file.name);
    navigate("/cv-editor");
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="create-cv-header">
          <button
            type="button"
            onClick={() =>
              step === "options" ? navigate("/dashboard") : setStep("options")
            }
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="create-cv-heading">
            <span>
              <Sparkles size={17} />
              AI Resume Builder
            </span>

            <h1>Create Your Resume</h1>
            <p>Build a resume that helps you stand out.</p>
          </div>
        </div>

        <section className="create-cv-panel">
          {step === "options" ? (
            <CVStartOptions onSelect={handleSelect} />
          ) : (
            <CVUpload onContinue={handleContinue} />
          )}
        </section>
      </main>
    </div>
  );
}
