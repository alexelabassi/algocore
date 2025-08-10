import React, { useState, useEffect } from 'react';
import { ProblemDetailsDto, ProblemDifficulty, SchoolGrade } from '../types';
import { ProblemCard } from '../components/ProblemCard';
import { Loader } from '../components/Loader';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import { Search, Filter } from 'lucide-react';

export const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<ProblemDetailsDto[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ProblemDetailsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | 'ALL'>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<SchoolGrade | 'ALL'>('ALL');

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, selectedDifficulty, selectedGrade]);

  const fetchProblems = async () => {
    try {
      const data = await apiService.getAllProblems();
      setProblems(data);
    } catch (error) {
      toast.error('Failed to fetch problems');
      console.error('Error fetching problems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'ALL') {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty);
    }

    // Filter by school grade
    if (selectedGrade !== 'ALL') {
      filtered = filtered.filter(problem => problem.schoolGrade === selectedGrade);
    }

    setFilteredProblems(filtered);
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            Practice Problems
          </h1>
          <p style={{ color: '#6b7280' }}>
            Choose problems that match your grade level and challenge yourself!
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          border: '1px solid #e5e7eb', 
          padding: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {/* Search */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#9ca3af', 
                  width: '1rem', 
                  height: '1rem' 
                }} />
                <input
                  type="text"
                  placeholder="Search for problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as ProblemDifficulty | 'ALL')}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: 'white'
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
                <option value="ALL">All Difficulties</option>
                <option value={ProblemDifficulty.EASY}>Easy</option>
                <option value={ProblemDifficulty.MEDIUM}>Medium</option>
                <option value={ProblemDifficulty.HARD}>Hard</option>
              </select>
            </div>

            {/* Grade Filter */}
            <div>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as SchoolGrade | 'ALL')}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: 'white'
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
                <option value="ALL">All Grades</option>
                <option value={SchoolGrade.GRADE_9}>Grade 9</option>
                <option value={SchoolGrade.GRADE_10}>Grade 10</option>
                <option value={SchoolGrade.GRADE_11}>Grade 11</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#6b7280' }}>
            Found {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} 
            {problems.length > 0 && ` out of ${problems.length} total`}
          </p>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Filter style={{ 
              margin: '0 auto 1rem auto', 
              width: '3rem', 
              height: '3rem', 
              color: '#9ca3af' 
            }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>
              No problems found
            </h3>
            <p style={{ color: '#6b7280' }}>
              Try adjusting your search or filter criteria. Don't worry - there are plenty of problems to practice with!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 