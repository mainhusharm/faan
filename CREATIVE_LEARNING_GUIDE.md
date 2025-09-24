# Creative Learning Hub - Google Imagen 3 Integration

## Overview

The Creative Learning Hub is a new feature that allows users to generate and share creative educational designs using Google's Imagen 3 AI technology. This feature is completely free and encourages community-driven learning through visual content creation.

## Features

### 🎨 AI-Powered Image Generation
- Generate educational diagrams, infographics, and visual aids using Google Imagen 3
- Support for various educational subjects (biology, chemistry, mathematics, history, etc.)
- Customizable prompts for specific learning needs

### 👥 Community Sharing
- Share your creative designs with the community
- Discover innovative learning approaches from other students
- Like and engage with community designs
- Public gallery of creative learning materials

### 🔑 API Key Management
- Secure storage of Google API keys in user settings
- Easy setup and management through the settings page
- Support for multiple API keys per user

## Getting Started

### 1. Set Up Your Google API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Vertex AI API
4. Create credentials (API key) for your project
5. Copy the API key and add it in your account settings

### 2. Access the Creative Learning Hub

1. Navigate to the "Creative Learning" page from the main navigation
2. If you haven't set up your API key, you'll be prompted to do so
3. Start creating your first design!

### 3. Create Your First Design

1. Click the "Create Design" button
2. Fill in the design details:
   - **Title**: A descriptive name for your design
   - **Description**: Explain how this design helps with learning
   - **AI Prompt**: Describe what you want the AI to generate
   - **Tags**: Add relevant tags for categorization
   - **Visibility**: Choose whether to make it public or private

3. Click "Create Design" and wait for the AI to generate your image
4. Your design will be added to the community gallery (if public)

## Database Schema

### New Tables Added

#### `user_api_keys`
Stores user API keys for third-party services:
- `id`: UUID primary key
- `user_id`: References auth.users
- `service`: Service name (e.g., 'google_imagen')
- `api_key`: Encrypted API key
- `created_at`, `updated_at`: Timestamps

#### `creative_designs`
Stores user-generated creative designs:
- `id`: UUID primary key
- `user_id`: References auth.users
- `title`: Design title
- `description`: Design description
- `prompt`: AI prompt used for generation
- `image_url`: URL of the generated image
- `tags`: Array of tags for categorization
- `is_public`: Whether design is visible to community
- `likes_count`: Number of likes received
- `created_at`, `updated_at`: Timestamps

#### `design_likes`
Tracks user likes on designs:
- `id`: UUID primary key
- `user_id`: References auth.users
- `design_id`: References creative_designs
- `created_at`: Timestamp

## API Integration

### Google Imagen 3 Integration

The system integrates with Google's Imagen 3 API for image generation. The integration includes:

- **Client-side service**: `src/lib/imageGeneration.ts`
- **API key management**: Secure storage and retrieval
- **Error handling**: Graceful fallbacks for API failures
- **Demo mode**: Placeholder images for testing without API keys

### Image Generation Service

```typescript
interface ImageGenerationRequest {
  prompt: string;
  apiKey: string;
  style?: 'photographic' | 'digital_art' | 'sketch' | 'watercolor' | 'oil_painting';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

interface ImageGenerationResponse {
  imageUrl: string;
  prompt: string;
  style: string;
  aspectRatio: string;
}
```

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own API keys
- Public designs are visible to all authenticated users
- Private designs are only visible to the creator

### API Key Protection
- API keys are stored securely in the database
- Keys are masked in the UI for security
- Users can show/hide their API keys as needed

## Usage Examples

### Creating a Biology Diagram
```
Title: Photosynthesis Process
Description: A visual representation of how plants convert sunlight into energy
Prompt: "Create a detailed scientific diagram showing the photosynthesis process in plants, including chloroplasts, sunlight, water, carbon dioxide, glucose, and oxygen. Use clear labels and arrows to show the flow of materials and energy."
Tags: ["biology", "photosynthesis", "plants", "science"]
```

### Creating a Math Visualization
```
Title: Quadratic Formula Visual
Description: A visual explanation of the quadratic formula with examples
Prompt: "Design an educational infographic explaining the quadratic formula x = (-b ± √(b²-4ac)) / 2a. Include a graph showing a parabola, the discriminant, and examples of different types of solutions."
Tags: ["mathematics", "algebra", "quadratic", "formula"]
```

## Future Enhancements

### Planned Features
- **Comments System**: Allow users to comment on designs
- **Collections**: Organize designs into themed collections
- **Templates**: Pre-made prompt templates for common subjects
- **Collaboration**: Allow multiple users to work on designs together
- **Export Options**: Download designs in various formats
- **Advanced AI Features**: Style transfer, image editing, etc.

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live updates
- **Image Optimization**: Automatic image compression and optimization
- **Caching**: Redis caching for improved performance
- **Analytics**: Track design popularity and usage patterns

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correct
   - Check if the Vertex AI API is enabled
   - Ensure the API key has proper permissions

2. **Image Generation Fails**
   - Check your internet connection
   - Verify the API key is valid
   - Try a simpler prompt

3. **Designs Not Appearing**
   - Check if the design is set to public
   - Verify you're logged in
   - Check the search filters

### Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

## Contributing

We welcome contributions to improve the Creative Learning Hub! Areas where help is needed:

- UI/UX improvements
- Additional AI model integrations
- Performance optimizations
- New features and functionality
- Documentation improvements

## License

This feature is part of the Fusioned EdTech Platform and follows the same licensing terms as the main project.
