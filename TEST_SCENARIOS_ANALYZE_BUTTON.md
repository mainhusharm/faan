# Test Scenarios for Analyze AI Button Fix

## Scenario 1: User adds API key and uses immediately (Main Fix)
**Steps:**
1. User logs in
2. Navigate to `/homework` page (no API key set yet)
3. Yellow warning banner should appear: "API Key Required"
4. Navigate to `/api-settings`
5. Add Gemini API key with a name (e.g., "My Gemini Key")
6. Click "Save" - should see success message
7. Navigate back to `/homework` page (without refreshing)
8. Upload an image
9. Click "Analyze with AI" button

**Expected Result:**
✅ Button should detect the API key automatically
✅ No "No Gemini API key found" error should appear
✅ Image should be analyzed successfully
✅ Solution should be displayed

**Previous Behavior:**
❌ Would show "No Gemini API key found in your account!" error
❌ User had to refresh the page manually

---

## Scenario 2: User already has API key in database
**Steps:**
1. User logs in (API key already saved from previous session)
2. Navigate to `/homework` page
3. Upload an image
4. Click "Analyze with AI" button

**Expected Result:**
✅ Button should detect the existing API key from database
✅ Image should be analyzed successfully
✅ No errors should appear

---

## Scenario 3: User has API key in localStorage only
**Steps:**
1. User has API key saved in localStorage but not in database
2. Navigate to `/homework` page
3. Upload an image
4. Click "Analyze with AI" button

**Expected Result:**
✅ Button should detect the API key from localStorage (fallback)
✅ Image should be analyzed successfully
✅ State should be updated with the key

---

## Scenario 4: User has no API key (Error handling)
**Steps:**
1. User logs in with no API key configured
2. Navigate to `/homework` page
3. Upload an image
4. Click "Analyze with AI" button

**Expected Result:**
✅ Should show error dialog: "No Gemini API key found in your account!"
✅ Should offer to redirect to `/api-settings`
✅ Button should remain enabled (not grayed out)
✅ Processing state should reset to 'idle'

---

## Scenario 5: API key becomes invalid (Error handling)
**Steps:**
1. User has an invalid/expired API key saved
2. Navigate to `/homework` page
3. Upload an image
4. Click "Analyze with AI" button

**Expected Result:**
✅ Should detect the key and attempt API call
✅ Should show error dialog: "Invalid API key!"
✅ Should offer to redirect to `/api-settings` to update key
✅ Processing state should reset to 'idle'

---

## Scenario 6: Multiple page visits without refresh
**Steps:**
1. User logs in (no API key)
2. Visit `/homework` - warning banner shown
3. Visit `/api-settings` - add API key
4. Visit `/creative-learning` - browse around
5. Visit `/homework` again (without any refresh)
6. Upload an image
7. Click "Analyze with AI" button

**Expected Result:**
✅ Button should load fresh API key from database
✅ Should work without any errors
✅ No page refresh needed

---

## Scenario 7: State persistence after successful analysis
**Steps:**
1. User successfully analyzes an image (Scenario 1 or 2)
2. Click "Upload Another Problem" button
3. Upload a new image
4. Click "Analyze with AI" button again

**Expected Result:**
✅ Should use the API key stored in state (from previous successful load)
✅ Should still check database if state is empty
✅ Should work immediately without re-loading

---

## Technical Validation

### Console Logs to Verify
When button is clicked, console should show:
```
=== ANALYZE BUTTON CLICKED ===
📷 Selected Image: [filename]
👤 User: [email]
🔄 Processing Step: analyzing
🔑 Checking for Gemini API Key (loading fresh)...
🔄 Loading fresh API key from database/localStorage...
✅ Found fresh Gemini API key
🔑 Key preview: AIzaSyBxxx...
🔑 API Key available: true
✅ Gemini API key found, proceeding with API call...
```

### Error Case Console Logs
When no key is found:
```
🔑 Checking for Gemini API Key (loading fresh)...
🔄 Loading fresh API key from database/localStorage...
⚠️ No fresh key found, trying state...
🔑 API Key available: false
❌ No Gemini API key found!
💡 User needs to add API key at: /api-settings
```

---

## Browser DevTools Checks

### localStorage Inspection
```javascript
// In browser console
JSON.parse(localStorage.getItem('user_api_keys'))
// Should show array with gemini key if saved
```

### Supabase Database Inspection
```sql
-- In Supabase SQL editor
SELECT * FROM user_api_keys 
WHERE service_name = 'gemini' 
AND is_active = true
ORDER BY created_at DESC;
```

---

## Performance Considerations

- Fresh key loading adds minimal delay (~100-500ms depending on database latency)
- Key is loaded asynchronously while user waits for image conversion
- State is updated after successful load for faster subsequent uses
- localStorage provides instant fallback if database is slow

---

## Edge Cases Handled

1. ✅ User adds key in different browser tab
2. ✅ User updates existing key in settings
3. ✅ Database query fails (falls back to localStorage)
4. ✅ localStorage is corrupted (falls back to database)
5. ✅ API key decryption fails (handled by try-catch in decrypt method)
6. ✅ Network timeout during key retrieval
7. ✅ User is not authenticated (checked before key retrieval)
