import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import DashboardStats from "../components/dashboard/DashboardStats";
import ResumeCard from "../components/dashboard/ResumeCard";

import "../styles/dashboard.css";

const STORAGE_KEY = "ai-resume-builder-resumes";

const initialResumes = [
  {
    id: "1",
    title: "Frontend Developer CV",
    updatedAt: "2026-11-12",
    status: "Completed",
  },
  {
    id: "2",
    title: "Software Engineer CV",
    updatedAt: "2026-11-10",
    status: "Draft",
  },
];

export default function Dashboard({ resumesOnly = false }) {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : initialResumes;
    } catch {
      return initialResumes;
    }
  });

  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const completed = resumes.filter(
    (resume) => resume.status === "Completed",
  ).length;

  const drafts = resumes.filter((resume) => resume.status === "Draft").length;

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(search.toLowerCase().trim()),
  );

  function saveResumes(updated) {
    setResumes(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Data remains available in component state.
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;

    const updated = resumes.filter((resume) => resume.id !== deleteTarget.id);

    saveResumes(updated);
    setDeleteTarget(null);
  }

  function handleCreate() {
    navigate("/create-cv");
  }

  function handleView(id) {
    navigate(`/cv/${id}/preview`);
  }

  function handleEdit(id) {
    navigate(`/cv/${id}/edit`);
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

            {/* <button
              type="button"
              className="dashboard-add-btn"
              onClick={handleCreate}
            >
              <Plus size={18} />
              New CV
            </button>  */}
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
                  resume={resume}
                  onView={handleView}
                  onEdit={handleEdit}
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
