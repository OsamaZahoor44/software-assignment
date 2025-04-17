import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { getAuthToken } from '../utils/auth'; // Adjust path if needed

export default function SearchHistory() {
  const [history, setHistory] = useState([]);
  const router = useRouter();

  const fetchHistory = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No auth token found');
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/searchHistory/${userId}`);
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch search history:', error);
    }
  };

  const clearHistory = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No auth token found');
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/searchHistory/${userId}`, {
        method: 'DELETE',
      });
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <h1>Search History</h1>

      {history.length === 0 ? (
        <p>No search history found.</p>
      ) : (
        <>
          <button className="clear-btn" onClick={clearHistory}>
            Clear Search History
          </button>

          <table>
            <thead>
              <tr>
                <th>Query</th>
                <th>Media Type</th>
                <th>Extensions</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{item.query}</td>
                  <td>{item.media_type || 'All'}</td>
                  <td>{item.extensions || 'N/A'}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button className="back-btn" onClick={() => router.push('./search')}>
        Back to Search
      </button>

      <style jsx>{`
        .history-container {
          padding: 30px;
          max-width: 800px;
          margin: auto;
          text-align: center;
        }

        table {
          width: 100%;
          margin-top: 20px;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
        }

        th {
          background-color: #f3f3f3;
        }

        .clear-btn, .back-btn {
          margin-top: 20px;
          padding: 10px 20px;
          cursor: pointer;
          border: none;
          background-color: #3b82f6;
          color: white;
          border-radius: 5px;
        }

        .clear-btn:hover, .back-btn:hover {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
}
