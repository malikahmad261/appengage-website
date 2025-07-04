# AppEngage Website

AI-powered app review analytics platform that transforms user feedback into actionable insights.

## Features

- 🔍 **Real-time App Search** - Search Google Play Store apps using SerpApi integration
- 📊 **Sample Reports** - View interactive sample analysis reports
- 📱 **Responsive Design** - Optimized for all device sizes
- ⚡ **Fast Performance** - Static site with serverless API functions

## Setup

### Environment Variables

The app search functionality requires a SerpApi key. Add the following environment variable:

```
SERP_API_KEY=your_serpapi_key_here
```

### For Vercel Deployment

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Add the environment variable:
   - **Name**: `SERP_API_KEY`
   - **Value**: Your SerpApi key from [serpapi.com](https://serpapi.com/google-play-api)

### Local Development

1. Clone the repository
2. Create a `.env.local` file in the root directory
3. Add your SerpApi key:
   ```
   SERP_API_KEY=your_serpapi_key_here
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### `/api/search-apps`

Searches Google Play Store for apps using SerpApi.

**Parameters:**
- `query` (required): Search term for apps

**Response:**
```json
{
  "success": true,
  "apps": [
    {
      "title": "App Name",
      "developer": "Developer Name",
      "url": "https://play.google.com/store/apps/details?id=...",
      "icon": "https://...",
      "rating": 4.2,
      "reviews": "10K+",
      "downloads": "1M+"
    }
  ],
  "total": 5,
  "query": "search term"
}
```

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **APIs**: SerpApi Google Play Store API
- **Hosting**: Vercel

## File Structure

```
├── api/
│   ├── search-apps.js     # App search API endpoint
│   └── submit-form.js     # Form submission endpoint
├── images/                # Static assets
├── sample-reports/        # Sample report pages
├── index.html            # Main landing page
├── styles.css            # Global styles
└── package.json          # Project dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details. Updated: Fri Jul  4 15:18:46 PKT 2025
