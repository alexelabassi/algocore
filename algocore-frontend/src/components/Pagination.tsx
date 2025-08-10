import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i < 4; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        pages.push(0);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '2rem'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid #d1d5db',
          backgroundColor: currentPage === 0 ? '#f3f4f6' : 'white',
          color: currentPage === 0 ? '#9ca3af' : '#374151',
          borderRadius: '0.375rem',
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === -1 ? (
            <span style={{ color: '#6b7280', padding: '0.5rem' }}>...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                backgroundColor: currentPage === page ? '#3b82f6' : 'white',
                color: currentPage === page ? 'white' : '#374151',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                minWidth: '2.5rem'
              }}
            >
              {page + 1}
            </button>
          )}
        </React.Fragment>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid #d1d5db',
          backgroundColor: currentPage === totalPages - 1 ? '#f3f4f6' : 'white',
          color: currentPage === totalPages - 1 ? '#9ca3af' : '#374151',
          borderRadius: '0.375rem',
          cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}
      >
        Next
      </button>
    </div>
  );
};
