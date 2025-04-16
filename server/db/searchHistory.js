import { poolPromise, sql } from './sql.js';  // Correctly import sql types

// Save search history to the database
export const saveSearchHistoryToDb = (userId, query, mediaType, extensions) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      INSERT INTO search_history (user_id, query, media_type, extensions)
      VALUES (@user_id, @query, @media_type, @extensions)
    `;
    
    poolPromise
      .then(pool => {
        pool.request()
          .input('user_id', sql.Int, userId)
          .input('query', sql.VarChar(255), query)
          .input('media_type', sql.VarChar(50), mediaType)
          .input('extensions', sql.VarChar(255), extensions)
          .query(sqlQuery)
          .then(result => resolve(result))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};

// Get search history for a user
export const getSearchHistoryFromDb = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT * FROM search_history 
      WHERE user_id = @user_id
      ORDER BY timestamp DESC
    `;
    
    poolPromise
      .then(pool => {
        pool.request()
          .input('user_id', sql.Int, userId)
          .query(sqlQuery)
          .then(result => resolve(result.recordset))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};

// Clear all search history
export const clearSearchHistoryInDb = () => {
  return new Promise((resolve, reject) => {
    const sqlQuery = 'DELETE FROM search_history';
    
    poolPromise
      .then(pool => {
        pool.request()
          .query(sqlQuery)
          .then(result => resolve(result))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};
