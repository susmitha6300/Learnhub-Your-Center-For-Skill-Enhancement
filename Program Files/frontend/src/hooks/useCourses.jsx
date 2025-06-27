import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { coursesAPI, authAPI } from '../services/api';
import { courseStorage } from '../utils/storage';
import { isCacheValid } from '../utils/api-helpers';
import { useNotification } from './useNotification';

export const useCourses = () => {
  const [filters, setFilters] = useState({});
  const [debouncedFilters] = useDebounce(filters, 300);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const { notify } = useNotification();
  const isInitialMount = useRef(true);
  const prevFilters = useRef({});

  const fetchCourses = useCallback(async (params = {}, useCache = true) => {
    setLoading(true);
    setError(null);

    try {
      const requestFilters = params.filters || debouncedFilters;
      
      if (useCache && isInitialMount.current && Object.keys(requestFilters).length === 0) {
        const cachedCourses = courseStorage.getCachedCourses();
        const lastFetch = courseStorage.getLastFetch();

        if (cachedCourses.length > 0 && isCacheValid(lastFetch)) {
          setCourses(cachedCourses);
          setLoading(false);
          return { success: true, data: cachedCourses };
        }
      }

      const response = await coursesAPI.getAll({ ...requestFilters, ...params });
      const { courses: courseData, pagination: paginationData } = response.data;

      if (params.page > 1) {
        setCourses(prev => [...prev, ...courseData]);
      } else {
        setCourses(courseData);
      }
      
      setPagination(paginationData);

      if (params.page === 1 || !params.page) {
        courseStorage.setCachedCourses(courseData);
        courseStorage.setLastFetch(Date.now());
      }

      setLoading(false);
      return { success: true, data: courseData };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch courses';
      setError(errorMessage);
      notify.apiError(err);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [notify, debouncedFilters]);

  // Initial load only
  useEffect(() => {
    if (isInitialMount.current) {
      fetchCourses({}, true);
      isInitialMount.current = false;
    }
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (!isInitialMount.current && 
        JSON.stringify(prevFilters.current) !== JSON.stringify(debouncedFilters)) {
      prevFilters.current = debouncedFilters;
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchCourses({ page: 1, filters: debouncedFilters }, false);
    }
  }, [debouncedFilters, fetchCourses]);

  const enrollInCourse = useCallback(async (courseId, courseTitle) => {
    setLoading(true);
    setError(null);
    try {
      const response = await coursesAPI.enroll(courseId);
      notify.courseEnrolled(courseTitle);
      setLoading(false);
      return { success: true, enrollment: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to enroll in course';
      setError(errorMessage);
      notify.apiError(err);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [notify]);

  const loadMore = useCallback(async () => {
    if (pagination.page < pagination.totalPages && !loading) {
      const nextPage = pagination.page + 1;
      const response = await fetchCourses({ page: nextPage }, false);
      if (response.success) {
        setPagination(prev => ({ ...prev, page: nextPage }));
      }
    }
  }, [pagination.page, pagination.totalPages, loading, fetchCourses]);

  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const response = await authAPI.getEnrolledCourses();
      setEnrolledCourses(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      notify.apiError(err);
      return { success: false, error: err.message };
    }
  }, [notify]);

  const fetchTeacherCourses = useCallback(async () => {
    try {
      const response = await coursesAPI.getTeacherCourses();
      setTeacherCourses(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      notify.apiError(err);
      return { success: false, error: err.message };
    }
  }, [notify]);

  return {
    courses,
    enrolledCourses,
    teacherCourses,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    fetchCourses,
    enrollInCourse,
    loadMore,
    fetchEnrolledCourses,
    fetchTeacherCourses,
    clearCache: courseStorage.clearCache
  };
};
