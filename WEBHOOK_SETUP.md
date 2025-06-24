# Webhook Setup Guide

## Setting up the n8n Webhook Integration

### 1. Environment Variables Required

Add the following environment variable to your Vercel project:

- `N8N_WEBHOOK_URL` - Your n8n webhook endpoint URL

### 2. Vercel Deployment Setup

#### For Production (Vercel Dashboard):
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variable:
   - **Name**: `N8N_WEBHOOK_URL`
   - **Value**: `https://your-n8n-instance.com/webhook/your-webhook-id`
   - **Environment**: Production (and Preview if needed)

#### For Local Development:
1. Create a `.env.local` file in the project root
2. Add: `N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id`

### 3. n8n Webhook Configuration

Your n8n webhook will receive the following data structure:

```json
{
  "email": "user@example.com",
  "googlePlayUrl": "https://play.google.com/store/apps/details?id=com.example.app",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "source": "https://www.appengage.io/"
}
```

### 4. Testing the Integration

1. Deploy the changes to Vercel
2. Set up the environment variable
3. Test form submission on your live site
4. Check n8n webhook logs to confirm data receipt

### 5. Form Fields Captured

The form captures:
- **Email**: User's email address (required)
- **Google Play URL**: Google Play Store URL (required)
- **Timestamp**: When the form was submitted (ISO format)
- **Source**: Always "https://www.appengage.io/"

### 6. Error Handling

The system includes:
- Client-side validation
- Server-side validation
- Webhook failure handling
- User-friendly error messages
- Console logging for debugging

### 7. Security Considerations

- Environment variables keep webhook URLs secure
- Input validation prevents malicious data
- HTTPS-only webhook communication
- IP logging for security monitoring 