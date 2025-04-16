import jwt_decode from 'jwt-decode';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZ…'; // Replace with your token

try {
  const decodedToken = jwt_decode(token);
  console.log('Decoded Token:', decodedToken);
} catch (error) {
  console.error('Error decoding token:', error);
}
