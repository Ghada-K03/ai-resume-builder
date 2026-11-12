import { FileUser, Eye, Pencil, Trash2 } from "lucide-react";

export default function ResumeCard({ resume, onView, onEdit, onDelete }) {
  return (
    <article className="resume-card">
      <div className="resume-preview">
        <FileUser size={55} strokeWidth={1.3} />
      </div>

      <div className="resume-card-content">
        <div className="resume-card-heading">
          <h3>{resume.title}</h3>

          <span
            className={`resume-status ${
              resume.status === "Completed" ? "completed" : "draft"
            }`}
          >
            {resume.status}
          </span>
        </div>

        <p className="resume-updated">Last updated: {resume.updatedAt}</p>

        <div className="resume-card-actions">
          <button
            type="button"
            onClick={() => onView(resume.id)}
            aria-label={`View ${resume.title}`}
            title="View"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(resume.id)}
            aria-label={`Edit ${resume.title}`}
            title="Edit"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            className="resume-delete"
            onClick={() => onDelete(resume.id)}
            aria-label={`Delete ${resume.title}`}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
