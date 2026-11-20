import { jsPDF } from "jspdf";

export function generateResumePDF(form) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - 20;

  const colors = {
    primary: [35, 40, 50],
    secondary: [95, 102, 112],
    accent: [180, 105, 125],
  };

  let y = 22;

  function setColor(color) {
    doc.setTextColor(...color);
  }

  function addPage() {
    doc.addPage();
    y = 22;
  }

  function ensureSpace(height) {
    if (y + height > bottomLimit) {
      addPage();
    }
  }

  function drawWrappedText(text, options = {}) {
    const {
      fontSize = 10,
      color = colors.primary,
      lineHeight = 5.5,
      indent = 0,
    } = options;

    if (!text || !String(text).trim()) return;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    setColor(color);

    const availableWidth = contentWidth - indent;

    const paragraphs = String(text).split("\n");

    paragraphs.forEach((paragraph) => {
      if (!paragraph.trim()) {
        ensureSpace(lineHeight);
        y += lineHeight;
        return;
      }

      const lines = doc.splitTextToSize(paragraph.trim(), availableWidth);

      lines.forEach((line) => {
        ensureSpace(lineHeight);

        doc.text(line, margin + indent, y);

        y += lineHeight;
      });
    });
  }

  function drawSection(title, content) {
    if (!content || !String(content).trim()) return;

    ensureSpace(18);

    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(colors.primary);

    doc.text(title.toUpperCase(), margin, y);

    y += 3;

    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.35);

    doc.line(margin, y, pageWidth - margin, y);

    y += 7;

    drawWrappedText(content, {
      fontSize: 10,
      lineHeight: 5.7,
    });

    y += 3;
  }

  // Header: full name
  const fullName = String(form.fullName || "").trim() || "Your Name";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  setColor(colors.primary);

  const nameLines = doc.splitTextToSize(fullName, contentWidth);

  nameLines.forEach((line) => {
    ensureSpace(10);
    doc.text(line, margin, y);
    y += 10;
  });

  // Professional title
  if (form.jobTitle?.trim()) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    setColor(colors.primary);

    const titleLines = doc.splitTextToSize(form.jobTitle.trim(), contentWidth);

    titleLines.forEach((line) => {
      ensureSpace(7);
      doc.text(line, margin, y);
      y += 7;
    });
  }

  y += 3;

  // Contact information
  const contactInfo = [form.email, form.phone, form.location]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join("  |  ");

  if (contactInfo) {
    drawWrappedText(contactInfo, {
      fontSize: 9,
      color: colors.secondary,
      lineHeight: 5,
    });
  }

  y += 4;

  doc.setDrawColor(...colors.secondary);
  doc.setLineWidth(0.7);

  doc.line(margin, y, pageWidth - margin, y);

  y += 5;

  // Resume sections
  drawSection("Professional Summary", form.summary);

  // Skills: clean comma-separated formatting
  const skills = Array.isArray(form.skills)
    ? form.skills.join("  |  ")
    : String(form.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .join("  |  ");

  drawSection("Technical Skills", skills);

  drawSection("Work Experience", form.experience);

  drawSection("Education", form.education);

  // Page numbers
  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);

    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.25);

    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(colors.secondary);

    doc.text(
      `Page ${page} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" },
    );
  }

  // Keep Blob output for Save and Export
  return doc.output("blob");
}
