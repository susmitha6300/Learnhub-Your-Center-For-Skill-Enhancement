import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';

function ProgressBar({ 
  progress = 0, 
  variant = 'primary', 
  size = 'md', 
  showLabel = true, 
  animated = false,
  striped = false,
  className = '' 
}) {
  const getHeight = () => {
    switch (size) {
      case 'sm': return '8px';
      case 'lg': return '20px';
      default: return '12px';
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'success': return '#48bb78';
      case 'warning': return '#ed8936';
      case 'danger': return '#f56565';
      case 'info': return '#4299e1';
      default: return '#667eea';
    }
  };

  return (
    <div className={`custom-progress-wrapper ${className}`}>
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small className="text-muted">Progress</small>
          <small className="fw-bold" style={{ color: getVariantColor() }}>
            {Math.round(progress)}%
          </small>
        </div>
      )}
      
      <div 
        className="custom-progress-container"
        style={{
          height: getHeight(),
          backgroundColor: '#e2e8f0',
          borderRadius: '50px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          className={`custom-progress-bar ${animated ? 'progress-animated' : ''} ${striped ? 'progress-striped' : ''}`}
          style={{
            width: `${Math.min(progress, 100)}%`,
            height: '100%',
            backgroundColor: getVariantColor(),
            borderRadius: 'inherit',
            transition: 'width 0.6s ease',
            background: striped 
              ? `linear-gradient(45deg, ${getVariantColor()} 25%, transparent 25%, transparent 50%, ${getVariantColor()} 50%, ${getVariantColor()} 75%, transparent 75%, transparent)`
              : getVariantColor(),
            backgroundSize: striped ? '1rem 1rem' : 'auto',
            animation: animated ? 'progress-bar-stripes 1s linear infinite' : 'none'
          }}
        />
        
        {progress > 0 && size === 'lg' && (
          <div 
            className="progress-label"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}
          >
            {Math.round(progress)}%
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes progress-bar-stripes {
          0% {
            background-position: 1rem 0;
          }
          100% {
            background-position: 0 0;
          }
        }
        
        .progress-animated {
          animation: progress-bar-stripes 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default ProgressBar;
