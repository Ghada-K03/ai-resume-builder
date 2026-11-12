import { CloudUpload, FilePlus2 } from "lucide-react";

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

      <button
        type="button"
        className="cv-option-card"
        onClick={() => onSelect("manual")}
      >
        <span className="cv-option-icon">
          <FilePlus2 size={30} />
        </span>

        <h3>Start From Scratch</h3>
        <p>Build a professional resume step by step.</p>
      </button>
    </div>
  );
}
