# 🤖 Google Gemini 2.5 Flash Image API Setup Guide

This guide will help you set up the official Google Gemini 2.5 Flash Image API for your EdTech platform's Creative Learning section.

## 🚀 **Quick Start**

### 1. **Get Your API Key**

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key" 
5. Copy your API key (starts with `AIza...`)

### 2. **Set Up Environment Variables**

Create a `.env` file in your project root:

```bash
# Google Gemini API Configuration
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**⚠️ Important:** Never commit your `.env` file to version control!

### 3. **Test the Integration**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/creative-learning`

3. Click "Generate with AI" and try creating an image

4. Check the browser console for API status messages

## 🔧 **Features Available**

### **Image Generation**
- ✅ High-quality educational image generation
- ✅ Multiple styles (Photographic, Digital Art, Sketch, Watercolor, Oil Painting)
- ✅ Various aspect ratios (16:9, 1:1, 9:16, 4:3, 3:4)
- ✅ Educational prompt enhancement

### **Image Editing**
- ✅ AI-powered image enhancement
- ✅ Educational filter application
- ✅ Style conversion for learning materials
- ✅ Real-time image processing

### **Fallback Services**
- ✅ Pollinations.ai (free alternative)
- ✅ Picsum.photos (demo images)
- ✅ Automatic fallback if API key is missing

## 💰 **Pricing Information**

Google Gemini API pricing (as of 2024):
- **Free Tier**: 15 requests per minute
- **Paid Tier**: $0.0005 per 1K characters for text, $0.02 per image
- **Monthly Free Credits**: $300 for new users

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **"Gemini API not available"**
   - Check if your API key is correctly set in `.env`
   - Verify the API key is valid and active
   - Ensure you have enabled the Gemini API in Google Cloud Console

2. **"Image generation failed"**
   - Check your internet connection
   - Verify API quota hasn't been exceeded
   - Try using fallback services (they work without API key)

3. **"No image generated"**
   - The API might be processing - wait a few seconds
   - Try a different prompt
   - Check browser console for detailed error messages

### **Debug Mode**

Enable debug logging by opening browser console and looking for:
- `🤖 Google Gemini 2.5 Flash Image API initialized successfully!`
- `✅ Gemini 2.5 Flash Image generation successful!`
- `⚠️ Gemini API not available - will use fallback services`

## 🔒 **Security Best Practices**

1. **Never expose API keys in client-side code**
2. **Use environment variables for all sensitive data**
3. **Implement rate limiting for production**
4. **Monitor API usage and costs**
5. **Use HTTPS in production**

## 📈 **Production Deployment**

### **For Netlify:**
1. Add environment variable in Netlify dashboard:
   - Go to Site Settings → Environment Variables
   - Add `VITE_GEMINI_API_KEY` with your API key

### **For VPS:**
1. Set environment variable in your deployment script:
   ```bash
   export VITE_GEMINI_API_KEY=your_api_key_here
   ```

2. Or add to your `.env` file on the server

## 🎯 **Usage Examples**

### **Basic Image Generation**
```javascript
const response = await generateImage({
  prompt: "Create a diagram of the water cycle",
  style: "diagram",
  aspectRatio: "16:9"
});
```

### **Educational Content**
```javascript
const response = await generateImage({
  prompt: "Illustrate the process of photosynthesis with labeled components",
  style: "educational",
  aspectRatio: "4:3"
});
```

## 📞 **Support**

If you encounter any issues:

1. Check the [Google AI Studio Documentation](https://ai.google.dev/docs)
2. Review the browser console for error messages
3. Test with fallback services first
4. Verify your API key permissions

## 🎉 **You're All Set!**

Your EdTech platform now has powerful AI image generation capabilities powered by Google's latest Gemini 2.5 Flash Image model. Students can create amazing educational content with just a few clicks!

---

**Happy Learning! 🎓✨**
