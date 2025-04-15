
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're sure there's no session
    const checkSession = setTimeout(() => {
      if (!session) {
        console.log('No session found in ProtectedRoute, redirecting to /auth');
        navigate('/auth');
      }
    }, 500); // Small delay to allow session check to complete

    return () => clearTimeout(checkSession);
  }, [session, navigate]);

  // Don't render anything while checking session
  if (session === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
