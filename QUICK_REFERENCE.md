# Quick Reference: Debug Button Usage

## 🔍 For Users

### How to Use:
1. Go to: `/homework`
2. Click: "🔍 DEBUG: Show Database Info" (yellow button)
3. Press: `F12` (opens DevTools)
4. Click: `Console` tab
5. Look for: "=== DEBUG: DATABASE INSPECTION ==="
6. Copy: All console output
7. Share: With support team

### What to Look For:

#### ✅ Success (Key Works):
```
6. TESTING GEMINI API:
Gemini API Response Status: 200
✅ API KEY WORKS!
```

#### ❌ No Key Found:
```
5. CHECKING OTHER TABLES:
user_api_keys: Table does not exist or no data
❌ No API key found to test
```
**Solution**: Add API key in Settings (`/api-settings`)

#### ❌ Invalid Key:
```
6. TESTING GEMINI API:
Gemini API Response Status: 400
❌ API KEY INVALID
```
**Solution**: Update API key with valid one

## 🛠 For Developers

### Debug Output Sections:

1. **USER INFO** - Auth status, user ID, email
2. **PROFILES TABLE** - All fields in profiles
3. **ALL FIELDS IN PROFILE** - Detailed field inspection
4. **CHECKING COMMON API KEY FIELDS** - 7 possible field names
5. **CHECKING OTHER TABLES** - user_settings, user_api_keys
6. **TESTING GEMINI API** - Live API test with encryption fallback
7. **CHECKING LOCALSTORAGE** - Cached keys

### Quick Diagnosis:

| Symptom | Section to Check | Likely Cause |
|---------|------------------|--------------|
| "No API key" error | Section 5 | No key in database |
| Analysis fails | Section 6 | Invalid/expired key |
| Key works elsewhere | Section 7 | Cache sync issue |
| Weird behavior | Section 3 | Database field issue |

### Code Locations:

- **Debug Button**: `/src/pages/HomeworkPage.tsx` lines 471-665
- **API Key Service**: `/src/lib/userApiKeys.ts`
- **Settings Page**: `/src/pages/SettingsPage.tsx`
- **Load Function**: `HomeworkPage.loadApiKey()` lines 51-99
- **Use Function**: `HomeworkPage.handleProcess()` lines 136-347

### API Key Storage:

```
Primary: Database
├── Table: user_api_keys
├── Field: api_key_encrypted
└── Service: 'gemini'

Cache: LocalStorage
├── Key: 'user_api_keys'
├── Format: JSON array
└── Contents: UserApiKey[]
```

### Common Fixes:

```typescript
// If user has no key:
// → Direct them to /api-settings

// If key is invalid:
// → Get new key from https://makersuite.google.com/app/apikey

// If cache is stale:
localStorage.removeItem('user_api_keys');
// Then refresh page

// If database has wrong field:
// → Check migration files in /supabase/migrations/
```

## 📞 Support Script

When user reports API key issues:

1. "Please go to the Homework page"
2. "Click the yellow DEBUG button"
3. "Press F12 and go to Console tab"
4. "Copy all the output and send it to me"
5. [Review Section 5 and 6 in their output]
6. Provide specific solution based on what you see

## 🎯 Expected Behavior

### Normal Flow:
1. User adds key in Settings → Saved to database
2. Key cached in localStorage → Quick access
3. Homework page loads key → From localStorage or DB
4. Analysis button uses key → Direct Gemini API call
5. Results display → Success!

### Debug Flow:
1. User clicks debug → All checks run
2. Console shows results → Developer reviews
3. Issue identified → Specific solution provided
4. User fixes issue → Try again
5. Debug confirms fix → All checks pass!
