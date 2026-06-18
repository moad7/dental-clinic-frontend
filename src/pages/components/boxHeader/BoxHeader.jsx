import { FiSearch } from 'react-icons/fi';
import './boxHeader.css';
const BoxHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
  searchBox,
  search,
  setSearch,
}) => {
  return (
    <div className="container-box header-box">
      {searchBox && (
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder=""
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      )}
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
