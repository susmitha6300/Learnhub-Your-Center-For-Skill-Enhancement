import { Card } from 'react-bootstrap';

function StatsCard({ title, value, icon, color = 'primary', subtitle, trend }) {
  const getColorClass = () => {
    switch (color) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-danger';
      case 'info': return 'text-info';
      default: return 'text-primary';
    }
  };

  const getBackgroundColor = () => {
    switch (color) {
      case 'success': return '#48bb78';
      case 'warning': return '#ed8936';
      case 'danger': return '#f56565';
      case 'info': return '#4299e1';
      default: return '#667eea';
    }
  };

  return (
    <Card className="stats-card h-100">
      <Card.Body className="d-flex align-items-center">
        <div 
          className="stats-icon me-3"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            backgroundColor: getBackgroundColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}
        >
          {icon}
        </div>
        
        <div className="stats-content flex-grow-1">
          <h3 className={`stats-value mb-1 ${getColorClass()}`}>
            {value}
          </h3>
          <p className="stats-title mb-1 text-muted">{title}</p>
          {subtitle && (
            <small className="stats-subtitle text-muted">{subtitle}</small>
          )}
          {trend && (
            <div className="stats-trend mt-1">
              <small className={trend.type === 'up' ? 'text-success' : 'text-danger'}>
                {trend.type === 'up' ? '↗' : '↘'} {trend.value}
              </small>
            </div>
          )}
        </div>
      </Card.Body>

      <style jsx>{`
        .stats-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        
        .stats-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }
        
        .stats-value {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
        }
        
        .stats-title {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .stats-icon {
          color: white;
        }
      `}</style>
    </Card>
  );
}

export default StatsCard;
