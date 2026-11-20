import { CloudUpload } from "lucide-react";

export default function CVStartOptions({ onSelect }) {
  return (
    <div className="cv-start-options">
      <button
        type="button"
        className="cv-option-card"
        onClick={() => onSelect("upload")}
      >
        <span className="cv-option-icon">
          <CloudUpload size={30} />
        </span>

        <h3>Upload Existing CV</h3>
        <p>Upload your resume and prepare it for AI analysis.</p>
      </button>
    </div>
  );
}
