import { useParams } from "react-router-dom";
import { FileWarning, Download } from "lucide-react";

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
  function handleDownload() {
    window.print();
  }
  const { id } = useParams();

  const resume = getSavedResumes().find(
    (item) => String(item.id) === String(id),
  );

  if (!resume) {
    return (
      <main className="cv-standalone-page">
        <div className="preview-not-found">
          <FileWarning size={48} />
          <h2>Resume Not Found</h2>
          <p>This resume may have been deleted or does not exist.</p>
        </div>
      </main>
    );
  }

  const data = resume.data || {};

  const sections = [
    ["Professional Summary", data.summary],
    ["Education", data.education],
    ["Work Experience", data.experience],
  ];

  const skills =
    typeof data.skills === "string"
      ? data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];
  <div className="cv-download-toolbar">
    <button type="button" onClick={handleDownload} className="cv-download-btn">
      <Download size={18} />
      Download PDF
    </button>
  </div>;
  return (
    <main className="cv-standalone-page">
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

        {sections.map(([title, value]) =>
          typeof value === "string" && value.trim() ? (
            <section className="cv-paper-section" key={title}>
              <h4>{title}</h4>
              <p>{value}</p>
            </section>
          ) : null,
        )}

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
  );
}
