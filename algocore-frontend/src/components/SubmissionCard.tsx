import React from 'react';
import { SubmissionListDto, SubmissionResult } from '../types';

interface SubmissionCardProps {
  submission: SubmissionListDto;
}

const getResultColor = (result: SubmissionResult) => {
  switch (result) {
    case SubmissionResult.ACCEPTED:
      return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
    case SubmissionResult.WRONG_ANSWER:
      return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
    case SubmissionResult.RUNTIME_ERROR:
      return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
    case SubmissionResult.COMPILATION_ERROR:
      return { backgroundColor: '#f3e8ff', color: '#7c3aed', borderColor: '#e9d5ff' };
    case SubmissionResult.TIME_LIMIT_EXCEEDED:
      return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
    case SubmissionResult.MEMORY_LIMIT_EXCEEDED:
      return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
    default:
      return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' };
  }
};

const formatRuntime = (runtimeMs: number) => {
  if (runtimeMs < 1000) {
    return `${runtimeMs}ms`;
  }
  return `${(runtimeMs / 1000).toFixed(2)}s`;
};

const formatMemory = (memoryKb: number) => {
  if (memoryKb < 1024) {
    return `${memoryKb}KB`;
  }
  return `${(memoryKb / 1024).toFixed(2)}MB`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
  const resultStyle = getResultColor(submission.result);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '1rem',
      marginBottom: '0.75rem'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '0.75rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            borderRadius: '9999px',
            border: `1px solid ${resultStyle.borderColor}`,
            backgroundColor: resultStyle.backgroundColor,
            color: resultStyle.color,
            whiteSpace: 'nowrap'
          }}>
            {submission.result}
          </span>
          <span style={{
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            {submission.language}
          </span>
        </div>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {formatDate(submission.submittedAt)}
        </span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <span style={{ fontWeight: '500', color: '#374151' }}>
          {submission.username}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>
            Runtime: {formatRuntime(submission.runtimeMs)}
          </span>
          <span>
            Memory: {formatMemory(submission.memoryKb)}
          </span>
        </div>
      </div>
    </div>
  );
};
