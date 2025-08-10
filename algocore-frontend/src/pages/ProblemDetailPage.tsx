import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProblemDetailsDto, SubmissionRequestDto, SubmissionResponseDto, SubmissionResult } from '../types';
import { Loader } from '../components/Loader';
import { SubmissionsList } from '../components/SubmissionsList';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import { Play, CheckCircle, XCircle, Clock, Zap, ArrowLeft, Code, List } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Link } from 'react-router-dom';

const LANGUAGE_OPTIONS = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' }
];

const DEFAULT_CODE = {
  java: `public class Solution {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
  python: `# Your code here
print("Hello, World!")`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`
};

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<ProblemDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [code, setCode] = useState(DEFAULT_CODE.java);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponseDto | null>(null);
  const [activeTab, setActiveTab] = useState<'solve' | 'submissions'>('solve');

  useEffect(() => {
    if (id) {
      fetchProblem();
    }
  }, [id]);

  useEffect(() => {
    setCode(DEFAULT_CODE[selectedLanguage as keyof typeof DEFAULT_CODE] || DEFAULT_CODE.java);
  }, [selectedLanguage]);

  const fetchProblem = async () => {
    try {
      if (!id) return;
      const data = await apiService.getProblemById(id);
      setProblem(data);
    } catch (error) {
      toast.error('Failed to fetch problem details');
      console.error('Error fetching problem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!id || !code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const submission: SubmissionRequestDto = {
        code: code,
        language: selectedLanguage
      };

      const result = await apiService.submitProblem(id, submission);
      setSubmissionResult(result);
      
      if (result.result === SubmissionResult.ACCEPTED) {
        toast.success('🎉 Congratulations! Your solution is correct!');
      } else {
        toast.error(`❌ Submission failed: ${result.result}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
      console.error('Error submitting solution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResultIcon = (result: SubmissionResult) => {
    switch (result) {
      case SubmissionResult.ACCEPTED:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case SubmissionResult.WRONG_ANSWER:
        return <XCircle className="w-5 h-5 text-red-500" />;
      case SubmissionResult.TIME_LIMIT_EXCEEDED:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getResultColor = (result: SubmissionResult) => {
    switch (result) {
      case SubmissionResult.ACCEPTED:
        return 'text-green-600 bg-green-50 border-green-200';
      case SubmissionResult.WRONG_ANSWER:
        return 'text-red-600 bg-red-50 border-red-200';
      case SubmissionResult.TIME_LIMIT_EXCEEDED:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Loader size="large" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            Problem not found
          </h2>
          <p style={{ color: '#6b7280' }}>The problem you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link 
            to="/problems" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            Back to Problems
          </Link>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#111827', 
                marginBottom: '0.5rem' 
              }}>
                {problem.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  borderRadius: '9999px',
                  border: '1px solid',
                  ...(problem.difficulty === 'EASY' ? {
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    borderColor: '#bbf7d0'
                  } : problem.difficulty === 'MEDIUM' ? {
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderColor: '#fde68a'
                  } : {
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderColor: '#fecaca'
                  })
                }}>
                  {problem.difficulty}
                </span>
                <span style={{
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {problem.schoolGrade.replace('GRADE_', 'Grade ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.75rem', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => setActiveTab('solve')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: activeTab === 'solve' ? '#f8fafc' : 'transparent',
                color: activeTab === 'solve' ? '#2563eb' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                borderBottom: activeTab === 'solve' ? '2px solid #2563eb' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Code style={{ width: '1rem', height: '1rem' }} />
              Solve
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: activeTab === 'submissions' ? '#f8fafc' : 'transparent',
                color: activeTab === 'submissions' ? '#2563eb' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                borderBottom: activeTab === 'submissions' ? '2px solid #2563eb' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <List style={{ width: '1rem', height: '1rem' }} />
              Submissions
            </button>
          </div>
        </div>

        {activeTab === 'solve' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '2rem',
            minHeight: 'calc(100vh - 300px)'
          }}>
            {/* Problem Description */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
              border: '1px solid #e5e7eb',
              padding: '2rem',
              overflow: 'auto'
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827', 
                marginBottom: '1.5rem',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.75rem'
              }}>
                Problem Description
              </h2>
              <div style={{ 
                fontSize: '1rem', 
                lineHeight: '1.7', 
                color: '#374151',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit'
              }}>
                {problem.description}
              </div>
            </div>

            {/* Code Editor and Submission */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Language Selector and Submit Button */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              padding: '1rem'
            }}>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: 'white',
                  minWidth: '120px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {LANGUAGE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  opacity: isSubmitting ? 0.6 : 1
                }}
                onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                {isSubmitting ? (
                  <Loader size="small" />
                ) : (
                  <Play style={{ width: '1rem', height: '1rem' }} />
                )}
                <span>{isSubmitting ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>

            {/* Code Editor */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              flex: 1,
              minHeight: '400px'
            }}>
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                }}
              />
            </div>

            {/* Submission Results */}
            {submissionResult && (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
                border: '1px solid #e5e7eb',
                padding: '1.5rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  Submission Result
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid',
                  marginBottom: '1rem',
                  ...(submissionResult.result === SubmissionResult.ACCEPTED ? {
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    borderColor: '#bbf7d0'
                  } : submissionResult.result === SubmissionResult.WRONG_ANSWER ? {
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderColor: '#fecaca'
                  } : {
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderColor: '#fde68a'
                  })
                }}>
                  {getResultIcon(submissionResult.result)}
                  <span style={{ fontWeight: '500' }}>{submissionResult.result}</span>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1rem', 
                  marginBottom: '1rem' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.375rem'
                  }}>
                    <Zap style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Runtime: {submissionResult.runtimeMs}ms
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.375rem'
                  }}>
                    <Clock style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Memory: {submissionResult.memoryKb}KB
                    </span>
                  </div>
                </div>

                {submissionResult.stdout && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                      Output:
                    </h4>
                    <pre style={{ 
                      backgroundColor: '#f9fafb', 
                      padding: '0.75rem', 
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem', 
                      color: '#374151', 
                      overflow: 'auto',
                      border: '1px solid #e5e7eb'
                    }}>
                      {submissionResult.stdout}
                    </pre>
                  </div>
                )}

                {submissionResult.stderr && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                      Error:
                    </h4>
                    <pre style={{ 
                      backgroundColor: '#fef2f2', 
                      padding: '0.75rem', 
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem', 
                      color: '#dc2626', 
                      overflow: 'auto',
                      border: '1px solid #fecaca'
                    }}>
                      {submissionResult.stderr}
                    </pre>
                  </div>
                )}

                {submissionResult.failedTestCaseId && (
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
                      Failed Test Case:
                    </h4>
                    <div style={{ 
                      backgroundColor: '#fef2f2', 
                      padding: '0.75rem', 
                      borderRadius: '0.375rem',
                      border: '1px solid #fecaca'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                        <strong>Expected:</strong> {submissionResult.expectedOutput}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                        <strong>Actual:</strong> {submissionResult.actualOutput}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        ) : (
          <SubmissionsList problemId={id!} />
        )}
      </div>
    </div>
  );
}; 