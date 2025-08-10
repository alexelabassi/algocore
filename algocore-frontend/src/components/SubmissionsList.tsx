import React, { useState, useEffect } from 'react';
import { SubmissionListDto, PaginatedResponse } from '../types';
import { apiService } from '../services/api';
import { SubmissionCard } from './SubmissionCard';
import { Pagination } from './Pagination';
import { Loader } from './Loader';

interface SubmissionsListProps {
  problemId: string;
}

export const SubmissionsList: React.FC<SubmissionsListProps> = ({ problemId }) => {
  const [submissions, setSubmissions] = useState<SubmissionListDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const [pageSize] = useState(10);

  const fetchSubmissions = async (page: number, mode: 'all' | 'my') => {
    setLoading(true);
    try {
      let response: PaginatedResponse<SubmissionListDto>;
      
      if (mode === 'all') {
        response = await apiService.getSubmissionsForProblem(problemId, page, pageSize);
      } else {
        response = await apiService.getUserSubmissionsForProblem(problemId, page, pageSize);
      }
      
      setSubmissions(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentPage, viewMode);
  }, [problemId, currentPage, viewMode]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewModeChange = (mode: 'all' | 'my') => {
    setViewMode(mode);
    setCurrentPage(0);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#111827',
          margin: 0
        }}>
          Submissions
        </h2>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleViewModeChange('all')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              backgroundColor: viewMode === 'all' ? '#3b82f6' : 'white',
              color: viewMode === 'all' ? 'white' : '#374151',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            All Submissions
          </button>
          <button
            onClick={() => handleViewModeChange('my')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              backgroundColor: viewMode === 'my' ? '#3b82f6' : 'white',
              color: viewMode === 'my' ? 'white' : '#374151',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            My Submissions
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {submissions.length} of {totalElements} submissions
        </span>
      </div>

      {submissions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            No submissions found for this problem.
          </p>
        </div>
      ) : (
        <>
          <div>
            {submissions.map((submission) => (
              <SubmissionCard key={submission.submissionId} submission={submission} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
