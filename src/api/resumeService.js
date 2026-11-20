import api from "./axios";

export async function uploadResume(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/cv/resumes", formData);

  return response.data;
}

export async function getResumes() {
  const response = await api.get("/cv/resumes");

  return response.data;
}
export async function deleteResume(id) {
  const response = await api.delete(`/cv/resumes/${encodeURIComponent(id)}`);

  return response.data;
}
export async function getResumeFile(id, download = false) {
  const response = await api.get(`/cv/resumes/${encodeURIComponent(id)}/file`, {
    params: download ? { download: 1 } : {},
    responseType: "blob",
  });

  return response.data;
}
export async function changePassword(data) {
  const response = await api.post("/cv/auth/change-password", data);

  return response.data;
}
export async function analyzeResumeAPI(resumeId) {
  const response = await api.post(
    "/api/analyze",
    { resumeId },
    { timeout: 120000 },
  );

  return response.data;
}
export async function getRecommendationsAPI(resumeId, targetRole) {
  const response = await api.post(
    "/api/recommendations",
    {
      resumeId,
      target_role: targetRole,
    },
    {
      timeout: 120000,
    },
  );

  return response.data;
}
export async function improveSectionAPI(field, currentText, recommendation) {
  const response = await api.post(
    "/api/improve-section",
    {
      field,
      currentText,
      recommendation,
    },
    {
      timeout: 120000,
    },
  );

  return response.data;
}
export async function updateResumeAPI(resumeId, title, pdfBlob) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("file", pdfBlob, "resume.pdf");

  const response = await api.post(`/cv/resumes/${resumeId}`, formData);

  return response.data;
}

export async function shareResumeAPI(resumeId) {
  const response = await api.post(`/cv/resumes/${resumeId}/share`);

  return response.data;
}

export async function revokeResumeShareAPI(resumeId) {
  const response = await api.delete(`/cv/resumes/${resumeId}/share`);

  return response.data;
}
