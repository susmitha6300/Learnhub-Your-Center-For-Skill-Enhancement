import { useState } from 'react';
import { Form, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../utils/constants';

function CourseFilter({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    priceRange: '',
    rating: '',
    sortBy: 'newest',
    ...initialFilters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      level: '',
      priceRange: '',
      rating: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== 'newest' && value !== ''
  );

  return (
    <div className="course-filter-container">
      <div className="filter-header mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filter Courses</h5>
          {hasActiveFilters && (
            <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      <Form>
        <Row className="g-3">
          {/* Search */}
          <Col md={6} lg={3}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="filter-input"
              />
            </Form.Group>
          </Col>

          {/* Category */}
          <Col md={6} lg={2}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Category</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-input"
              >
                <option value="">All Categories</option>
                {COURSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Level */}
          <Col md={6} lg={2}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Level</Form.Label>
              <Form.Select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="filter-input"
              >
                <option value="">All Levels</option>
                {Object.values(COURSE_LEVELS).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Price Range */}
          <Col md={6} lg={2}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Price</Form.Label>
              <Form.Select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="filter-input"
              >
                <option value="">Any Price</option>
                <option value="free">Free</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Rating */}
          <Col md={6} lg={2}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Rating</Form.Label>
              <Form.Select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="filter-input"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Sort By */}
          <Col md={6} lg={1}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Sort By</Form.Label>
              <Form.Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-input"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters mt-3">
          <div className="d-flex flex-wrap gap-2">
            {filters.search && (
              <span className="filter-tag">
                Search: "{filters.search}"
                <button 
                  className="filter-tag-close"
                  onClick={() => handleFilterChange('search', '')}
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="filter-tag">
                Category: {filters.category}
                <button 
                  className="filter-tag-close"
                  onClick={() => handleFilterChange('category', '')}
                >
                  ×
                </button>
              </span>
            )}
            {filters.level && (
              <span className="filter-tag">
                Level: {filters.level}
                <button 
                  className="filter-tag-close"
                  onClick={() => handleFilterChange('level', '')}
                >
                  ×
                </button>
              </span>
            )}
            {filters.priceRange && (
              <span className="filter-tag">
                Price: {filters.priceRange === 'free' ? 'Free' : `$${filters.priceRange}`}
                <button 
                  className="filter-tag-close"
                  onClick={() => handleFilterChange('priceRange', '')}
                >
                  ×
                </button>
              </span>
            )}
            {filters.rating && (
              <span className="filter-tag">
                Rating: {filters.rating}+ Stars
                <button 
                  className="filter-tag-close"
                  onClick={() => handleFilterChange('rating', '')}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .filter-input {
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 0.9rem;
        }
        
        .filter-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }
        
        .filter-tag {
          display: inline-flex;
          align-items: center;
          background: #f0f4ff;
          color: #667eea;
          padding: 4px 8px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .filter-tag-close {
          background: none;
          border: none;
          color: #667eea;
          margin-left: 6px;
          font-size: 1.2rem;
          line-height: 1;
          cursor: pointer;
        }
        
        .filter-tag-close:hover {
          color: #5a67d8;
        }
      `}</style>
    </div>
  );
}

export default CourseFilter;
