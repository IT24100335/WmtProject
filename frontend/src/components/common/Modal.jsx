export function Modal({ children, onClose, title }) {
  return (
    <div className="overlay-shell" onClick={onClose} role="presentation">
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="panel-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className="stack-md">{children}</div>
      </div>
    </div>
  );
}
