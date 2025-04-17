import { useState, useEffect } from 'react';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAuthToken } from '../utils/auth';
import { useRouter } from 'next/router';


export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [audioExtensions, setAudioExtensions] = useState({
    mp3: true,
    wav: true,
    ogg: true,
    flac: true,
  });
  const [imageExtensions, setImageExtensions] = useState({
    jpg: true,
    jpeg: true,
    png: true,
    gif: true,
    webp: true,
    bmp: true,
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const getSelectedExtensions = () => {
    if (mediaType === 'audio') {
      return Object.entries(audioExtensions)
        .filter(([_, isChecked]) => isChecked)
        .map(([ext]) => ext)
        .join(',');
    }
    if (mediaType === 'image') {
      return Object.entries(imageExtensions)
        .filter(([_, isChecked]) => isChecked)
        .map(([ext]) => ext)
        .join(',');
    }
    return '';
  };

  const saveSearchHistory = () => {
    const token = getAuthToken();
    let userId = null;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        userId = decodedToken.id;
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.log('No token found');
    }

    if (!userId) {
      console.error('User is not authenticated, cannot save search history');
      return;
    }

    const extensionsString = getSelectedExtensions();
    const searchData = {
      userId,
      query,
      mediaType,
      extensions: extensionsString,
    };

    fetch('http://localhost:5000/api/searchHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Search history saved:', data);
      })
      .catch((error) => {
        console.error('Error saving search history:', error);
      });
  };

  const hasAtLeastOneChecked = (obj) => {
    return Object.values(obj).some((checked) => checked);
  };

  const handleSearchClick = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    console.log('Search clicked:', trimmedQuery);
    saveSearchHistory();
    setPage(1);
    handleSearch(1);
  };

  const truncate = (str, maxLength = 30) => {
    if (!str) return '';
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
  };

  const handleSearch = (currentPage) => {
    if (!query.trim()) return;

    const extensionsString = getSelectedExtensions();
    const queryParams = {
      query,
      mediaType: mediaType === 'all' ? '' : mediaType,
      page: currentPage,
      timestamp: Date.now(),
    };

    if (extensionsString) {
      queryParams.extensions = extensionsString;
    }

    console.log('Query Params:', queryParams);

    setLoading(true);
    fetch(`/api/search?${new URLSearchParams(queryParams)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
        setTotalResults(data.totalResults);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (query && (mediaType === 'image' || mediaType === 'audio')) {
      handleSearch(page);
    }
  }, [audioExtensions, imageExtensions, page]);

  useEffect(() => {
    setPage(1);
  }, [mediaType]);

  const inferType = (media) => {
    const url = media.url || '';
    const ext = url.match(/\.(\w+)(\?.*)?$/i)?.[1]?.toLowerCase();
    if (ext && imageExtensions.hasOwnProperty(ext)) return 'image';
    if (ext && audioExtensions.hasOwnProperty(ext)) return 'audio';
    return 'unknown';
  };

  const handleAudioPlay = (url) => {
    const audioElement = document.querySelector(`audio[src="${url}"]`);
    if (audioElement) {
      if (currentlyPlaying && currentlyPlaying !== audioElement) {
        currentlyPlaying.pause();
      }
      setCurrentlyPlaying(audioElement);
      audioElement.play();
    }
  };

  const handleCheckboxChange = (type, ext) => {
    if (type === 'audio') {
      const updated = { ...audioExtensions, [ext]: !audioExtensions[ext] };
      if (!hasAtLeastOneChecked(updated)) {
        alert('Please keep at least one audio extension selected.');
        return;
      }
      setAudioExtensions(updated);
    } else if (type === 'image') {
      const updated = { ...imageExtensions, [ext]: !imageExtensions[ext] };
      if (!hasAtLeastOneChecked(updated)) {
        alert('Please keep at least one image extension selected.');
        return;
      }
      setImageExtensions(updated);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const hasResults = Array.isArray(results) && results.length > 0;

  return (
    <ProtectedRoute>
    <div className="page-container">
  <div className="navbar">
    <h1 className="navbar-title">Openverse Media Search</h1>
    <div className="navbar-buttons">
      <button onClick={() => router.push('/history')}>History</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  </div>

  <div className="search-container">
    <div className="content">
      <div className="search-box center-align">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          placeholder="Search for images, videos, or audio"
        />
        <button onClick={() => handleSearchClick()} disabled={loading}>
          {loading ? <div className="loader" /> : 'Search'}
        </button>
      </div>

      <div className="filter-container center-align">
        <label htmlFor="mediaType">Filter by Media Type: </label>
        <select
          id="mediaType"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="filter-dropdown"
        >
          <option value="MediaType">--Select Media Type--</option>
          <option value="image">Images</option>
          <option value="audio">Audio</option>
        </select>

        {mediaType === 'image' && (
          <div>
            <h3>Image Extensions</h3>
            {Object.keys(imageExtensions).map((ext) => (
              <label key={ext}>
                <input
                  type="checkbox"
                  checked={imageExtensions[ext]}
                  onChange={() => handleCheckboxChange('image', ext)}
                />
                {ext.toUpperCase()}
              </label>
            ))}
          </div>
        )}

        {mediaType === 'audio' && (
          <div>
            <h3>Audio Extensions</h3>
            {Object.keys(audioExtensions).map((ext) => (
              <label key={ext}>
                <input
                  type="checkbox"
                  checked={audioExtensions[ext]}
                  onChange={() => handleCheckboxChange('audio', ext)}
                />
                {ext.toUpperCase()}
              </label>
            ))}
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      {hasResults && (
        <p className="results-count">Showing {results.length} result(s)</p>
      )}

      <div className="results-container">
        {loading ? (
          <p>Loading...</p>
        ) : hasResults ? (
          <div className="media-grid">
            {results.map((media, index) => {
              const type = inferType(media);
              return (
                <div key={index} className="media-item">
                  {type === 'image' ? (
                    <div className="media-content">
                      <img src={media.url} alt={media.title || 'Media item'} />
                      <p>{truncate(media.title) || 'No Title'}</p>
                    </div>
                  ) : type === 'audio' ? (
                    <div className="audio-container">
                      <audio
                        className="audio-player"
                        controls
                        src={media.url}
                        onPlay={() => handleAudioPlay(media.url)}
                      >
                        <source src={media.url} />
                        Your browser does not support the audio element.
                      </audio>
                      <p>{truncate(media.title) || 'No Title'}</p>
                    </div>
                  ) : (
                    <div>
                      <p>Unsupported media type</p>
                      <code>{JSON.stringify(media, null, 2)}</code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          !loading && <p>No media found</p>
        )}
      </div>
    </div>

    <div className="pagination">
      {page > 1 && (
        <button onClick={() => setPage(page - 1)} className="pagination-button">
          Previous
        </button>
      )}
      <span>Page {page}</span>
      <button
        onClick={() => setPage(page + 1)}
        className="pagination-button"
        disabled={!hasResults || !totalResults || page * 20 >= totalResults}
      >
        Next
      </button>
    </div>
  </div>

  <style jsx>{`
    .navbar {
      background-color: #2563eb;
      padding: 15px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-buttons button {
      margin-left: 10px;
      background-color: white;
      color: black;
      border: none;
      padding: 6px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
    }


    .center-align {
      display: flex;
      justify-content: center;
      flex-direction: column;
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

    .search-box {
      display: flex;
      width: 100%; /* Ensures the container is full width */
      align-items: center;
    }

    .search-box input {
      flex-grow: 1; /* Input will take up remaining space */
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 10px;
    }

    .search-box button {
      padding: 6px 12px;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
      
    }



    .loader {
      border: 4px solid #eee;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .audio-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      padding: 10px;
    }

    .audio-player {
      width: 300px;
      height: 40px;
    }

    .media-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .media-item {
      margin: 10px;
      text-align: center;
    }

    .media-content {
      margin-bottom: 10px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }

    .pagination-button {
      padding: 5px 15px;
      margin: 0 10px;
      cursor: pointer;
    }

    .filter-container {
      margin-top: 15px;
    }

    .filter-dropdown {
      padding: 5px;
    }

    .media-item img {
      width: 200px;
      height: 200px;
      object-fit: cover;
    }

    .error-message {
      color: red;
    }

    .results-count {
      margin-top: 10px;
    }
  `}</style>
</div>
    </ProtectedRoute>
  );
}
