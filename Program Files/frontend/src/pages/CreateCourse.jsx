import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../utils/constants';

function CreateCourse() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: 0
  });

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Course created:', courseData);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <div className="page-header mb-4">
            <h1 className="display-6 fw-bold">Create New Course</h1>
            <p className="text-muted">Share your knowledge</p>
          </div>

          <Card>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={courseData.title}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={courseData.description}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={courseData.category}
                        onChange={handleChange}
                        className="modern-input"
                        required
                      >
                        <option value="">Select Category</option>
                        {COURSE_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Level</Form.Label>
                      <Form.Select
                        name="level"
                        value={courseData.level}
                        onChange={handleChange}
                        className="modern-input"
                        required
                      >
                        <option value="">Select Level</option>
                        {Object.values(COURSE_LEVELS).map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={courseData.price}
                    onChange={handleChange}
                    min="0"
                    className="modern-input"
                  />
                </Form.Group>

                <Button type="submit" variant="primary">
                  Create Course
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateCourse;
