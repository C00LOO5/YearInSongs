// src/utils/tokenManager.js
export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('token_expires_at');
  return expiresAt ? Date.now() > parseInt(expiresAt) : true;
};

export const refreshTokenIfNeeded = async () => {
  if (isTokenExpired()) {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (refreshToken) {
      // Implement token refresh logic
      // Note: This requires backend implementation for security
      console.log('Token expired, refresh needed');
    }
  }
};