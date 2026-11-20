import { useState, useEffect, useRef } from "react";
import { Sparkles, Check, RefreshCw } from "lucide-react";

import SuggestionCard from "./SuggestionCard";
import { getRecommendationsAPI } from "../../api/resumeService";

import "../../styles/ai-suggestions.css";

export default function AISuggestions({ form, resumeId, onNavigateToField }) {
  const [suggestions, setSuggestions] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [dismissed, setDismissed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState(null);

  const requestedResumeId = useRef(null);

  async function handleAnalyze() {
    if (!resumeId || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await getRecommendationsAPI(
        resumeId,
        form.jobTitle.trim() || "Software Developer",
      );

      const data = response.data ?? response;

      setRecommendations(data);

      const improvements = data.recommendations?.cv_improvements ?? [];

      const fieldMap = {
        "Professional Summary": "summary",
        Education: "education",
        "Work Experience": "experience",
        Skills: "skills",
      };

      const formattedSuggestions = improvements.map((item, index) => ({
        id: index + 1,
        title: item.section,
        field: fieldMap[item.section] ?? null,
        priority: item.priority,
        description: item.issue,
        recommendation: item.recommendation,
      }));

      setSuggestions(formattedSuggestions);
      setDismissed([]);
      setAnalyzed(true);

      console.log("Recommendations received:", data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate recommendations.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!resumeId || requestedResumeId.current === resumeId) {
      return;
    }

    requestedResumeId.current = resumeId;
    handleAnalyze();
  }, [resumeId]);

  function handleApply(suggestion) {
    if (!suggestion.field) {
      setError("This recommendation requires manual editing.");
      return;
    }

    setError("");

    onNavigateToField?.(suggestion.field, suggestion.recommendation);
  }

  function handleDismiss(id) {
    setDismissed((previous) => [...previous, id]);
  }

  const visibleSuggestions = suggestions.filter(
    (item) => !dismissed.includes(item.id),
  );

  return (
    <section className="ai-suggestions">
      <div className="ai-suggestions-heading">
        <div>
          <h2>
            <Sparkles size={20} />
            AI Resume Assistant
          </h2>

          <p>Get smart suggestions to improve your resume.</p>
        </div>

        <button
          type="button"
          className="ai-analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !resumeId}
        >
          {analyzed ? <RefreshCw size={17} /> : <Sparkles size={17} />}

          {analyzed ? "Analyze Again" : "Analyze Resume"}
        </button>

        {loading && <p role="status">Generating recommendations...</p>}

        {error && <p role="alert">{error}</p>}
      </div>

      {!analyzed && !loading && !error && !resumeId && (
        <p className="ai-placeholder">
          Upload and analyze a CV to get AI recommendations.
        </p>
      )}

      {analyzed && visibleSuggestions.length === 0 && (
        <p className="ai-success">
          <Check size={18} />
          No more suggestions to display.
        </p>
      )}

      {recommendations && (
        <div className="ai-overall-score">
          <h3>Overall CV Score</h3>

          <div className="ai-score-value">
            <strong>
              {recommendations.recommendations?.overall_score ?? 0}
            </strong>
            <span>/100</span>
          </div>

          <p>{recommendations.recommendations?.summary}</p>
        </div>
      )}

      {recommendations?.recommendations?.strengths?.length > 0 && (
        <div className="ai-strengths">
          <h3>CV Strengths</h3>

          <ul>
            {recommendations.recommendations.strengths.map(
              (strength, index) => (
                <li key={index}>
                  <Check size={16} />
                  <span>{strength}</span>
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {recommendations?.recommendations?.recommended_skills?.length > 0 && (
        <div className="ai-recommended-skills">
          <h3>Recommended Skills</h3>

          <div className="ai-skills-list">
            {recommendations.recommendations.recommended_skills.map(
              (item, index) => (
                <div className="ai-skill-card" key={index}>
                  <div className="ai-skill-header">
                    <h4>{item.skill}</h4>

                    <span
                      className={`ai-priority ai-priority-${item.priority}`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <p>{item.reason}</p>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      <div className="ai-suggestions-list">
        {visibleSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onApply={handleApply}
            onDismiss={handleDismiss}
            isApplied={false}
            isApplying={false}
          />
        ))}
      </div>
    </section>
  );
}
