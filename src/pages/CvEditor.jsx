import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Save, Printer } from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import AISuggestions from "../components/ai/AISuggestions";

import "../styles/dashboard.css";
import "../styles/cv-editor.css";

import { generateResumePDF } from "../utils/generateResumePDF";
import { updateResumeAPI, analyzeResumeAPI } from "../api/resumeService";

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
function mapProfileToForm(profile) {
  if (!profile) {
    return { ...emptyForm };
  }

  return {
    fullName: profile.full_name ?? profile.fullName ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    jobTitle: profile.job_title ?? profile.jobTitle ?? "",
    summary: profile.professional_summary ?? profile.summary ?? "",

    skills: Array.isArray(profile.skills)
      ? profile.skills.join(", ")
      : (profile.skills ?? ""),

    education: Array.isArray(profile.education)
      ? profile.education
          .map((item) => {
            if (typeof item === "string") return item;

            return [
              item.degree,
              item.institution,
              item.field_of_study,
              item.start_date,
              item.end_date,
              item.description,
            ]
              .filter(Boolean)
              .join(" - ");
          })
          .join("\n")
      : (profile.education ?? ""),

    experience: Array.isArray(profile.experience)
      ? profile.experience
          .map((item) => {
            if (typeof item === "string") return item;

            return [
              item.job_title ?? item.title,
              item.company,
              item.start_date,
              item.end_date,
              item.description,
            ]
              .filter(Boolean)
              .join(" - ");
          })
          .join("\n")
      : (profile.experience ?? ""),
  };
}

export default function CVEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const analyzedProfile = location.state?.analyzedProfile;
  const isEditing = Boolean(id);
  const backendResumeId = location.state?.resumeId || id;

  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(() => {
    if (!id) {
      return analyzedProfile
        ? mapProfileToForm(analyzedProfile)
        : { ...emptyForm };
    }

    const resume = getSavedResumes().find(
      (item) => String(item.id) === String(id),
    );

    return resume ? { ...emptyForm, ...resume.data } : { ...emptyForm };
  });

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [isResumeReady, setIsResumeReady] = useState(() => {
    if (!id) return Boolean(analyzedProfile);

    return getSavedResumes().some(
      (resume) => String(resume.id) === String(id) && Boolean(resume.data),
    );
  });

  useEffect(() => {
    if (!isEditing) return;

    const savedResume = getSavedResumes().find(
      (item) => String(item.id) === String(id),
    );

    // If editor data exists locally, keep it.
    if (savedResume?.data) {
      setIsResumeReady(true);
      return;
    }

    let cancelled = false;

    async function loadResume() {
      setIsLoadingResume(true);
      setIsResumeReady(false);
      setLoadError("");

      try {
        const response = await analyzeResumeAPI(id);

        console.log("Edit CV analysis response:", response);

        if (cancelled) return;

        const profile = response.data?.profile_draft;

        if (!profile) {
          throw new Error("Profile data not found.");
        }

        setForm(mapProfileToForm(profile));
        setIsResumeReady(true);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load CV:", error);
        setLoadError("Could not load resume data.");
        setIsResumeReady(false);
      } finally {
        if (!cancelled) {
          setIsLoadingResume(false);
        }
      }
    }

    loadResume();

    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  console.log("Backend Resume ID:", backendResumeId);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  }

  async function handleSave() {
    if (isSaving || isLoadingResume) return;

    if (!form.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (isEditing && !isResumeReady) {
      alert("Please wait until the resume data is loaded.");
      return;
    }

    if (!backendResumeId) {
      alert("Resume ID is missing. Cannot save to server.");
      return;
    }

    const title = form.jobTitle.trim()
      ? `${form.jobTitle.trim()} CV`
      : `${form.fullName.trim()} CV`;

    setIsSaving(true);
    setSaved(false);

    try {
      const pdfBlob = generateResumePDF(form);

      await updateResumeAPI(backendResumeId, title, pdfBlob);

      const existing = getSavedResumes();

      const resume = {
        id: backendResumeId,
        title,

        updatedAt: new Date().toISOString().slice(0, 10),
        data: form,
      };

      const updatedResumes = [
        resume,
        ...existing.filter(
          (item) => String(item.id) !== String(backendResumeId),
        ),
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes));

      setSaved(true);
      alert("Resume saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Save CV failed:", error);
      alert("Could not save your resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }
  const fieldRefs = useRef({});
  const [activeHint, setActiveHint] = useState(null);

  function handleNavigateToField(field, recommendation) {
    const element = fieldRefs.current[field];

    if (!element) return;

    setActiveHint({
      field,
      message:
        recommendation ||
        "Review this field and update it based on the AI recommendation.",
    });

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    element.focus({ preventScroll: true });
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

  function handleExportPDF() {
    try {
      const pdfBlob = generateResumePDF(form);

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "resume.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Could not generate PDF.");
    }
  }

  return (
    <div className="dashboard-layout cv-editor-layout">
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

            <p>Review and edit your professional resume.</p>
          </div>

          <div className="cv-editor-actions">
            <button
              type="button"
              onClick={handleSave}
              disabled={
                isSaving || isLoadingResume || (isEditing && !isResumeReady)
              }
            >
              <Save size={17} />
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Save CV"}
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              title="Export CV as PDF"
            >
              <Printer size={17} />
              Export PDF
            </button>
          </div>

          {saved && (
            <p className="cv-saved-message" role="status">
              Resume saved successfully!
            </p>
          )}

          {isLoadingResume && <p role="status">Loading resume data...</p>}

          {loadError && <p role="alert">{loadError}</p>}
        </header>

        {/* AI Recommendations */}
        <AISuggestions
          form={form}
          resumeId={backendResumeId}
          onNavigateToField={handleNavigateToField}
        />

        <div className="cv-editor-grid">
          {/* Resume Form */}
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
                  ref={(element) => {
                    fieldRefs.current[name] = element;
                  }}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={name === "summary" ? 3 : 4}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />

                {activeHint?.field === name && (
                  <small className="cv-ai-hint">
                    AI Tip: {activeHint.message}
                  </small>
                )}
              </label>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
