import { getStatusStyle } from '../../../utils/functions';
import './statusBadge.css';
export const StatusBadge = ({ type, status }) => {
  const style = getStatusStyle(type, status);
  return (
    <span
      className="status-badge"
      style={{
        '--status-bg': style.bg,
        '--status-color': style.color,
      }}
    >
      {style.text}
    </span>
  );
};
