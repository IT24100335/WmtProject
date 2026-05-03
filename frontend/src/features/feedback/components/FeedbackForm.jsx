const STAR_LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

export function FeedbackForm({ error = "", notice = "", review, setReview, onSubmit }) {
  const setRating = (rating) => {
    setReview((prev) => ({ ...prev, rating }));
  };

  return (
    <div className="stack-md">
      <fieldset className="star-fieldset">
        <legend>Rate your order</legend>
        <div className="star-picker" role="radiogroup" aria-label="Feedback rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              aria-label={`${star} star${star > 1 ? "s" : ""} - ${STAR_LABELS[star - 1]}`}
              aria-pressed={review.rating === star}
              className={review.rating >= star ? "star-btn active" : "star-btn"}
              key={star}
              onClick={() => setRating(star)}
              type="button"
            >
              {"\u2605"}
            </button>
          ))}
        </div>
      </fieldset>
      <label>
        Comment
        <textarea
          rows="4"
          value={review.comment}
          onChange={(event) => setReview((prev) => ({ ...prev, comment: event.target.value }))}
          placeholder="Tell us about your order"
        />
      </label>
      {error ? <p className="error-banner">{error}</p> : null}
      {notice ? <p className="success-banner">{notice}</p> : null}
      <button className="primary-btn wide-btn" onClick={onSubmit} type="button">
        Submit feedback
      </button>
    </div>
  );
}


