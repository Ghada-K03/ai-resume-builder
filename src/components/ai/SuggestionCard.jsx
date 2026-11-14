import { Check, X } from "lucide-react";

export default function SuggestionCard({ suggestion, onApply, onDismiss }) {
  return (
    <article className="ai-suggestion-card">
      <h3>{suggestion.title}</h3>

      <p>{suggestion.description}</p>

      {suggestion.suggestedText && (
        <div className="ai-suggested-text">{suggestion.suggestedText}</div>
      )}

      <div className="ai-suggestion-actions">
        {suggestion.suggestedText && (
          <button
            type="button"
            className="ai-apply-btn"
            onClick={() => onApply(suggestion)}
          >
            <Check size={16} />
            Apply Suggestion
          </button>
        )}

        <button
          type="button"
          className="ai-dismiss-btn"
          onClick={() => onDismiss(suggestion.id)}
        >
          <X size={16} />
          Dismiss
        </button>
      </div>
    </article>
  );
}
