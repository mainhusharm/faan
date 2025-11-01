# Homework Analyze Button - Testing Checklist

## Pre-Test Setup

### Environment Variables
- [ ] `.env` file exists with `VITE_GEMINI_API_KEY=your_key_here`
- [ ] OR hosting platform has `VITE_GEMINI_API_KEY` configured
- [ ] API key is valid (get from https://aistudio.google.com/app/apikey)

### Application Running
- [ ] Run `npm install` (if first time)
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173 (or your dev URL)
- [ ] Open Browser Developer Console (F12)

## Test 1: Button Visual State

### Step 1: Navigate to Homework Page
- [ ] Click on "Homework" or navigate to `/homework` route
- [ ] Console shows: `🏠 Homework component mounted`
- [ ] Console shows: `👤 User: [email or Not logged in]`

### Step 2: Before Image Upload
- [ ] No "Analyze with AI" button visible (expected - button only shows after upload)

### Step 3: Upload Image
- [ ] Click "Take Photo" or "Choose File"
- [ ] Select an image file (JPG, PNG, etc.)
- [ ] Console shows:
  ```
  === IMAGE SELECTED ===
  📸 Image selected: [filename] [size] [type]
  ✅ Setting selectedImage state
  ✅ Button should now be ENABLED (blue)
  === IMAGE STATE CHANGED ===
  📸 Selected image: [filename]
  🔘 Button should be: ENABLED (blue)
  ```
- [ ] Image preview appears
- [ ] "Edit Image" and "Analyze with AI" buttons appear
- [ ] "Analyze with AI" button is BRIGHT BLUE (#2563eb)
- [ ] Button is fully opaque (opacity: 1)
- [ ] Cursor changes to pointer when hovering over button

## Test 2: Button Click and API Call

### Step 1: Click "Analyze with AI" Button
- [ ] Click the button
- [ ] Button immediately becomes gray
- [ ] Button shows "Analyzing..." with spinner
- [ ] Console shows extensive logs (see below)

### Step 2: Expected Console Logs
```
=== ANALYZE BUTTON CLICKED ===
📷 Selected Image: [filename]
👤 User: [email]
🔄 Processing Step: idle
🔑 API Key exists: true
🔑 API Key source: [environment or user-settings]
✅ API key found, proceeding...
📸 Converting image to base64...
✅ Image converted to base64
📊 Base64 length: [number]
📡 Calling Gemini API...
🌐 URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=API_KEY_HIDDEN
=== PROCESSING STATE CHANGED ===
🔄 Processing state: analyzing
📡 Response status: 200
📡 Response OK: true
✅ Got response from Gemini
📦 Response data: [object]
📝 Solution text length: [number]
📝 Solution preview: [text...]
💾 Saving to database...
=== PROCESSING STATE CHANGED ===
🔄 Processing state: uploading
✅ Saved to database
=== PROCESSING STATE CHANGED ===
🔄 Processing state: generating
=== PROCESSING STATE CHANGED ===
🔄 Processing state: completed
✅✅✅ ANALYSIS COMPLETE! ✅✅✅
```

### Step 3: Network Tab Verification
- [ ] Open Network tab in Developer Tools
- [ ] Find request to `generativelanguage.googleapis.com`
- [ ] Request method is POST
- [ ] Response status is 200 OK
- [ ] Response body contains `candidates` array

### Step 4: UI Response
- [ ] Alert appears: "✅ Analysis complete! Scroll down to see the solution."
- [ ] Solution section appears below
- [ ] Solution contains:
  - [ ] Subject & Topic
  - [ ] Problem statement
  - [ ] Step-by-step solution
  - [ ] Final answer
  - [ ] Tips
- [ ] "Copy Solution" button works
- [ ] "Upload Another Problem" button appears

## Test 3: Error Handling

### Test 3.1: Missing API Key
- [ ] Remove/comment out `VITE_GEMINI_API_KEY` from `.env`
- [ ] Restart dev server
- [ ] Upload image
- [ ] Click "Analyze with AI"
- [ ] Console shows: `❌ No VITE_GEMINI_API_KEY found in environment!`
- [ ] Alert shows: "❌ No VITE_GEMINI_API_KEY found in environment!"
- [ ] Button returns to enabled state

### Test 3.2: Invalid API Key
- [ ] Set `VITE_GEMINI_API_KEY=invalid_key_123` in `.env`
- [ ] Restart dev server
- [ ] Upload image
- [ ] Click "Analyze with AI"
- [ ] Console shows API error response
- [ ] Alert shows error message
- [ ] Error state displayed

### Test 3.3: Network Error
- [ ] Turn off internet connection
- [ ] Upload image
- [ ] Click "Analyze with AI"
- [ ] Console shows network error
- [ ] Alert shows error message

## Test 4: Multiple Uploads

### Step 1: Complete First Analysis
- [ ] Upload image
- [ ] Analyze successfully
- [ ] Solution displayed

### Step 2: Upload Another
- [ ] Click "Upload Another Problem"
- [ ] Previous solution cleared
- [ ] Back to upload state
- [ ] Upload new image
- [ ] Button turns blue again
- [ ] Analyze works again

## Test 5: History Feature

### Step 1: View History
- [ ] Click "History" tab
- [ ] Previous homework solutions listed
- [ ] Click on a solution
- [ ] Solution loads and displays

### Step 2: Back to Upload
- [ ] Click "Upload" tab
- [ ] Can upload new image
- [ ] Everything works as expected

## Success Criteria

All checkboxes above should be checked. If any fail, check:

1. **Console Logs**: Look for where the logs stop
2. **Network Tab**: Check if API call was made
3. **Error Messages**: Read any error messages carefully
4. **Environment**: Verify API key is set correctly

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Button stays gray | Check console for image selection logs |
| No console logs when clicking | Button handler not firing - check React DevTools |
| API key error | Verify `.env` file and restart dev server |
| Network error | Check internet connection and API endpoint |
| CORS error | Should not happen (Gemini API allows browser requests) |
| Invalid response | Check API key quota and permissions |

## Clean Test (From Scratch)

1. Clear browser cache and localStorage
2. Restart dev server
3. Open in incognito/private window
4. Sign in fresh
5. Run through all tests above

---

## Test Results

Date: ___________
Tester: ___________

Overall Result: [ ] PASS  [ ] FAIL

Notes:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
