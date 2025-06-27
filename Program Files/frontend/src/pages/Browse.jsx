import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useCallback, useMemo } from 'react';
import CourseCard from '../components/CourseCard';
import CourseFilter from '../components/CourseFilter';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

function Browse() {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotification();

  const {
    courses,
    loading,
    error,
    pagination,
    fetchCourses,
    enrollInCourse,
    loadMore,
    filters,
    setFilters
  } = useCourses();

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleEnroll = useCallback(async (course) => {
    if (!isAuthenticated) {
      return notify.warning('Please login to enroll in courses');
    }
    
    if (!user || !['student', 'teacher', 'admin'].includes(user.role)) {
      return notify.error('Only students can enroll in courses');
    }

    const result = await enrollInCourse(course._id, course.title);
    if (result.success) {
      fetchCourses({}, false);
    }
  }, [isAuthenticated, user, notify, enrollInCourse, fetchCourses]);

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.totalPages && !loading) {
      loadMore();
    }
  }, [pagination.page, pagination.totalPages, loading, loadMore]);

  const handleRetry = useCallback(() => {
    fetchCourses({}, false);
  }, [fetchCourses]);

  const courseCards = useMemo(() => {
    return courses.map(course => (
      <Col md={6} lg={4} className="mb-4" key={course._id}>
        <CourseCard
          course={{
            id: course._id,
            title: course.title,
            description: course.description,
            instructor: course.instructor?.name || 'Unknown Instructor',
            image: course.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop`,
            price: course.price,
            level: course.level,
            rating: course.rating || 0,
            studentsCount: course.enrolledStudents?.length || 0,
            duration: course.totalDuration ? `${Math.round(course.totalDuration / 60)} hours` : 'N/A',
            category: course.category,
            isEnrolled: course.enrolledStudents?.includes(user?._id) || false
          }}
          onEnroll={() => handleEnroll(course)}
          loading={loading}
        />
      </Col>
    ));
  }, [courses, user?._id, handleEnroll, loading]);

  const loadingSkeletons = useMemo(() => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Col md={6} lg={4} className="mb-4" key={index}>
        <LoadingSkeleton type="course-card" />
      </Col>
    ));
  }, []);

  return (
    <div className="browse-page">
      <Container className="py-4">
        <div className="page-header mb-4">
          <h1 className="display-5 fw-bold mb-2">Browse Courses</h1>
          <p className="lead text-muted">
            Discover your next learning adventure from our extensive course catalog
          </p>
        </div>

        <div className="filters-section mb-5">
          <CourseFilter onFilterChange={handleFilterChange} initialFilters={filters} />
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>Error Loading Courses</Alert.Heading>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={handleRetry}>
              Try Again
            </button>
          </Alert>
        )}

        <div className="results-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">
              {loading && courses.length === 0 
                ? 'Loading...' 
                : `Showing ${courses.length} of ${pagination.total} courses`
              }
            </h5>
            {pagination.totalPages > 1 && (
              <small className="text-muted">
                Page {pagination.page} of {pagination.totalPages}
              </small>
            )}
          </div>

          {loading && courses.length === 0 && (
            <Row>
              {loadingSkeletons}
            </Row>
          )}

          {!loading && courses.length === 0 && !error && (
            <div className="text-center py-5">
              <h4>No courses found</h4>
              <p className="text-muted">Try adjusting your filters or search terms</p>
            </div>
          )}

          {courses.length > 0 && (
            <>
              <Row>
                {courseCards}
              </Row>

              {pagination.page < pagination.totalPages && (
                <div className="text-center mt-4">
                  <button 
                    className="btn btn-outline-primary btn-lg" 
                    onClick={handleLoadMore} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Loading...
                      </>
                    ) : (
                      'Load More Courses'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Browse;
