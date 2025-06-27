import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap'

function DashboardAdmin() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Teacher", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Student", status: "Active" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Student", status: "Inactive" }
  ]

  const courses = [
    { id: 1, title: "React Fundamentals", instructor: "John Doe", students: 1200, status: "Published" },
    { id: 2, title: "Vue.js Basics", instructor: "Jane Smith", students: 0, status: "Pending" }
  ]

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">156</h3>
              <p>Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">42</h3>
              <p>Total Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">$45,230</h3>
              <p>Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">8</h3>
              <p>Pending Approvals</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Recent Users</h4>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>
                        <Badge bg={user.role === 'Teacher' ? 'primary' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={user.status === 'Active' ? 'success' : 'danger'}>
                          {user.status}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h4>Course Management</h4>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.students}</td>
                      <td>
                        <Badge bg={course.status === 'Published' ? 'success' : 'warning'}>
                          {course.status}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-success" size="sm">
                          Approve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default DashboardAdmin
