import { useState } from 'react';
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../hooks/useAuth';

function MyCourses() {
  const { user } = useAuth();
  
  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: "Complete React Development",
      instructor: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      price: 89,
      level: "Beginner",
      rating: 4.8,
      studentsCount: 12847,
      duration: "40 hours",
      category: "Web Development",
      progress: 75,
      isEnrolled: true
    },
    {
      id: 2,
      title: "Advanced JavaScript Patterns",
      instructor: "David Chen",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
      price: 129,
      level: "Advanced",
      rating: 4.9,
      studentsCount: 8934,
      duration: "35 hours",
      category: "Web Development",
      progress: 30,
      isEnrolled: true
    }
  ];

  const completedCourses = [
    {
      id: 3,
      title: "Full-Stack Web Development",
      instructor: "Maria Rodriguez",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      price: 0,
      level: "Intermediate",
      rating: 4.7,
      studentsCount: 15632,
      duration: "60 hours",
      category: "Web Development",
      progress: 100,
      isEnrolled: true,
      completedAt: "2024-01-15"
    }
  ];

  return (
    <Container className="py-4">
      <div className="page-header mb-4">
        <h1 className="display-6 fw-bold">My Courses</h1>
        <p className="text-muted">Track your learning progress and continue where you left off</p>
      </div>

      <Tabs defaultActiveKey="in-progress" className="mb-4">
        <Tab eventKey="in-progress" title={`In Progress (${enrolledCourses.length})`}>
          <Row>
            {enrolledCourses.map(course => (
              <Col md={6} lg={4} className="mb-4" key={course.id}>
                <CourseCard 
                  course={course} 
                  showProgress={true}
                />
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="completed" title={`Completed (${completedCourses.length})`}>
          <Row>
            {completedCourses.map(course => (
              <Col md={6} lg={4} className="mb-4" key={course.id}>
                <CourseCard 
                  course={course} 
                  showProgress={true}
                />
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default MyCourses;
