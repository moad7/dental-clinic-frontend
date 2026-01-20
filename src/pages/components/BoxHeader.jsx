import './boxHeader.css';
const BoxHeader = ({ title, subtitle, actionLabel, onAction, actionIcon }) => {
  return (
    <div className="container-box header-box">
      <div className="header-box-text">
        <span className="greeting-title">{title}</span>
        {subtitle && <span className="greeting-subtitle">{subtitle}</span>}
      </div>

      {actionLabel && (
        <button className="header-box-action" onClick={onAction} type="button">
          {actionIcon && (
            <span className="header-box-action-icon">{actionIcon}</span>
          )}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default BoxHeader;
