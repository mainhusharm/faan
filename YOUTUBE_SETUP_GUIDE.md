# 🎥 YouTube Video Setup Guide for Fusioned

## Quick YouTube Setup (Recommended for Testing)

### Step 1: Upload Videos to YouTube
1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click "Create" → "Upload videos"
3. Upload your course videos
4. Set visibility to **"Unlisted"** (so only people with the link can see them)
5. Copy the video ID from the URL

### Step 2: Get YouTube Embed URLs
For each video, convert the URL:
```
Original: https://www.youtube.com/watch?v=VIDEO_ID
Embed:    https://www.youtube.com/embed/VIDEO_ID
```

### Step 3: Update Your App
Replace the video URLs in `CourseDetailPage.tsx`:

```typescript
// Example: Replace this
video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'

// With your actual video ID
video_url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
```

## 🎯 **Why YouTube is Good for Testing:**

✅ **Free** - No cost for storage or bandwidth
✅ **Fast** - Global CDN for quick loading
✅ **Reliable** - YouTube's infrastructure
✅ **Easy** - Simple to implement
✅ **Mobile-friendly** - Works on all devices

## ⚠️ **Limitations of YouTube:**

❌ **YouTube branding** - Shows YouTube logo and controls
❌ **Limited customization** - Can't fully customize the player
❌ **No progress tracking** - Can't track video completion
❌ **Ads** - May show ads on your videos
❌ **No analytics** - Limited insights into student engagement

## 🚀 **Quick Implementation Steps:**

### 1. Upload Your First Video
- Go to YouTube Studio
- Upload a physics lesson video
- Set to "Unlisted"
- Copy the video ID

### 2. Update the Code
```typescript
// In CourseDetailPage.tsx, replace:
video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'

// With your video:
video_url: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
```

### 3. Test the Player
- Run your app: `npm run dev`
- Go to a course page
- Click on a video lesson
- The YouTube player should load

## 📝 **Example Video URLs:**

```typescript
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Kinematics',
    video_url: 'https://www.youtube.com/embed/ABC123DEF456', // Your video ID
    duration: 15,
    order_index: 0,
    description: 'Learn the basics of motion...',
    isPreview: true
  },
  // ... more videos
];
```

## 🔄 **Migration Path:**

1. **Start with YouTube** (now) - Quick testing
2. **Move to Cloudflare R2** (later) - Professional setup
3. **Add AWS S3** (production) - Full control

## 💡 **Pro Tips:**

- **Use descriptive titles** for your YouTube videos
- **Add timestamps** in video descriptions for easy navigation
- **Create playlists** to organize course content
- **Use thumbnails** that match your brand
- **Keep videos under 15 minutes** for better engagement

## 🆘 **Need Help?**

- **YouTube Studio**: [studio.youtube.com](https://studio.youtube.com)
- **YouTube API**: [developers.google.com/youtube](https://developers.google.com/youtube)
- **Video optimization**: Use tools like HandBrake to compress videos before uploading

## 🎬 **Ready to Upload?**

1. **Prepare your videos** (compress if needed)
2. **Upload to YouTube** (set as unlisted)
3. **Get the video IDs** from the URLs
4. **Update your app** with the new URLs
5. **Test the player** in your browser

Your Fusioned platform will now work with YouTube videos! 🚀
