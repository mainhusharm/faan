# Homework Feature - Testing Guide

## Prerequisites
1. Create a Gemini API key at https://makersuite.google.com/app/apikey
2. Configure the API key in one of two ways:
   - Add to `.env` file: `VITE_GEMINI_API_KEY=your_key`
   - Or configure in app Settings after signing in

## Test Scenarios

### 1. Basic Image Upload and Analysis

**Steps:**
1. Sign in to the application
2. Navigate to the Homework page
3. Click "Choose File" or "Take Photo"
4. Select a homework image (math problem, science question, etc.)
5. Click "Get AI Solution"
6. Wait for processing (10-30 seconds)
7. Review the solution

**Expected Results:**
- Image preview appears after upload
- "Get AI Solution" button is enabled (if API key configured)
- Processing status shows progress
- Solution displays with all sections:
  - Problem statement
  - Explanation
  - Step-by-step solution
  - Common mistakes (if applicable)
  - Related concepts
  - Practice problems

### 2. Image Editing

**Steps:**
1. Upload an image
2. Click "Edit Image"
3. Crop the image to focus on the problem
4. Rotate if needed
5. Adjust brightness/contrast
6. Click "Save"
7. Click "Get AI Solution"

**Expected Results:**
- Image editor opens in modal
- All editing tools work correctly
- Edited image is saved
- Analysis uses edited image

### 3. Homework History

**Steps:**
1. Complete several homework analyses
2. Switch to "History" tab
3. View list of past submissions
4. Click "View Solution" on a past submission
5. Review the saved solution

**Expected Results:**
- All past submissions listed
- Status badges show correctly
- Can view past solutions
- Solutions load quickly

### 4. Error Handling - No API Key

**Steps:**
1. Remove API key from settings and `.env`
2. Upload an image
3. Try to click "Get AI Solution"

**Expected Results:**
- Button is disabled (grayed out)
- Warning message appears: "Please configure your Gemini API key in Settings first"
- Cannot proceed without API key

### 5. Error Handling - Invalid API Key

**Steps:**
1. Configure an invalid API key
2. Upload an image
3. Click "Get AI Solution"

**Expected Results:**
- Processing starts
- Error message appears: "Invalid Gemini API key"
- Can retry with correct key

### 6. Multiple Images

**Steps:**
1. Upload and analyze first homework problem
2. Click "Upload Another Problem"
3. Upload and analyze second problem
4. Check history

**Expected Results:**
- Can upload multiple problems
- Each analyzed separately
- All saved to history
- No conflicts between analyses

### 7. Delete from History

**Steps:**
1. Go to History tab
2. Click delete icon on a submission
3. Confirm deletion
4. Verify removed from list

**Expected Results:**
- Confirmation dialog appears
- Submission deleted from database
- Image removed from storage
- List updates immediately

### 8. Mobile Responsiveness

**Steps:**
1. Open app on mobile device or resize browser
2. Navigate through homework workflow
3. Test all features

**Expected Results:**
- Layout adapts to screen size
- All buttons accessible
- Images display correctly
- Solution readable on small screens

### 9. Dark Mode

**Steps:**
1. Toggle dark mode
2. Navigate through homework feature
3. Check all components

**Expected Results:**
- All components support dark mode
- Text remains readable
- Contrast is appropriate
- No color conflicts

### 10. Math Rendering

**Steps:**
1. Upload an image with mathematical equations
2. Analyze and view solution
3. Check math rendering

**Expected Results:**
- LaTeX equations render correctly
- Both inline ($...$) and block ($$...$$) math work
- Math is readable and properly formatted
- No rendering errors

## Performance Tests

### Load Time
- Initial page load: < 2 seconds
- Image upload: 1-3 seconds
- AI analysis: 10-30 seconds
- History load: < 1 second

### API Quota
- Monitor API usage at Google AI Studio
- Test behavior when quota exceeded
- Verify error message is clear

## Edge Cases

### Large Images
- Test with 10MB images
- Verify size validation
- Check processing time

### Different Image Formats
- JPEG
- PNG
- HEIC
- PDF (if supported)

### Problem Types
- Math (algebra, calculus, geometry)
- Science (physics, chemistry, biology)
- English (grammar, essays)
- History questions
- Multiple choice problems

### Poor Quality Images
- Blurry images
- Low contrast
- Bad lighting
- Handwritten (messy)
- Tilted/rotated

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Regression Tests

After any code changes, verify:
- [ ] Image upload still works
- [ ] Analysis completes successfully
- [ ] Solution displays correctly
- [ ] History loads and displays
- [ ] Edit functionality works
- [ ] Delete functionality works
- [ ] Error handling works
- [ ] API key management works

## Known Issues & Limitations

1. **AI Accuracy:** Depends on image quality and problem clarity
2. **Processing Time:** Can vary based on API load (10-30 seconds)
3. **API Limits:** Subject to Gemini API rate limits
4. **Handwriting:** May struggle with very messy handwriting
5. **Complex Diagrams:** May not fully understand intricate diagrams
6. **Language:** Optimized for English

## Reporting Issues

When reporting bugs, include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/console errors
- Image used (if applicable)
- API key configuration method

## Success Criteria

Feature is working correctly when:
✅ Can upload images via all methods
✅ Image editing works smoothly
✅ Analysis completes with valid results
✅ Solutions display with all sections
✅ Math renders correctly
✅ History saves and retrieves correctly
✅ Errors are handled gracefully
✅ Works on mobile and desktop
✅ Supports light and dark modes
✅ No console errors during normal operation
