# 🎥 Video Storage Setup Guide for Fusioned

## Quick Start Options

### Option 1: AWS S3 (Recommended)
**Cost**: ~$0.023/GB/month + transfer costs
**Setup Time**: 15-30 minutes

#### Step 1: Create AWS Account
1. Go to [AWS Console](https://aws.amazon.com)
2. Create account and verify email
3. Add payment method (you get free tier for 12 months)

#### Step 2: Create S3 Bucket
```bash
# Install AWS CLI
pip install awscli

# Configure AWS CLI
aws configure
# Enter your Access Key ID and Secret Access Key

# Create bucket
aws s3 mb s3://fusioned-videos --region us-east-1

# Make bucket public (for video streaming)
aws s3api put-bucket-policy --bucket fusioned-videos --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::fusioned-videos/*"
    }
  ]
}'
```

#### Step 3: Upload Videos
```bash
# Upload a video
aws s3 cp your-video.mp4 s3://fusioned-videos/courses/physics/lesson1.mp4

# Upload entire folder
aws s3 sync ./videos/ s3://fusioned-videos/courses/
```

#### Step 4: Get Video URLs
Your videos will be available at:
```
https://fusioned-videos.s3.amazonaws.com/courses/physics/lesson1.mp4
```

### Option 2: Cloudflare R2 (Budget-Friendly)
**Cost**: $0.015/GB/month (no egress fees!)
**Setup Time**: 10-20 minutes

#### Step 1: Create Cloudflare Account
1. Go to [Cloudflare](https://cloudflare.com)
2. Sign up for free account
3. Upgrade to R2 plan ($5/month minimum)

#### Step 2: Create R2 Bucket
1. Go to R2 Object Storage in Cloudflare dashboard
2. Create new bucket: `fusioned-videos`
3. Upload videos through web interface or API

#### Step 3: Get Public URLs
Your videos will be available at:
```
https://pub-xxxxx.r2.dev/courses/physics/lesson1.mp4
```

### Option 3: Vimeo Pro (Professional)
**Cost**: $75/month
**Setup Time**: 5-10 minutes

#### Step 1: Create Vimeo Account
1. Go to [Vimeo](https://vimeo.com)
2. Sign up for Pro plan
3. Upload videos through web interface

#### Step 2: Get Embed URLs
Your videos will be available at:
```
https://player.vimeo.com/video/123456789
```

## 🚀 Implementation in Your App

### Update Video URLs
Replace the sample URLs in `CourseDetailPage.tsx`:

```typescript
// Before (sample URLs)
video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

// After (your storage URLs)
video_url: 'https://fusioned-videos.s3.amazonaws.com/courses/physics/kinematics/introduction.mp4'
```

### Use the Video Storage Helper
```typescript
import { getVideoUrl } from '../lib/videoStorage';

// Get video URL for physics kinematics lesson
const videoUrl = getVideoUrl('physics', 'kinematics', 's3');
```

## 📊 Cost Comparison

| Service | Storage Cost | Transfer Cost | CDN | Setup Difficulty |
|---------|-------------|---------------|-----|------------------|
| AWS S3 | $0.023/GB | $0.09/GB | Extra | Medium |
| Cloudflare R2 | $0.015/GB | Free | Included | Easy |
| Vimeo Pro | $75/month | Included | Included | Very Easy |
| YouTube | Free | Free | Included | Very Easy |

## 🎯 Recommended Setup for Fusioned

### For Development (Free Tier)
- Use **YouTube** for demos and testing
- Upload videos as unlisted/private
- Use embed URLs in your app

### For Production (Professional)
- Use **AWS S3 + CloudFront** for full control
- Set up proper CDN for global delivery
- Implement video analytics and security

### For Budget-Conscious (Cost-Effective)
- Use **Cloudflare R2** for best value
- No egress fees save money on bandwidth
- Built-in CDN for fast delivery

## 🔧 Next Steps

1. **Choose your storage provider** based on budget and needs
2. **Upload your first video** using the provider's interface
3. **Update the video URLs** in your React app
4. **Test video playback** in your browser
5. **Set up CDN** for better performance (if using S3)

## 📝 Video Optimization Tips

### Before Upload
- Compress videos to reduce file size
- Use MP4 format for best compatibility
- Create multiple quality versions (1080p, 720p, 480p)
- Add thumbnails for better UX

### After Upload
- Set up CloudFront CDN for S3

- Enable video analytics
- Implement video security (signed URLs)
- Add video progress tracking

## 🆘 Need Help?

- **AWS S3**: [AWS Documentation](https://docs.aws.amazon.com/s3/)
- **Cloudflare R2**: [R2 Documentation](https://developers.cloudflare.com/r2/)
- **Vimeo**: [Vimeo API Docs](https://developer.vimeo.com/)

## 💡 Pro Tips

1. **Start with YouTube** for quick testing
2. **Move to S3/R2** when ready for production
3. **Use CloudFront** for global CDN
4. **Implement video analytics** to track engagement
5. **Add video security** for premium content
