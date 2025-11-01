# Test Plan: Gemini API Key from User Settings

## Summary
This test plan validates that the homework analyze feature now uses the Gemini API key stored in user settings (`/api-settings`) instead of environment variables.

## Pre-requisites
- User must have a Netlify/deployed instance of the application OR run locally
- User must be able to create an account and sign in
- User should have a valid Gemini API key to test with

## Test Scenarios

### Scenario 1: User WITHOUT API Key (First-time User)

**Steps:**
1. Sign in to the application
2. Navigate to `/homework` page
3. Observe the page state

**Expected Results:**
- ✅ Yellow warning banner appears with text: "API Key Required"
- ✅ Warning banner contains link to "Settings" (`/api-settings`)
- ✅ Console log shows: `⚠️ No Gemini API key found in user settings`

**Steps (continued):**
4. Upload a homework image
5. Click "Analyze with AI" button

**Expected Results:**
- ✅ Alert/confirmation dialog appears with message: "❌ No Gemini API key found!"
- ✅ Dialog prompts: "Please add your Gemini API key in Settings to use the AI Homework Helper."
- ✅ Dialog asks: "Click OK to go to API Settings now, or Cancel to stay here."
- ✅ Console log shows: `❌ No Gemini API key found in user settings!`

**Steps (continued):**
6. Click "OK" in the dialog

**Expected Results:**
- ✅ User is redirected to `/api-settings` page

---

### Scenario 2: User Configures API Key

**Steps:**
1. Navigate to `/api-settings` page
2. Click "Add Key" button
3. Fill in the form:
   - Key Name: "My Gemini Key"
   - Service: "Google Gemini"
   - API Key: [Valid Gemini API Key]
4. Click "Save" button

**Expected Results:**
- ✅ Success message appears: "API key saved successfully!"
- ✅ API key appears in the list
- ✅ API key is masked: `AIza****...****1234`
- ✅ Can toggle visibility with eye icon
- ✅ Key is saved to localStorage
- ✅ Console log shows: `✅ API key added to local state and localStorage`

---

### Scenario 3: User WITH Valid API Key

**Steps:**
1. Navigate to `/homework` page after adding API key
2. Observe the page state

**Expected Results:**
- ✅ No warning banner appears
- ✅ Console log shows: `🔑 Gemini API Key loaded from user settings: true`
- ✅ Console log shows: `🔑 API Key source: user-settings`

**Steps (continued):**
3. Upload a homework image (e.g., a math problem)
4. Click "Analyze with AI" button

**Expected Results:**
- ✅ Button shows "Analyzing..." with spinner
- ✅ Console logs show:
  - `🔑 Checking for Gemini API Key...`
  - `🔑 API Key from user settings: true`
  - `✅ Gemini API key found from user settings, proceeding...`
  - `📸 Converting image to base64...`
  - `✅ Image converted to base64`
  - `📡 Calling Gemini API with user API key...`
  - `📡 Response status: 200`
  - `✅ Got response from Gemini`
  - `✅✅✅ ANALYSIS COMPLETE! ✅✅✅`
- ✅ Success alert appears: "✅ Analysis complete! Scroll down to see the solution."
- ✅ Solution is displayed with formatted sections:
  - Subject & Topic
  - Problem
  - Step-by-step Solution
  - Final Answer
  - Key Tips

---

### Scenario 4: User WITH Invalid API Key

**Steps:**
1. Navigate to `/api-settings`
2. Add an invalid/fake Gemini API key (e.g., "invalid-key-12345")
3. Navigate to `/homework`
4. Upload an image
5. Click "Analyze with AI"

**Expected Results:**
- ✅ API call returns 400 status
- ✅ Console log shows: `❌ API Error Response: [error details]`
- ✅ Alert/confirmation dialog appears: "❌ Invalid API key!"
- ✅ Dialog message: "Your Gemini API key appears to be invalid or incorrectly configured."
- ✅ Dialog asks: "Click OK to go to API Settings and update your key, or Cancel to stay here."
- ✅ Clicking OK redirects to `/api-settings`

---

### Scenario 5: User WITH Quota Exceeded

**Steps:**
1. Use an API key that has exceeded its quota
2. Navigate to `/homework`
3. Upload an image
4. Click "Analyze with AI"

**Expected Results:**
- ✅ API call returns 429 status
- ✅ Alert appears: "❌ API Quota Exceeded!"
- ✅ Alert message includes: "Your Gemini API key has exceeded its quota."
- ✅ Alert includes link: "Please check your usage at https://makersuite.google.com/app/apikey"
- ✅ Processing state returns to 'idle'

