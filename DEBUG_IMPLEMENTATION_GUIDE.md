# DEBUG: Database Fields & API Key Lookup - Implementation Guide

## ✅ What Has Been Implemented

### 1. Debug Button Added to Homework Page

A comprehensive debug button has been added to `/src/pages/HomeworkPage.tsx` that:

- **Location**: Appears above the "Analyze with AI" button on the Homework upload page
- **Visual**: Yellow button with 🔍 icon labeled "DEBUG: Show Database Info"
- **Function**: Thoroughly inspects all database fields and API key locations

### 2. Debug Features

When clicked, the debug button performs these checks:

#### Step 1: User Authentication
- Verifies user is logged in
- Displays user ID and email
- Shows any auth errors

#### Step 2: Profiles Table Inspection
- Fetches ALL fields from the profiles table
- Displays complete profile data
- Lists every field name and its value (truncated if long)

#### Step 3: Common API Key Fields Check
Checks these possible field names:
- `gemini_api_key`
- `api_key_encrypted`
- `encrypted_api_key`
- `api_keys`
- `google_api_key`
- `encrypted_gemini_key`
- `gemini_key`

Shows ✅ FOUND or ❌ EMPTY for each field.

#### Step 4: Other Tables Check
- Checks `user_settings` table
- Checks `user_api_keys` table (the correct table!)
- Shows all data or reports if tables don't exist

#### Step 5: Gemini API Test
- Locates API key from any source (profiles, user_api_keys, localStorage)
- Tests the key directly with Gemini API
- If key fails, attempts to decrypt it (base64 decode)
- Tests decrypted key with Gemini API
- Reports success (✅ API KEY WORKS!) or failure

#### Step 6: LocalStorage Check
- Inspects `user_api_keys` in localStorage
- Shows count and preview of all stored keys
- Displays service names and key previews

### 3. Current API Key Implementation Analysis

The homework page ALREADY correctly implements API key loading:

```typescript
// Lines 51-99 in HomeworkPage.tsx
const loadApiKey = async () => {
  // 1. First load from localStorage (immediate)
  const savedKeys = localStorage.getItem('user_api_keys');
  // Parse and find Gemini key
  
  // 2. Then sync from database (background)
  const key = await getUserApiKey(user.id, 'gemini');
  // Updates state with database key
}
```

### 4. How API Keys Are Stored

#### Database Storage (Primary)
- **Table**: `user_api_keys`
- **Field**: `api_key_encrypted` (base64 encoded)
- **Service**: Identified by `service_name = 'gemini'`
- **Function**: `getUserApiKey()` handles decryption automatically

#### LocalStorage (Cache)
- **Key**: `user_api_keys`
- **Format**: JSON array of objects
- **Fields**: `{ service_name, api_key, key_name, is_active, ... }`
- **Note**: Stores DECRYPTED keys for quick access

### 5. Settings Page Pattern

The Settings page (`/src/pages/SettingsPage.tsx`) follows the same pattern:

```typescript
// Load from localStorage first (lines 79-93)
const savedKeys = localStorage.getItem('user_api_keys');

// Then sync from database (lines 99-114)
const dbKeys = await userApiKeysService.getAllApiKeys();
```

## 🎯 How to Use the Debug Button

### For Users:
1. Navigate to the Homework page (`/homework`)
2. Look for the yellow "🔍 DEBUG: Show Database Info" button
3. Click the button
4. Open browser DevTools (press F12)
5. Switch to the "Console" tab
6. Copy ALL the console output
7. Share the output to diagnose API key issues

### What to Look For in Debug Output:

#### ✅ Success Scenario:
```
=== DEBUG: DATABASE INSPECTION ===

1. USER INFO:
User ID: abc123...
User Email: user@example.com

2. PROFILES TABLE:
Profile Data: { id: '...', email: '...', ... }

5. CHECKING OTHER TABLES:
user_api_keys: [{ service_name: 'gemini', api_key_encrypted: 'QUl...' }]

6. TESTING GEMINI API:
Found key in: user_api_keys.api_key_encrypted
Gemini API Response Status: 200
✅ API KEY WORKS!
```

#### ❌ Problem Scenarios:

**No API Key Found:**
```
5. CHECKING OTHER TABLES:
user_api_keys: Table does not exist or no data
❌ No API key found to test
```
**Solution**: User needs to add API key in Settings (`/api-settings`)

