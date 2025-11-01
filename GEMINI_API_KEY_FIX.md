# Gemini API Key Fix - Use Stored User Settings

## Issue
The homework analyze button was showing "No API key found" even though users had API keys stored at `/api-settings`. The code was checking environment variables instead of using the user's stored API key from their Supabase profile/settings.

## Solution Summary

### 1. Updated `getUserApiKey()` Function (src/lib/userApiKeys.ts)
- **Before**: Only checked the Supabase database
- **After**: 
  - Checks Supabase database first
  - Falls back to localStorage (where SettingsPage currently stores keys)
  - Returns null if no key found (no environment variable fallback)

### 2. Updated `loadApiKey()` Function (src/pages/HomeworkPage.tsx)
- **Before**: 
  ```typescript
  const finalKey = key || import.meta.env.VITE_GEMINI_API_KEY || null;
  ```
- **After**: 
  ```typescript
  setApiKey(key); // Uses only user's key from settings
  ```
- Removed all environment variable fallbacks
- Added better console logging to show key source

### 3. Updated `handleProcess()` Function (src/pages/HomeworkPage.tsx)
- **Before**: Used `effectiveApiKey` with environment variable fallback
- **After**: 
  - Uses only the user's stored API key (`apiKey`)
  - Shows clear error message: "No Gemini API key found!"
  - Offers to redirect user to `/api-settings` page
  - No environment variable fallback

### 4. Improved Error Handling (src/pages/HomeworkPage.tsx)
Added specific error messages for different API error scenarios:
- **400 (Bad Request)**: Invalid API key → Redirect to settings
- **429 (Rate Limit)**: API quota exceeded → Show quota message
- **403 (Forbidden)**: API access denied → Show permission message

### 5. Warning Banner (Already existed in HomeworkPage.tsx)
The UI already had a warning banner that shows when `!apiKey`:
```tsx
{!apiKey && processingStep === 'idle' && (
  <div className="bg-yellow-50 dark:bg-yellow-900/20 ...">
    Please configure your Gemini API key in Settings
  </div>
)}
```

## Testing Checklist

### ✅ User WITHOUT API Key
1. User logs in
2. Goes to `/homework` page
3. Should see yellow warning banner: "API Key Required"
4. Uploads an image
5. Clicks "Analyze with AI"
6. Should see alert: "No Gemini API key found!"
7. Clicking OK should redirect to `/api-settings`

### ✅ User WITH API Key in Settings
1. User logs in
2. Goes to `/api-settings`
3. Adds Gemini API key (stored in localStorage and database)
4. Goes to `/homework` page
5. Should NOT see warning banner
6. Uploads an image
7. Clicks "Analyze with AI"
8. Should successfully call Gemini API with user's key
9. Should show solution

### ✅ User WITH Invalid API Key
1. User has an invalid/expired Gemini API key saved
2. Uploads image and clicks analyze
3. Should get 400 error from Gemini API
4. Should see alert: "Invalid API key!"
5. Clicking OK should redirect to `/api-settings`

### ✅ User WITH Quota Exceeded
1. User's Gemini API key has exceeded quota
2. Should get 429 error from Gemini API
3. Should see alert: "API Quota Exceeded!"

## Technical Details

### API Key Storage
API keys are stored in two places:
1. **localStorage**: `user_api_keys` (array of objects with `api_key` field)
2. **Supabase**: `user_api_keys` table (with `api_key_encrypted` column)

### API Key Retrieval Flow
```
1. Call getUserApiKey(userId, 'gemini')
2. → Try Supabase database first
3. → If not found, check localStorage
4. → Return null if neither has the key
5. → NO fallback to environment variables
```

### Console Logs for Debugging
The code now includes helpful console logs:
```
🔑 Gemini API Key loaded from user settings: true/false
🔑 API Key source: user-settings
⚠️ No Gemini API key found in user settings
✅ Found gemini API key in localStorage
```

## Files Changed
1. `src/lib/userApiKeys.ts` - Enhanced getUserApiKey() to check localStorage
2. `src/pages/HomeworkPage.tsx` - Removed environment variable fallbacks, improved error handling

## Migration Notes
- Users who previously relied on environment variables (VITE_GEMINI_API_KEY) will now need to add their API key in Settings
- This is intentional - we want users to manage their own API keys
- The Settings page already supports saving Gemini API keys

## Acceptance Criteria ✅
- [x] Code fetches Gemini API key from user's Supabase profile/settings
- [x] Also checks localStorage as fallback
- [x] No longer checks environment variables
- [x] Clear error message if user has no API key configured
- [x] Link to `/api-settings` page to add key
- [x] Button works when user has valid API key
- [x] Gemini API call succeeds with user's key
- [x] Solution displays after analysis
- [x] Works for all logged-in users with configured API keys
- [x] Console logs show which key source is being used
- [x] Better error handling for invalid keys, quota exceeded, etc.
