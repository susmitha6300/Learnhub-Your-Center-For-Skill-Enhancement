import { Container, Row, Col, Button, Card, Badge, Tab, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

function CourseDetail() {
  const { id } = useParams()
  
  // Mock course data
  const course = {
    id: id,
    title: "React Fundamentals",
    instructor: "John Doe",
    description: "Master React from the ground up with this comprehensive course covering components, hooks, state management, and more.",
    image: "https://via.placeholder.com/600x300?text=React+Course",
    level: "Beginner",
    price: 49,
    rating: 4.5,
    students: 1200,
    duration: "8 hours",
    lessons: 24,
    curriculum: [
      { title: "Introduction to React", duration: "30 min" },
      { title: "Components and JSX", duration: "45 min" },
      { title: "Props and State", duration: "60 min" },
      { title: "Event Handling", duration: "40 min" },
      { title: "Hooks Deep Dive", duration: "90 min" }
    ]
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <img 
            src={course.image} 
            alt={course.title}
            className="img-fluid rounded mb-4"
          />
          
          <Tabs defaultActiveKey="overview" className="mb-4">
            <Tab eventKey="overview" title="Overview">
              <h3>About This Course</h3>
              <p>{course.description}</p>
              
              <h4>What You'll Learn</h4>
              <ul>
                <li>Build modern React applications from scratch</li>
                <li>Understand component lifecycle and hooks</li>
                <li>Manage application state effectively</li>
                <li>Handle user interactions and events</li>
              </ul>
            </Tab>
            
            <Tab eventKey="curriculum" title="Curriculum">
              <h3>Course Content</h3>
              {course.curriculum.map((lesson, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body className="py-2">
                    <div className="d-flex justify-content-between">
                      <span>{lesson.title}</span>
                      <small className="text-muted">{lesson.duration}</small>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Tab>
            
            <Tab eventKey="instructor" title="Instructor">
              <h3>About {course.instructor}</h3>
              <p>Experienced React developer with 5+ years in the industry. Has taught over 10,000 students worldwide.</p>
            </Tab>
          </Tabs>
        </Col>
        
        <Col lg={4}>
          <Card className="sticky-top">
            <Card.Body>
              <h2 className="text-primary mb-3">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </h2>
              
              <Button variant="primary" size="lg" className="w-100 mb-3">
                Enroll Now
              </Button>
              
              <div className="course-info">
                <div className="d-flex justify-content-between mb-2">
                  <span>Level:</span>
                  <Badge bg="success">{course.level}</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Duration:</span>
                  <span>{course.duration}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Lessons:</span>
                  <span>{course.lessons}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Students:</span>
                  <span>{course.students}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Rating:</span>
                  <span>⭐ {course.rating}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CourseDetail
