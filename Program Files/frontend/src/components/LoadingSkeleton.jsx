import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

// Course card skeleton
export const CourseCardSkeleton = () => (
  <Card className="h-100">
    <Placeholder as={Card.Img} variant="top" style={{ height: '200px' }} />
    <Card.Body>
      <Placeholder as={Card.Title} animation="glow">
        <Placeholder xs={8} />
      </Placeholder>
      <Placeholder as={Card.Text} animation="glow">
        <Placeholder xs={6} size="sm" />
      </Placeholder>
      <Placeholder as={Card.Text} animation="glow">
        <Placeholder xs={12} size="sm" />
        <Placeholder xs={8} size="sm" />
      </Placeholder>
      <div className="d-flex justify-content-between align-items-center">
        <Placeholder.Button xs={3} size="sm" />
        <Placeholder.Button xs={4} size="sm" />
      </div>
    </Card.Body>
  </Card>
);

// Dashboard stats skeleton
export const StatsCardSkeleton = () => (
  <Card className="text-center">
    <Card.Body>
      <Placeholder as="h3" animation="glow">
        <Placeholder xs={6} />
      </Placeholder>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={8} />
      </Placeholder>
    </Card.Body>
  </Card>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index}>
              <Placeholder animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex}>
                <Placeholder animation="glow">
                  <Placeholder xs={Math.floor(Math.random() * 4) + 6} />
                </Placeholder>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <Card>
    <Card.Body>
      <div className="d-flex align-items-center mb-4">
        <Placeholder
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            marginRight: '1rem'
          }}
        />
        <div>
          <Placeholder as="h4" animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
        </div>
      </div>
      
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
        <Placeholder xs={8} />
        <Placeholder xs={10} />
      </Placeholder>
    </Card.Body>
  </Card>
);

// Course detail skeleton
export const CourseDetailSkeleton = () => (
  <div>
    <Placeholder
      style={{ width: '100%', height: '300px', marginBottom: '2rem' }}
    />
    
    <Placeholder as="h1" animation="glow">
      <Placeholder xs={8} />
    </Placeholder>
    
    <Placeholder as="p" animation="glow">
      <Placeholder xs={6} size="sm" />
    </Placeholder>
    
    <Placeholder as="p" animation="glow">
      <Placeholder xs={12} />
      <Placeholder xs={10} />
      <Placeholder xs={8} />
    </Placeholder>
    
    <div className="d-flex gap-3 mb-4">
      <Placeholder.Button xs={2} />
      <Placeholder.Button xs={2} />
      <Placeholder.Button xs={2} />
    </div>
  </div>
);

// Generic loading skeleton
export const LoadingSkeleton = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'course-card':
        return <CourseCardSkeleton />;
      case 'stats-card':
        return <StatsCardSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'course-detail':
        return <CourseDetailSkeleton />;
      default:
        return (
          <Card>
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} />
                <Placeholder xs={4} /> <Placeholder xs={6} />
                <Placeholder xs={8} />
              </Placeholder>
            </Card.Body>
          </Card>
        );
    }
  };

  if (count === 1) {
    return <div className={className}>{renderSkeleton()}</div>;
  }

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-3">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