---

### Scenario 6: User WITH Permission/Access Denied

**Steps:**
1. Use an API key without proper permissions
2. Navigate to `/homework`
3. Upload an image
4. Click "Analyze with AI"

**Expected Results:**
- ✅ API call returns 403 status
- ✅ Alert appears: "❌ API Access Denied!"
- ✅ Alert message: "Your Gemini API key does not have permission to access this API."
- ✅ Processing state returns to 'idle'

---

### Scenario 7: Edit Existing API Key

**Steps:**
1. Navigate to `/api-settings`
2. Find existing Gemini API key
3. Click "Edit" button (pencil icon)
4. Update the API key value
5. Click "Save Changes"

**Expected Results:**
- ✅ Key is updated in localStorage
- ✅ Success message appears
- ✅ Updated key is displayed (masked)

---

### Scenario 8: Delete API Key

**Steps:**
1. Navigate to `/api-settings`
2. Find Gemini API key
3. Click "Delete" button (trash icon)
4. Confirm deletion

**Expected Results:**
- ✅ Confirmation prompt appears
- ✅ Key is removed from list
- ✅ Key is removed from localStorage
- ✅ Success message appears
- ✅ Console log shows: `✅ API key deleted from database`

**Steps (continued):**
5. Navigate to `/homework`

**Expected Results:**
- ✅ Warning banner appears again
- ✅ Analyzing fails with "No API key" error

---

## Browser Console Logs Verification

### When API Key is Loaded
```
🏠 Homework component mounted
👤 User: user@example.com
🔑 Gemini API Key loaded from user settings: true
🔑 API Key source: user-settings
```

### When API Key is Missing
```
🏠 Homework component mounted
👤 User: user@example.com
🔑 Gemini API Key loaded from user settings: false
⚠️ No Gemini API key found in user settings
```

### During Analysis with Valid Key
```
=== ANALYZE BUTTON CLICKED ===
📷 Selected Image: homework.jpg
👤 User: user@example.com
🔄 Processing Step: idle
🔑 Checking for Gemini API Key...
🔑 API Key from user settings: true
✅ Gemini API key found from user settings, proceeding...
📸 Converting image to base64...
✅ Image converted to base64
📊 Base64 length: 123456
📡 Calling Gemini API with user API key...
🌐 URL: https://generativelanguage.googleapis.com/...?key=API_KEY_HIDDEN
📡 Response status: 200
📡 Response OK: true
✅ Got response from Gemini
📦 Response data: [object Object]
📝 Solution text length: 567
📝 Solution preview: ## SUBJECT & TOPIC...
💾 Saving to database...
✅ Saved to database
✅✅✅ ANALYSIS COMPLETE! ✅✅✅
```

### During Analysis without Key
```
=== ANALYZE BUTTON CLICKED ===
📷 Selected Image: homework.jpg
👤 User: user@example.com
🔄 Processing Step: idle
🔑 Checking for Gemini API Key...
🔑 API Key from user settings: false
❌ No Gemini API key found in user settings!
```

---

## Regression Testing

### Verify Other Features Still Work
- ✅ User can still sign in/sign out
- ✅ User can navigate to other pages
- ✅ Other AI features (if any) still work
- ✅ Settings page functionality remains intact
- ✅ Homework history still loads
- ✅ Image upload/editor still works

---

## Edge Cases

### Multiple API Keys
**Steps:**
1. Add multiple Gemini API keys
2. System should use the most recent active one

### Browser Refresh
**Steps:**
1. Add API key
2. Refresh browser
3. API key should still be available (from localStorage)

### Different Browsers
**Steps:**
1. Add API key in Chrome
2. Open same account in Firefox
3. Key should load from database (if available) or localStorage

### Network Failures
**Steps:**
1. Disconnect network during analysis
2. Should show appropriate error message
3. Should not lose the uploaded image

---

## Acceptance Criteria Summary

✅ Code fetches Gemini API key from user's settings (localStorage + Supabase)  
✅ No longer checks environment variables  
✅ Clear error message if user has no API key configured  
✅ Link to `/api-settings` page to add key  
✅ Button works when user has valid API key  
✅ Gemini API call succeeds with user's key  
✅ Solution displays after analysis  
✅ Works for all logged-in users with configured API keys  
✅ Console logs show which key source is being used  
✅ Better error handling for invalid keys, quota exceeded, etc.
