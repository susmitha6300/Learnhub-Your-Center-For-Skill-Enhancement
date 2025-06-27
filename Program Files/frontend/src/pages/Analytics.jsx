import { Container, Row, Col } from 'react-bootstrap';
import StatsCard from '../components/StatsCard';

function Analytics() {
  return (
    <Container className="py-4">
      <div className="page-header mb-4">
        <h1 className="display-6 fw-bold">Analytics Dashboard</h1>
        <p className="text-muted">Track your performance and insights</p>
      </div>

      <Row>
        <Col md={6} lg={3} className="mb-4">
          <StatsCard
            title="Total Revenue"
            value="$12,450"
            icon="💰"
            color="success"
            trend={{ type: 'up', value: '+12%' }}
          />
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <StatsCard
            title="Total Students"
            value="3,247"
            icon="👥"
            color="primary"
            trend={{ type: 'up', value: '+8%' }}
          />
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <StatsCard
            title="Course Completions"
            value="892"
            icon="🎓"
            color="info"
            trend={{ type: 'up', value: '+15%' }}
          />
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <StatsCard
            title="Average Rating"
            value="4.8"
            icon="⭐"
            color="warning"
            trend={{ type: 'up', value: '+0.2' }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Analytics;
