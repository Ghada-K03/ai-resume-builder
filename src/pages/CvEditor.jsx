import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Printer, Sparkles } from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";

import "../styles/dashboard.css";
import "../styles/cv-editor.css";

const STORAGE_KEY = "ai-resume-builder-resumes";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  jobTitle: "",
  summary: "",
  education: "",
  experience: "",
  skills: "",
};

function getSavedResumes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function CVEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [form, setForm] = useState(() => {
    if (!id) {
      return { ...emptyForm };
    }

    const resume = getSavedResumes().find((item) => item.id === id);

    return resume ? { ...emptyForm, ...resume.data } : { ...emptyForm };
  });

  const [saved, setSaved] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  }

  function handleSave() {
    if (!form.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    const existing = getSavedResumes();

    const previousResume = isEditing
      ? existing.find((item) => item.id === id)
      : null;

    if (isEditing && !previousResume) {
      alert("Resume not found.");
      return;
    }

    const resume = {
      id: isEditing ? id : crypto.randomUUID(),
      title: form.jobTitle.trim()
        ? `${form.jobTitle.trim()} CV`
        : `${form.fullName.trim()} CV`,
      status: "Completed",
      updatedAt: new Date().toISOString().slice(0, 10),
      data: form,
    };

    const updatedResumes = isEditing
      ? existing.map((item) =>
          item.id === id ? { ...previousResume, ...resume } : item,
        )
      : [resume, ...existing];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes));

      setSaved(true);
      navigate("/dashboard");
    } catch {
      alert("Could not save your resume.");
    }
  }

  function handlePrint() {
    window.print();
  }

  const fields = [
    ["fullName", "Full Name", "text"],
    ["email", "Email Address", "email"],
    ["phone", "Phone Number", "tel"],
    ["location", "Location", "text"],
    ["jobTitle", "Professional Title", "text"],
  ];

  const textAreas = [
    ["summary", "Professional Summary"],
    ["education", "Education"],
    ["experience", "Work Experience"],
    ["skills", "Skills (separate with commas)"],
  ];

  return (
    <div className="dashboard-layout cv-editor-layout">
      {/* Horizontal Sidebar */}
      <Sidebar />

      <main className="dashboard-main cv-editor-main">
        <header className="cv-editor-header">
          <button
            type="button"
            className="cv-editor-back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div>
            <h1>{isEditing ? "Edit Resume" : "Resume Editor"}</h1>

            <p>Build and preview your professional resume.</p>
          </div>

          <div className="cv-editor-actions">
            <button type="button" onClick={handleSave}>
              <Save size={17} />
              {isEditing ? "Save Changes" : "Save CV"}
            </button>

            <button type="button" onClick={handlePrint}>
              <Printer size={17} />
              Export PDF
            </button>
          </div>

          {saved && (
            <p className="cv-saved-message" role="status">
              Resume saved successfully!
            </p>
          )}
        </header>

        <div className="cv-editor-grid">
          {/* Form */}
          <section className="cv-editor-form">
            <h2>Your Information</h2>

            {fields.map(([name, label, type]) => (
              <label className="cv-field" key={name}>
                <span>{label}</span>

                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </label>
            ))}

            {textAreas.map(([name, label]) => (
              <label className="cv-field" key={name}>
                <span>{label}</span>

                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={name === "summary" ? 3 : 4}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </label>
            ))}
          </section>

          {/* Live Preview */}
          <section className="cv-preview-panel">
            <div className="cv-preview-label">
              <Sparkles size={17} />
              Live Preview
            </div>

            <article className="cv-paper">
              <header className="cv-paper-header">
                <h2>{form.fullName || "Your Name"}</h2>

                <h3>{form.jobTitle || "Professional Title"}</h3>

                <p>
                  {[form.email, form.phone, form.location]
                    .filter(Boolean)
                    .join(" | ")}
                </p>
              </header>

              {[
                ["Professional Summary", form.summary],
                ["Education", form.education],
                ["Work Experience", form.experience],
              ].map(([title, value]) =>
                value.trim() ? (
                  <section className="cv-paper-section" key={title}>
                    <h4>{title}</h4>
                    <p>{value}</p>
                  </section>
                ) : null,
              )}

              {form.skills.trim() && (
                <section className="cv-paper-section">
                  <h4>Skills</h4>

                  <div className="cv-paper-skills">
                    {form.skills
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                      .map((skill, index) => (
                        <span key={`${skill}-${index}`}>{skill}</span>
                      ))}
                  </div>
                </section>
              )}
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
