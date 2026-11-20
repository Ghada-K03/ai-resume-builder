import { useState } from "react";
import {
  FileUser,
  Eye,
  Pencil,
  Trash2,
  Download,
  Share2,
  Link2,
  Link2Off,
} from "lucide-react";

export default function ResumeCard({
  resume,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onRevokeShare,
}) {
  const status = resume.status || "Uploaded";

  const rawDate = resume.updatedAt || resume.updated_at;

  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not available";
  const [showShareMenu, setShowShareMenu] = useState(false);
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
              status === "Completed" ? "completed" : "draft"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="resume-updated">Last updated: {formattedDate}</p>
        <div className="resume-card-actions">
          {/* View CV */}
          <button
            type="button"
            onClick={() => onView(resume.id)}
            aria-label={`View ${resume.title}`}
            title="View CV"
          >
            <Eye size={18} />
          </button>

          {/* Download CV */}
          <button
            type="button"
            onClick={() => onDownload?.(resume.id)}
            // disabled={!onDownload}
            aria-label={`Download ${resume.title}`}
            title={
              onDownload
                ? "Download CV"
                : "Download available after integration"
            }
          >
            <Download size={18} />
          </button>
          {/* Share CV */}
          <div className="resume-share-wrapper">
            <button
              type="button"
              onClick={() => setShowShareMenu((prev) => !prev)}
              aria-label={`Share ${resume.title}`}
              aria-expanded={showShareMenu}
              title="Share CV"
            >
              <Share2 size={18} />
            </button>

            {showShareMenu && (
              <div className="resume-share-menu">
                <button
                  type="button"
                  onClick={() => {
                    setShowShareMenu(false);
                    onShare?.(resume.id);
                  }}
                >
                  <Link2 size={16} />
                  Copy Share Link
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowShareMenu(false);
                    onRevokeShare?.(resume.id);
                  }}
                >
                  <Link2Off size={16} />
                  Revoke Share
                </button>
              </div>
            )}
          </div>
          {/* Edit CV */}
          <button
            type="button"
            onClick={() => onEdit(resume.id)}
            aria-label={`Edit ${resume.title}`}
            title="Edit CV"
          >
            <Pencil size={18} />
          </button>

          {/* Delete CV */}
          <button
            type="button"
            className="resume-delete"
            onClick={() => onDelete(resume.id)}
            aria-label={`Delete ${resume.title}`}
            title="Delete CV"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
