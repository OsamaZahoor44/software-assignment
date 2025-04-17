import { useState } from 'react';
import { useRouter } from 'next/router';
import { signupUser } from '../utils/api';

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupUser({ email, password });
      router.push('/login');
    } catch (err) {
      setError('Error creating an account. Please try again.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">Openverse Media Search</h1>
          <button
            className="signup-btn"
            onClick={() => router.push('/login')}
          >
            Login
          </button>
        </div>
      </nav>

      <div className="signup-container">
        <div className="signup-form">
          <h1>Sign Up</h1>
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                id="show-password"
              />
              <label htmlFor="show-password">Show Password</label>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        /* Navbar Styles */
        .navbar {
          background-color: #2563eb; /* Darkened color */
          padding: 15px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .navbar-content {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
        }

        .navbar-title {
          font-size: 2rem;
          font-family: 'Dancing Script', cursive;
          font-style: italic;
          color: white;
          text-align: center;
          flex-grow: 1;
          font-weight: bold; /* Make it bold */
        }

        .signup-btn {
          padding: 10px 20px;
          background-color: white;
          color: black;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
          font-weight: 600;
        }

        .signup-btn:hover {
          background-color: #3b82f6;
          color: white;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Shadow effect */
        }

        /* Signup Page Styles */
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 70px); /* Adjust for navbar height */
          background-color: #f4f7fa;
        }

        .signup-form {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 20px;
        }

        .input-group {
          margin-bottom: 15px;
          text-align: left;
        }

        label {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 5px;
          color: #333;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          margin-top: 5px;
        }

        .input-field:focus {
          outline: none;
          border-color: #2563eb;
        }

        .checkbox-group {
          margin-top: 10px;
          text-align: left;
        }

        .checkbox-group input {
          margin-right: 10px;
        }

        .error-message {
          color: #e53e3e;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        .signup-button {
          width: 100%;
          padding: 12px;
          background-color: #2563eb; /* Darkened color */
          color: white;
          font-size: 1.1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .signup-button:hover {
          background-color: #1e4db5; /* Darkened color */
        }

        @media (max-width: 600px) {
          .signup-form {
            padding: 20px;
          }

          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
