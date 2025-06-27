import { Container, Row, Col, Button } from 'react-bootstrap'
import CourseCard from '../components/CourseCard'
import { useState } from 'react'

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const courses = [
    {
      id: 1,
      title: "Complete React Mastery",
      instructor: "Sarah Johnson",
      description: "Master React from fundamentals to advanced patterns with real-world projects.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      level: "Beginner",
      price: 89,
      rating: 4.8,
      students: 12847
    },
    {
      id: 2,
      title: "Advanced JavaScript Patterns",
      instructor: "David Chen",
      description: "Deep dive into JavaScript design patterns, async programming, and performance optimization.",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
      level: "Advanced",
      price: 129,
      rating: 4.9,
      students: 8934
    },
    {
      id: 3,
      title: "Full-Stack Web Development",
      instructor: "Maria Rodriguez",
      description: "Build complete web applications with modern technologies and best practices.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      level: "Intermediate",
      price: 0,
      rating: 4.7,
      students: 15632
    }
  ]

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title fade-in-up">
                Learn Without Limits
              </h1>
              <p className="hero-subtitle fade-in-up">
                Join millions of learners worldwide and master new skills with our expert-led courses. Start your journey today.
              </p>
              <Button className="cta-button fade-in-up">
                Start Learning Now
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                alt="Learning" 
                className="img-fluid rounded-4 shadow-lg fade-in-up"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Courses Section */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Featured Courses</h2>
          <p className="lead text-muted">Discover our most popular courses taught by industry experts</p>
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for courses, instructors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Row>
          {filteredCourses.map(course => (
            <Col md={6} lg={4} className="mb-4" key={course.id}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default Home
