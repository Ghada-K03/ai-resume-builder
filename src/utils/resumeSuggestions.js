export function analyzeResume(form) {
  const suggestions = [];

  const summary = form.summary.trim();
  const experience = form.experience.trim();
  const education = form.education.trim();

  const skills = form.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  // Check professional summary
  if (summary.length < 80) {
    suggestions.push({
      id: "summary",
      field: "summary",
      title: "Improve Professional Summary",
      description: "Your professional summary is missing or too short.",
      suggestedText:
        `Motivated ${form.jobTitle.trim() || "professional"} ` +
        "with an interest in solving problems, developing professional " +
        "skills, and contributing to meaningful projects.",
    });
  }

  // Check work experience
  if (!experience) {
    suggestions.push({
      id: "experience",
      field: "experience",
      title: "Add Work Experience",
      description:
        "Include relevant internships, projects, or work experience.",
      suggestedText: "",
    });
  }

  // Check skills
  if (skills.length < 5) {
    suggestions.push({
      id: "skills",
      field: "skills",
      title: "Improve Your Skills Section",
      description: "Consider adding more skills relevant to your target job.",
      suggestedText: "",
    });
  }

  // Check education
  if (!education) {
    suggestions.push({
      id: "education",
      field: "education",
      title: "Add Education",
      description: "Include your degree, university, and graduation year.",
      suggestedText: "",
    });
  }

  return suggestions;
}
