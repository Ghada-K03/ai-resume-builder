import { useState } from "react";
import { Sparkles, Check, RefreshCw } from "lucide-react";

import SuggestionCard from "./SuggestionCard";
import { analyzeResume } from "../../utils/resumeSuggestions";

import "../../styles/ai-suggestions.css";

export default function AISuggestions({ form, onApply }) {
  const [suggestions, setSuggestions] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [dismissed, setDismissed] = useState([]);

  function handleAnalyze() {
    const results = analyzeResume(form);

    setSuggestions(results);
    setDismissed([]);
    setAnalyzed(true);
  }

  function handleApply(suggestion) {
    if (!suggestion.suggestedText) {
      return;
    }

    onApply(suggestion.field, suggestion.suggestedText);

    setSuggestions((previous) =>
      previous.filter((item) => item.id !== suggestion.id),
    );
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
        >
          {analyzed ? <RefreshCw size={17} /> : <Sparkles size={17} />}

          {analyzed ? "Analyze Again" : "Analyze Resume"}
        </button>
      </div>

      {!analyzed && (
        <p className="ai-placeholder">
          Click Analyze Resume to review your information.
        </p>
      )}

      {analyzed && visibleSuggestions.length === 0 && (
        <p className="ai-success">
          <Check size={18} />
          No more suggestions to display.
        </p>
      )}

      <div className="ai-suggestions-list">
        {visibleSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onApply={handleApply}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </section>
  );
}