**Invalid API Key:**
```
6. TESTING GEMINI API:
Gemini API Response Status: 400
❌ API KEY INVALID
```
**Solution**: User needs to update their API key with a valid one

**Encrypted Key Issue:**
```
Gemini API Response Status: 400
Attempting decryption...
Decrypted API Response Status: 200
✅ DECRYPTED API KEY WORKS!
```
**Solution**: Code should use the decrypted key (already handled by `getUserApiKey()`)

## 🔧 Current Implementation Status

### What's Working:
- ✅ Debug button displays all database fields
- ✅ Console output clearly shows API key location
- ✅ Direct Gemini API testing
- ✅ Encryption/decryption testing
- ✅ LocalStorage inspection
- ✅ Homework page already uses correct API key pattern
- ✅ Settings page saves keys correctly

### Known Architecture:
The app uses a **dual-storage** approach:
1. **Database** (`user_api_keys` table) - Primary source of truth
2. **LocalStorage** - Performance cache for immediate access

The `getUserApiKey()` function in `/src/lib/userApiKeys.ts`:
- Checks database FIRST (lines 232-244)
- Falls back to localStorage if database fails (lines 246-285)
- Automatically handles decryption (base64 decode)
- Returns plain text API key ready to use

## 🐛 Troubleshooting Guide

### If Analysis Still Fails After Debug:

1. **Check Debug Output Section 6** - Does it say "✅ API KEY WORKS!"?
   - If YES → Problem is elsewhere in the code
   - If NO → API key issue

2. **Check Debug Output Section 5** - Is there data in `user_api_keys` table?
   - If NO → User hasn't saved API key yet
   - If YES → Check if `service_name = 'gemini'`

3. **Check Debug Output Section 7** - Is there a Gemini key in localStorage?
   - Can help identify cache vs database issues

4. **Compare Settings Page** - Does the key show up in Settings (`/api-settings`)?
   - If YES there but NO in Homework → Loading issue
   - If NO there → User needs to add key

### Common Issues:

#### Issue: "No API key found in your account"
- **Cause**: `apiKey` state is null
- **Check**: Debug output Section 6 (what key was found?)
- **Fix**: Usually means database has no key or localStorage is empty

#### Issue: "Invalid API key"
- **Cause**: API key is wrong or malformed
- **Check**: Debug output Section 6 (API test result)
- **Fix**: User needs to get new key from Google AI Studio

#### Issue: Key works in Settings but not in Homework
- **Cause**: State/cache synchronization issue
- **Check**: Compare localStorage in both pages
- **Fix**: Clear localStorage and re-save key

## 📝 Next Steps for Further Debugging

If the debug button reveals issues:

### Scenario A: Key Found in Database, Test Succeeds
→ Problem is in the `handleProcess()` function (lines 136-347)
→ Check if `apiKey` state is being set correctly in `loadApiKey()`

### Scenario B: Key Found in Database, Test Fails
→ User has invalid API key
→ Direct them to get new key from: https://makersuite.google.com/app/apikey

### Scenario C: No Key Found Anywhere
→ User needs to add API key in Settings
→ Verify Settings page `saveApiKey()` function is working

### Scenario D: Key Works When Decrypted
→ Verify `getUserApiKey()` is calling `decrypt()` properly
→ Check lines 232-244 in `/src/lib/userApiKeys.ts`

## 🎓 Code References

### Files Modified:
- `/src/pages/HomeworkPage.tsx` - Added debug button (lines 471-665)

### Key Files for API Key Flow:
- `/src/lib/userApiKeys.ts` - API key service with encryption
- `/src/pages/SettingsPage.tsx` - Where users add/manage keys
- `/src/pages/HomeworkPage.tsx` - Where keys are used

### Important Functions:
- `getUserApiKey(userId, serviceName)` - Retrieves and decrypts API key
- `loadApiKey()` - Loads key into Homework page state
- `handleProcess()` - Uses API key to call Gemini

## ✨ Benefits of This Implementation

1. **No More Guessing** - See exactly what's in the database
2. **Real Testing** - Actually call Gemini API to verify keys work
3. **Complete Visibility** - Check all tables, fields, and storage locations
4. **User-Friendly** - Simple button click, clear console output
5. **Developer-Friendly** - Easy to diagnose issues from console logs

## 🚀 Expected Outcome

After this implementation:
- Users can click debug button to see their API key status
- Developers can quickly identify if key exists, where it is, and if it works
- No more "try this field, try that table" - all info in one place
- Clear path to resolution based on debug output
