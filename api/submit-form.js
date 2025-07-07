export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            message: 'Method not allowed' 
        });
    }

    try {
        const { email, playstore_url } = req.body;

        // Validate required fields
        if (!email || !playstore_url) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: email and app URL are required' 
            });
        }

        // n8n webhook URL from environment variables
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
        
        if (!N8N_WEBHOOK_URL) {
            console.error('N8N_WEBHOOK_URL environment variable not set');
            return res.status(500).json({ 
                success: false,
                message: 'Webhook configuration error' 
            });
        }

        // Prepare data for n8n webhook in the EXACT format specified
        const webhookData = JSON.stringify({
            email: email,
            googlePlayUrl: playstore_url,
            timestamp: new Date().toISOString(),
            source: 'https://www.appengage.io/'
        });

        console.log('Sending webhook data to n8n:', webhookData);

        // Send data to n8n webhook
        const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'AppEngage-Website/1.0'
            },
            body: webhookData
        });

        if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            console.error('❌ Webhook error response:', errorText);
            console.error('❌ Status:', webhookResponse.status, webhookResponse.statusText);
            throw new Error(`Webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
        }

        console.log('✅ Webhook sent successfully to n8n');
        console.log('📧 Email:', email);
        console.log('📱 App URL:', playstore_url);

        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: 'Form submitted successfully. We\'ll send your report shortly!' 
        });

    } catch (error) {
        console.error('❌ Form submission error:', error);
        
        // Return error response
        return res.status(500).json({ 
            success: false,
            message: 'Failed to submit form. Please try again later.' 
        });
    }
} 