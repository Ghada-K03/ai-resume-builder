import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, FileWarning } from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";

import "../styles/dashboard.css";
import "../styles/cv-editor.css";
import "../styles/cv-preview.css";

const STORAGE_KEY = "ai-resume-builder-resumes";

function getSavedResumes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function CvPreview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const resumes = getSavedResumes();

  const resume = resumes.find((item) => String(item.id) === String(id));

  if (!resume) {
    return (
      <div className="dashboard-layout cv-preview-layout">
        <Sidebar />

        <main className="dashboard-main cv-preview-main">
          <div className="preview-not-found">
            <FileWarning size={48} />

            <h2>Resume Not Found</h2>

            <p>This resume may have been deleted or does not exist.</p>

            <button type="button" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const data = resume.data || {};

  const sections = [
    {
      title: "Professional Summary",
      value: data.summary,
    },
    {
      title: "Education",
      value: data.education,
    },
    {
      title: "Work Experience",
      value: data.experience,
    },
  ];

  const skills =
    typeof data.skills === "string"
      ? data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="dashboard-layout cv-preview-layout">
      <Sidebar />

      <main className="dashboard-main cv-preview-main">
        {/* Toolbar */}
        <div className="cv-preview-toolbar">
          <button
            type="button"
            className="preview-back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <button
            type="button"
            className="preview-download"
            onClick={handlePrint}
          >
            <Printer size={18} />
            Download PDF
          </button>
        </div>

        {/* Heading */}
        <div className="preview-heading">
          <h1>Resume Preview</h1>

          <p>Review your professional resume before downloading.</p>
        </div>

        {/* ATS Resume */}
        <article className="cv-paper cv-preview-document">
          <header className="cv-paper-header">
            <h2>{data.fullName || "Your Name"}</h2>

            {data.jobTitle && <h3>{data.jobTitle}</h3>}

            <p>
              {[data.email, data.phone, data.location]
                .filter(Boolean)
                .join(" | ")}
            </p>
          </header>

          {/* Resume Sections */}
          {sections.map((section) => {
            if (typeof section.value !== "string" || !section.value.trim()) {
              return null;
            }

            return (
              <section className="cv-paper-section" key={section.title}>
                <h4>{section.title}</h4>

                <p>{section.value}</p>
              </section>
            );
          })}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="cv-paper-section">
              <h4>Skills</h4>

              <div className="cv-paper-skills">
                {skills.map((skill, index) => (
                  <span key={`${skill}-${index}`}>{skill}</span>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  );
}
