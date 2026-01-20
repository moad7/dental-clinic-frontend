import './dashboardStats.css';
import { DASHBOARD_SECRETARY_ICONS } from '../../../utils/dashboardDataStats/dashboardIcons';
const DashboardStats = ({ items }) => {
  return (
    <div className="dashboard-cards">
      {items.map((item) => {
        const Icon = DASHBOARD_SECRETARY_ICONS[item.iconKey];
        return (
          <div key={item._id} className="container-box dashboard-card">
            <span className="card-title">{item.title}</span>

            <div className="card-body">
              <div
                className="card-icon"
                style={{ backgroundColor: item.backgroundColor }}
              >
                {Icon && <Icon size={20} color={item.color} />}
              </div>

              <span className="card-value">{item.value}</span>
            </div>

            <span className="card-date">{item.date}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
