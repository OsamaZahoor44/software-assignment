import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken } from '../utils/auth'; // Adjust import if needed

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Wait before rendering

  useEffect(() => {
    // Check if the token exists using the utility method
    const token = getAuthToken();

    if (!token) {
      // If no token, redirect to the login page
      router.push('/login');
    } else {
      // If token exists, proceed and stop the loading state
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return <p>Checking authentication...</p>; // Or a spinner
  }

  return children;
};

export default ProtectedRoute;
