import { useRef, useState } from "react";
import { CloudUpload, FileText, X, Sparkles } from "lucide-react";
import { uploadResume } from "../../api/resumeService";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function CvUpload({ onContinue }) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  function validateFile(selectedFile) {
    if (!selectedFile || loading) return;

    const extension = selectedFile.name.split(".").pop().toLowerCase();

    if (!["pdf", "doc", "docx"].includes(extension)) {
      setError("Please upload a PDF or Word document.");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 10 MB.");
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

    if (!loading) {
      setDragging(true);
    }
  }

  function handleRemove() {
    if (loading) return;

    setFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleContinue() {
    if (!file || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await uploadResume(file);

      const resume =
        result?.data?.resume ?? result?.data ?? result?.resume ?? result;

      const resumeId = resume?.id ?? resume?.resume_id;

      if (resumeId == null) {
        setError("Upload response did not include a resume ID.");
        return;
      }

      onContinue(resumeId);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else {
        const validationErrors = err.response?.data?.errors;

        const firstError = validationErrors
          ? Object.values(validationErrors).flat()[0]
          : null;

        setError(
          firstError ||
            err.response?.data?.message ||
            "Could not upload your resume. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cv-upload-section">
      <h2>Upload Your Resume</h2>

      <p>Upload your existing CV to extract your information using AI.</p>

      <div
        className={`cv-dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <CloudUpload size={44} />

        <h3>Drag and drop your file here</h3>
        <p>or choose a file from your device</p>

        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </button>

        <span>PDF, DOC, DOCX — Max 10 MB</span>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          disabled={loading}
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

          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            aria-label="Remove file"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <button
        type="button"
        className="cv-continue-btn"
        disabled={!file || loading}
        onClick={handleContinue}
      >
        <Sparkles size={18} />
        {loading ? "Uploading Resume..." : "Continue to Analyze"}
      </button>
    </div>
  );
}
