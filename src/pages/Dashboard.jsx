import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import DashboardStats from "../components/dashboard/DashboardStats";
import ResumeCard from "../components/dashboard/ResumeCard";
import {
  getResumes,
  deleteResume,
  getResumeFile,
  shareResumeAPI,
  revokeResumeShareAPI,
} from "../api/resumeService";

import "../styles/dashboard.css";

const STORAGE_KEY = "ai-resume-builder-resumes";

function isResumeComplete(resume) {
  let savedData = null;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (Array.isArray(saved)) {
      const matchingResume = saved.find(
        (item) => String(item.id) === String(resume.id),
      );

      savedData = matchingResume?.data ?? null;
    }
  } catch (error) {
    console.error("Failed to read saved resume:", error);
  }

  const profile = savedData || resume.profile_draft;

  if (!profile) return false;

  const hasValue = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return typeof value === "string" && value.trim().length > 0;
  };

  return [
    profile.fullName ?? profile.full_name,
    profile.email,
    profile.phone,
    profile.jobTitle ?? profile.job_title,
    profile.summary ?? profile.professional_summary,
    profile.education,
    profile.experience,
    profile.skills,
  ].every(hasValue);
}

export default function Dashboard({ resumesOnly = false }) {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const response = await getResumes();

        setResumes(response.data);

        console.log("Resumes API response:", response);
        console.log("First resume:", response.data[0]);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      }
    }

    fetchResumes();
  }, []);

  const completed = resumes.filter(isResumeComplete).length;

  const drafts = resumes.filter((resume) => !isResumeComplete(resume)).length;

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(search.toLowerCase().trim()),
  );

  function handleCreate() {
    navigate("/create-cv");
  }

  async function handleView(id) {
    const newTab = window.open("", "_blank");

    try {
      const file = await getResumeFile(id);
      const url = URL.createObjectURL(file);

      if (newTab) {
        newTab.location.href = url;
      } else {
        window.open(url, "_blank");
      }

      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      if (newTab) newTab.close();

      console.error("Failed to view resume:", error);

      alert("Failed to open resume.");
    }
  }

  function handleEdit(id) {
    navigate(`/cv/${id}/edit`, {
      state: { resumeId: id },
    });
  }

  async function handleDownload(id) {
    try {
      const file = await getResumeFile(id, true);
      const url = URL.createObjectURL(file);

      const link = document.createElement("a");

      link.href = url;
      link.download = `resume-${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error("Failed to download resume:", error);

      alert("Failed to download resume.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await deleteResume(deleteTarget.id);

      setResumes((prev) =>
        prev.filter((resume) => resume.id !== deleteTarget.id),
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete resume:", error);
      alert("Failed to delete resume. Please try again.");
    }
  }
  async function handleShare(id) {
    try {
      const response = await shareResumeAPI(id);

      console.log("Share API response:", response);

      const shareUrl = response.data?.file_url;

      if (!shareUrl) {
        alert("Share link not found.");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);

      alert("Share link copied successfully!");
    } catch (error) {
      console.error("Failed to share CV:", error);
      alert("Could not share this resume.");
    }
  }

  async function handleRevokeShare(id) {
    try {
      await revokeResumeShareAPI(id);
      alert("Share link revoked successfully!");
    } catch (error) {
      console.error("Failed to revoke share:", error);
      alert("Could not revoke share link.");
    }
  }
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {!resumesOnly && (
          <>
            <DashboardHeader search={search} onSearchChange={setSearch} />

            <WelcomeBanner onCreate={handleCreate} />

            <DashboardStats
              total={resumes.length}
              completed={completed}
              drafts={drafts}
            />
          </>
        )}

        {resumesOnly && (
          <div className="resumes-page-header">
            <h1>My Resumes</h1>

            <p>Manage, view and edit your saved resumes.</p>

            <input
              type="search"
              placeholder="Search resumes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        )}

        <section className="dashboard-resumes">
          <div className="resumes-section-heading">
            <div>
              <h2>My Resumes</h2>

              <p>Your professional resumes in one place.</p>
            </div>

            <button
              type="button"
              className="dashboard-add-btn"
              onClick={() => navigate("/dashboard/resumes")}
            >
              All Resumes
            </button>
          </div>

          {filteredResumes.length > 0 ? (
            <div className="resume-grid">
              {filteredResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={{
                    ...resume,
                    status: isResumeComplete(resume) ? "Completed" : "Draft",
                    updatedAt: resume.updated_at ?? null,
                  }}
                  onShare={handleShare}
                  onRevokeShare={handleRevokeShare}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDownload={handleDownload}
                  onDelete={(id) => {
                    const selected = resumes.find((item) => item.id === id);

                    setDeleteTarget(selected);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <h3>No resumes found</h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "Create your first resume to get started."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="dashboard-add-btn"
                >
                  <Plus size={18} />
                  Create CV
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {deleteTarget && (
        <div className="dashboard-modal-overlay" role="presentation">
          <div
            className="dashboard-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <h2 id="delete-dialog-title">Delete Resume?</h2>

            <p id="delete-dialog-description">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>? This action cannot be
              undone.
            </p>

            <div className="dashboard-modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
