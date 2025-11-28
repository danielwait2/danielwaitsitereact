# Port Configuration Fix

## Issue
Port 5000 was being used by macOS AirPlay Receiver, causing 403 Forbidden errors.

## Solution
Changed the backend server port from 5000 to 5001.

## Changes Made
1. ✅ `server/index.js` - Changed default port to 5001
2. ✅ `client/package.json` - Updated proxy to point to port 5001
3. ✅ Updated documentation

## Next Steps

**You need to restart both servers:**

1. **Stop the current backend server** (if running):
   ```bash
   pkill -f "node.*server"
   ```

2. **Start the backend server**:
   ```bash
   npm run server
   ```
   Or from root:
   ```bash
   cd server && node index.js
   ```

3. **Restart the React app** (if needed):
   - Stop current dev server (Ctrl+C)
   - Restart: `cd client && npm start`

The backend will now run on port 5001, and the React app proxy will correctly forward API requests to it.

## Verify It's Working

After restarting, check:
- Backend: http://localhost:5001/api/test (if you add a test route)
- Frontend: http://localhost:3000
- Analytics should no longer show 403 errors


