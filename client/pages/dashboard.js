// pages/dashboard.js
import ProtectedRoute from '../components/ProtectedRoute';

const DashboardPage = () => {
    return (
      <ProtectedRoute>
        <div>
          <h1>Welcome to the Dashboard</h1>
          <p>You are authenticated!</p>
        </div>
      </ProtectedRoute>
    );
  };
  
  export default DashboardPage;
  
