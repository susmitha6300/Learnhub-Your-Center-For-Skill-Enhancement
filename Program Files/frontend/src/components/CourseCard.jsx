import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import ProgressBar from './ProgressBar';

function CourseCard({ course, showProgress = false, onEnroll, loading = false }) {
  const {
    id,
    title,
    description,
    instructor,
    image,
    price,
    level,
    rating,
    studentsCount,
    duration,
    category,
    progress = 0,
    isEnrolled = false
  } = course;

  const handleEnroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course);
    }
  };

  return (
    <Card className="course-card h-100 shadow-sm">
      <div className="course-image-container">
        <Card.Img 
          variant="top" 
          src={image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop`}
          className="course-image"
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="course-overlay">
          <Badge bg="primary" className="category-badge">
            {category}
          </Badge>
          <Badge 
            bg={level === 'Beginner' ? 'success' : level === 'Intermediate' ? 'warning' : 'danger'} 
            className="level-badge"
          >
            {level}
          </Badge>
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="course-header mb-2">
          <Card.Title className="course-title h6 mb-1">{title}</Card.Title>
          <Card.Text className="instructor-name text-muted small mb-2">
            by {instructor}
          </Card.Text>
        </div>

        <Card.Text className="course-description flex-grow-1 small text-muted">
          {description}
        </Card.Text>

        {showProgress && isEnrolled && (
          <div className="course-progress mb-3">
            <ProgressBar progress={progress} size="sm" />
          </div>
        )}

        <div className="course-meta mb-3">
          <div className="d-flex justify-content-between align-items-center text-muted small">
            <span>⭐ {rating} ({studentsCount} students)</span>
            <span>🕒 {duration}</span>
          </div>
        </div>

        <div className="course-footer">
          <div className="d-flex justify-content-between align-items-center">
            <div className="course-price">
              <span className="price-text fw-bold">
                {price === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  <span className="text-primary">{formatCurrency(price)}</span>
                )}
              </span>
            </div>

            <div className="course-actions">
              {isEnrolled ? (
                <Button 
                  as={Link} 
                  to={`/course/${id}`} 
                  variant="success" 
                  size="sm"
                  className="action-btn"
                >
                  Continue
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button 
                    as={Link} 
                    to={`/course/${id}`} 
                    variant="outline-primary" 
                    size="sm"
                    className="action-btn"
                  >
                    View
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={handleEnroll}
                    disabled={loading}
                    className="action-btn"
                  >
                    {loading ? 'Enrolling...' : 'Enroll'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card.Body>

      <style jsx>{`
        .course-card {
          transition: all 0.3s ease;
          border: none;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
        }
        
        .course-image-container {
          position: relative;
          overflow: hidden;
        }
        
        .course-image {
          transition: transform 0.3s ease;
        }
        
        .course-card:hover .course-image {
          transform: scale(1.05);
        }
        
        .course-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
        }
        
        .category-badge, .level-badge {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9) !important;
          color: #333 !important;
          font-size: 0.7rem;
        }
        
        .course-title {
          color: #2d3748;
          font-weight: 600;
          line-height: 1.3;
        }
        
        .instructor-name {
          font-size: 0.85rem;
        }
        
        .course-description {
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .action-btn {
          border-radius: 6px;
          font-weight: 500;
          padding: 6px 12px;
        }
        
        .price-text {
          font-size: 1.1rem;
        }
      `}</style>
    </Card>
  );
}

export default CourseCard;
