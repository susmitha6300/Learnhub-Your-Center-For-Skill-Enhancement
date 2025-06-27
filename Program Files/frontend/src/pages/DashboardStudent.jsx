import { Container, Row, Col, Card, ProgressBar, Button } from 'react-bootstrap'

function DashboardStudent() {
  const enrolledCourses = [
    { id: 1, title: "React Fundamentals", progress: 75, nextLesson: "State Management" },
    { id: 2, title: "JavaScript Advanced", progress: 30, nextLesson: "Closures" },
    { id: 3, title: "Node.js Basics", progress: 90, nextLesson: "Final Project" }
  ]

  return (
    <Container className="py-4">
      <h1 className="mb-4">Student Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">3</h3>
              <p>Enrolled Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">1</h3>
              <p>Completed Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">65%</h3>
              <p>Average Progress</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mb-3">My Courses</h2>
      <Row>
        {enrolledCourses.map(course => (
          <Col md={6} lg={4} key={course.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Progress</small>
                    <small>{course.progress}%</small>
                  </div>
                  <ProgressBar now={course.progress} />
                </div>
                <p className="text-muted small mb-3">
                  Next: {course.nextLesson}
                </p>
                <Button variant="primary" size="sm">
                  Continue Learning
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default DashboardStudent
