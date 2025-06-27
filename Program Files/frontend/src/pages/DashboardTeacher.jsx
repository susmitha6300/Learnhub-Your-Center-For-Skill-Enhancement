import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap'

function DashboardTeacher() {
  const myCourses = [
    { id: 1, title: "React Fundamentals", students: 1200, revenue: 5880, status: "Published" },
    { id: 2, title: "Advanced React", students: 450, revenue: 3150, status: "Draft" }
  ]

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Teacher Dashboard</h1>
        <Button variant="primary">Create New Course</Button>
      </div>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">2</h3>
              <p>Total Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">1,650</h3>
              <p>Total Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">$9,030</h3>
              <p>Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">4.6</h3>
              <p>Avg Rating</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h3>My Courses</h3>
        </Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Students</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.students}</td>
                  <td>${course.revenue}</td>
                  <td>
                    <span className={`badge bg-${course.status === 'Published' ? 'success' : 'warning'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2">
                      Edit
                    </Button>
                    <Button variant="outline-info" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default DashboardTeacher
