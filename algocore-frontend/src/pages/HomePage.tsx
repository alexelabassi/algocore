import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


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
            Practice algorithms and improve your programming skills with carefully selected problems 
            designed for high school students.
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
                  Get Started
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



      {/* Simple Info Section */}
      <div style={{ backgroundColor: '#f8fafc', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#111827',
              marginBottom: '1rem'
            }}>
              How it works
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '2rem',
              marginTop: '2rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#2563eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '0 auto 1rem auto'
                }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Choose a Problem
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Browse problems by difficulty and grade level
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#2563eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '0 auto 1rem auto'
                }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Write Your Solution
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Solve the problem using your preferred programming language
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#2563eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '0 auto 1rem auto'
                }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Submit and Learn
                </h3>
                <p style={{ color: '#6b7280' }}>
                  Get instant feedback and learn from your results
                </p>
              </div>
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
            Ready to start coding?
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#bfdbfe',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Join your classmates and begin your programming journey with AlgoCore.
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
            {isAuthenticated ? "Start Practicing" : "Get Started"}
          </Link>
        </div>
      </div>
    </div>
  );
}; 