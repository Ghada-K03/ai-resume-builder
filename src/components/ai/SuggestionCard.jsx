import { ArrowRight, X } from "lucide-react";

export default function SuggestionCard({ suggestion, onApply, onDismiss }) {
  return (
    <article className="ai-suggestion-card">
      <div className="ai-suggestion-top">
        <h3>
          <button
            type="button"
            className="ai-suggestion-title-btn"
            onClick={() => onApply(suggestion)}
          >
            {suggestion.title}
          </button>
        </h3>

        <span className={`ai-priority ai-priority-${suggestion.priority}`}>
          {suggestion.priority} priority
        </span>
      </div>

      <p>{suggestion.description}</p>

      <div className="ai-suggested-text">
        <strong>Recommendation:</strong>
        <p>{suggestion.recommendation}</p>
      </div>

      <div className="ai-suggestion-actions">
        <button
          type="button"
          className="ai-apply-btn"
          onClick={() => onApply(suggestion)}
        >
          <ArrowRight size={16} />
          Go to Field
        </button>

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
