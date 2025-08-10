import React from 'react';
import { Link } from 'react-router-dom';
import { ProblemDetailsDto, ProblemDifficulty } from '../types';

interface ProblemCardProps {
  problem: ProblemDetailsDto;
}

const getDifficultyColor = (difficulty: ProblemDifficulty) => {
  switch (difficulty) {
    case ProblemDifficulty.EASY:
      return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
    case ProblemDifficulty.MEDIUM:
      return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
    case ProblemDifficulty.HARD:
      return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
    default:
      return { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' };
  }
};

const formatGrade = (grade: string) => {
  return grade.replace('GRADE_', 'Grade ');
};

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const difficultyStyle = getDifficultyColor(problem.difficulty);

  return (
    <Link to={`/problems/${problem.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: problem.hasSolved ? '2px solid #10b981' : '1px solid #e5e7eb',
        padding: '1.5rem',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      >
        {/* Solved indicator */}
        {problem.hasSolved && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            ✓
          </div>
        )}
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          marginBottom: '1rem' 
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: problem.hasSolved ? '#059669' : '#111827',
            margin: 0,
            lineHeight: '1.4'
          }}>
            {problem.title}
          </h3>
          <span style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            borderRadius: '9999px',
            border: `1px solid ${difficultyStyle.borderColor}`,
            backgroundColor: difficultyStyle.backgroundColor,
            color: difficultyStyle.color,
            whiteSpace: 'nowrap'
          }}>
            {problem.difficulty}
          </span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <span style={{
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            {formatGrade(problem.schoolGrade)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {problem.hasSolved && (
              <span style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span style={{ fontSize: '10px' }}>✓</span>
                Solved
              </span>
            )}
            <span style={{ color: '#9ca3af' }}>
              {/* Acceptance rate would be calculated here if available */}
              {/* {problem.acceptanceRate ? `${problem.acceptanceRate}%` : 'N/A'} */}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}; 