/**
 * Krishna Kant Pandey — Frontend API Configuration
 * Automatically establishes connection between the Frontend and Backend.
 */

(function () {
  const isLocalDev =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:';

  // 1. If served directly by the backend server on port 4000, use relative paths.
  // 2. If running via VS Code Live Server (port 5500) or directly from file, point to http://localhost:4000.
  // 3. In production, set to your deployed backend domain (e.g. 'https://my-backend.onrender.com') or leave empty if served together.
  if (window.location.port === '4000') {
    window.API_BASE_URL = '';
  } else if (isLocalDev) {
    window.API_BASE_URL = 'http://localhost:4000';
  } else {
    window.API_BASE_URL = '';
  }

  console.log('[API Connector] Backend Base URL:', window.API_BASE_URL || '(same-origin / relative)');
})();
