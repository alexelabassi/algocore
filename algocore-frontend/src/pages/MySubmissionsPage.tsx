import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SubmissionListDto, SubmissionResult, PaginatedResponse } from '../types';
import apiService from '../services/api';
import { Loader } from '../components/Loader';

const MySubmissionsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [filterResult, setFilterResult] = useState<SubmissionResult | 'ALL'>('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      setError('Please log in to view your submissions');
      setLoading(false);
      return;
    }

    fetchSubmissions();
  }, [isAuthenticated, currentPage, filterResult]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedResponse<SubmissionListDto> = await apiService.getUserSubmissions(currentPage, pageSize);
      setSubmissions(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result: SubmissionResult) => {
    switch (result) {
      case SubmissionResult.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case SubmissionResult.WRONG_ANSWER:
        return 'bg-red-100 text-red-800';
      case SubmissionResult.RUNTIME_ERROR:
        return 'bg-orange-100 text-orange-800';
      case SubmissionResult.COMPILATION_ERROR:
        return 'bg-yellow-100 text-yellow-800';
      case SubmissionResult.TIME_LIMIT_EXCEEDED:
        return 'bg-purple-100 text-purple-800';
      case SubmissionResult.MEMORY_LIMIT_EXCEEDED:
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRuntime = (runtimeMs: number) => {
    return `${runtimeMs}ms`;
  };

  const formatMemory = (memoryKb: number) => {
    return `${memoryKb}KB`;
  };

  const filteredSubmissions = filterResult === 'ALL' 
    ? submissions 
    : submissions.filter(sub => sub.result === filterResult);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to view your submissions.</p>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="mt-2 text-gray-600">View all your problem submissions and results</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by result:</label>
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value as SubmissionResult | 'ALL')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Results</option>
                <option value={SubmissionResult.ACCEPTED}>Accepted</option>
                <option value={SubmissionResult.WRONG_ANSWER}>Wrong Answer</option>
                <option value={SubmissionResult.RUNTIME_ERROR}>Runtime Error</option>
                <option value={SubmissionResult.COMPILATION_ERROR}>Compilation Error</option>
                <option value={SubmissionResult.TIME_LIMIT_EXCEEDED}>Time Limit Exceeded</option>
                <option value={SubmissionResult.MEMORY_LIMIT_EXCEEDED}>Memory Limit Exceeded</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Total: {totalElements} submissions
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterResult === 'ALL' 
                  ? "You haven't made any submissions yet." 
                  : `No submissions with result "${filterResult}" found.`
                }
              </p>
              <div className="mt-6">
                <Link
                  to="/problems"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Problems
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <li key={submission.submissionId}>
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(submission.result)}`}>
                              {submission.result}
                            </span>
                            <span className="text-sm text-gray-500">
                              Submission #{submission.submissionId.slice(0, 8)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(submission.submittedAt || new Date().toISOString())}
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Runtime:</span> {formatRuntime(submission.runtimeMs)}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Memory:</span> {formatMemory(submission.memoryKb)}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Language:</span> {submission.language || 'Unknown'}
                          </div>
                        </div>

                        {/* Show problem information if available */}
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Problem:</span>{' '}
                          <Link 
                            to={`/problems/${submission.problemId}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {submission.problemTitle}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissionsPage;
