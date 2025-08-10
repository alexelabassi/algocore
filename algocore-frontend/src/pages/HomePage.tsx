import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code, Target, Users, Trophy } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Hero Section */}
      <div style={{ backgroundColor: 'white' }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '6rem 1rem',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Welcome to{' '}
            <span style={{ color: '#2563eb' }}>AlgoCore</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280',
            maxWidth: '48rem',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6'
          }}>
            Your personal coding playground! Practice algorithms, solve problems, and improve your programming skills 
            with carefully selected exercises designed for high school students.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link
                to="/problems"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 2rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Start Practicing
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.75rem 2rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  Join Your Class
                </Link>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.75rem 2rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    textDecoration: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    border: '1px solid #d1d5db',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '3rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '0.875rem', 
              color: '#2563eb', 
              fontWeight: '600', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              What You'll Learn
            </h2>
            <p style={{ 
              fontSize: '2.25rem', 
              fontWeight: '800', 
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Master programming step by step
            </p>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#6b7280',
              maxWidth: '42rem',
              margin: '0 auto'
            }}>
              From basic concepts to advanced algorithms, practice with problems designed specifically for your grade level.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem'
          }}>
            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '3rem',
                height: '3rem',
                backgroundColor: '#2563eb',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Code style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Interactive Code Editor
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Write, test, and submit your solutions with our powerful editor. Support for Java, Python, and C++ 
                to match your curriculum.
              </p>
            </div>

            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '3rem',
                height: '3rem',
                backgroundColor: '#2563eb',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Target style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Grade-Appropriate Problems
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Problems carefully selected for grades 9, 10, and 11. Start with fundamentals and progress to 
                more challenging algorithms.
              </p>
            </div>

            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '3rem',
                height: '3rem',
                backgroundColor: '#2563eb',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Users style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Class Community
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Learn together with your classmates. See how others approach problems and share your solutions 
                in a supportive environment.
              </p>
            </div>

            <div style={{ position: 'relative', paddingLeft: '3rem' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '3rem',
                height: '3rem',
                backgroundColor: '#2563eb',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Trophy style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Track Your Progress
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Monitor your learning journey with detailed submission history. See your improvement over time 
                and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ backgroundColor: '#1e40af', padding: '4rem 0' }}>
        <div style={{ 
          maxWidth: '42rem', 
          margin: '0 auto', 
          textAlign: 'center',
          padding: '0 1rem'
        }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: '800', 
            color: 'white',
            marginBottom: '1rem'
          }}>
            <span style={{ display: 'block' }}>Ready to code?</span>
            <span style={{ display: 'block' }}>Start your programming journey!</span>
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#bfdbfe',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Join your classmates and discover the exciting world of programming with AlgoCore.
          </p>
          <Link
            to={isAuthenticated ? "/problems" : "/register"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 2rem',
              backgroundColor: 'white',
              color: '#2563eb',
              textDecoration: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            {isAuthenticated ? "Start Practicing" : "Join Your Class"}
          </Link>
        </div>
      </div>
    </div>
  );
}; 