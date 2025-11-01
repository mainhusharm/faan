# Fusioned EdTech Platform

A comprehensive educational technology platform built with React 18, TypeScript, and Vite, featuring AI-powered homework assistance, course management, and interactive learning tools.

## Features

### 🎯 AI Homework Helper
Upload photos of homework problems and get instant step-by-step solutions powered by Google Gemini Vision AI.

**Features:**
- 📸 Camera capture or file upload support
- 🖼️ Image editing (crop, rotate, adjust brightness/contrast)
- 🤖 AI-powered problem analysis using Gemini Vision
- 📚 Detailed step-by-step solutions with explanations
- 💡 Common mistakes identification
- 🎓 Related concepts and practice problems
- 📁 Homework history tracking
- 📄 Export solutions to PDF
- 📝 Save solutions to notes

### 📚 Course Management
- Browse and discover courses
- Video lessons with interactive quizzes
- Track progress and achievements
- Gamified learning with points and leaderboards

### 🎨 Creative Learning
- AI-powered media generation
- Video creation and editing
- Social sharing features

### ⚙️ Settings & API Key Management
- Configure personal API keys for AI services
- Secure encrypted storage of API keys
- Support for multiple AI services (Gemini, OpenAI, Stability AI)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend)
- Google Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fusioned-edtech-platform
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key (optional)
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Configuring Gemini API Key

You can configure your Gemini API key in two ways:

**Option 1: Environment Variable (Global)**
Add to `.env` file:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Option 2: User Settings (Per-User)**
1. Sign in to your account
2. Navigate to Settings → API Keys
3. Add your Gemini API key
4. The key is encrypted and stored securely in your profile

User-configured keys take precedence over environment variables.

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key or use an existing one
5. Copy the key and paste it in Settings or `.env`

## Homework Helper Usage

### Uploading an Image

1. Navigate to the Homework page from the main menu
2. Click "Take Photo" to use your camera, or "Choose File" to upload an image
3. You can also drag and drop an image file

### Editing the Image

1. After uploading, click "Edit Image"
2. Available editing tools:
   - Crop: Select the area containing the problem
   - Rotate: Rotate the image 90 degrees
   - Brightness: Adjust image brightness
   - Contrast: Adjust image contrast
3. Click "Save" when done

### Getting AI Solution

1. Click "Get AI Solution" button
2. Wait 10-30 seconds while the AI analyzes your problem
3. View the comprehensive solution with:
   - Problem restatement
   - Subject and topic identification
   - Concept overview
   - Step-by-step solution
   - Final answer
   - Common mistakes to avoid
   - Related concepts
   - Practice problems

### Managing History

1. Switch to the "History" tab
2. View all your previous homework submissions
3. Click "View Solution" to see past solutions
4. Delete old submissions if needed

## Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Backend:** Supabase (Auth, Database, Storage)
- **AI:** Google Generative AI (Gemini)
- **Image Processing:** react-image-crop
- **Math Rendering:** KaTeX

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Homework/       # Homework-specific components
│   │   ├── ImageUploader.tsx
│   │   ├── ImageEditor.tsx
│   │   ├── ProcessingStatus.tsx
│   │   ├── SolutionDisplay.tsx
│   │   └── HomeworkHistory.tsx
│   └── Layout/         # Layout components
├── pages/              # Page components
│   ├── HomeworkPage.tsx
│   └── ...
├── lib/                # Service layer
│   ├── homeworkService.ts    # Homework AI & storage
│   ├── userApiKeys.ts        # API key management
│   └── supabase.ts           # Supabase client
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
└── App.tsx             # Main app component
```

## Database Schema

### Tables
- `homework_uploads` - Stores uploaded homework images
- `homework_analysis` - Stores AI analysis results
- `homework_solutions` - Stores step-by-step solutions
- `user_api_keys` - Stores encrypted user API keys
- `profiles` - User profiles and settings

### Storage Buckets
- `homework-images` - Stores uploaded homework images

## API Services

### Gemini Vision API
Used for analyzing homework images and generating solutions.

**Model:** gemini-1.5-flash
**Features:**
- Image understanding and OCR
- Mathematical equation recognition
- Handwriting recognition
- Step-by-step problem solving
- Educational explanations

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style
- TypeScript strict mode enabled
- ESLint with React and TypeScript rules
- Functional components with hooks
- Tailwind CSS for styling

## Troubleshooting

### Homework Analysis Not Working
1. Check that you have configured a Gemini API key
2. Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/)
3. Check browser console for error messages
4. Ensure image is clear and readable

### Image Upload Failed
1. Check file size (max 10MB)
2. Verify file format (JPEG, PNG, HEIC, PDF)
3. Check Supabase storage bucket permissions

### API Quota Exceeded
1. Check your Gemini API usage at Google AI Studio
2. Wait for quota to reset (usually daily)
3. Upgrade your API plan if needed

## Security

- API keys are encrypted before storage
- User authentication required for all homework features
- Row-level security enabled on all database tables
- Secure file upload with size and type validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

[Your License Here]

## Support

For issues and questions:
- Create an issue on GitHub
- Contact support team
- Check documentation

## Acknowledgments

- Google Gemini AI for vision and language capabilities
- Supabase for backend infrastructure
- React and Vite communities
