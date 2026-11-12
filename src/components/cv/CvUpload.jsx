import { useRef, useState } from "react";
import { CloudUpload, FileText, X } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function CvUpload({ onContinue }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  function validateFile(selectedFile) {
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop().toLowerCase();

    if (!["pdf", "doc", "docx"].includes(extension)) {
      setError("Please upload a PDF or Word document.");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5 MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    validateFile(event.dataTransfer.files[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragging(true);
  }

  function handleRemove() {
    setFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="cv-upload-section">
      <h2>Upload Your Resume</h2>
      <p>Upload your existing CV to get started.</p>

      <div
        className={`cv-dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <CloudUpload size={44} />

        <h3>Drag and drop your file here</h3>
        <p>or choose a file from your device</p>

        <button type="button" onClick={() => inputRef.current?.click()}>
          Browse Files
        </button>

        <span>PDF, DOC, DOCX — Max 5 MB</span>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={(event) => validateFile(event.target.files[0])}
        />
      </div>

      {error && (
        <p className="cv-upload-error" role="alert">
          {error}
        </p>
      )}

      {file && (
        <div className="cv-selected-file">
          <FileText size={24} />

          <div>
            <strong>{file.name}</strong>
            <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <button type="button" onClick={handleRemove} aria-label="Remove file">
            <X size={20} />
          </button>
        </div>
      )}

      <button
        type="button"
        className="cv-continue-btn"
        disabled={!file}
        onClick={() => onContinue(file)}
      >
        Continue
      </button>
    </div>
  );
}
