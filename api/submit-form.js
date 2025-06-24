export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, playstoreUrl, appName, appDeveloper, appIcon } = req.body;

        // Validate required fields
        if (!email || !playstoreUrl) {
            return res.status(400).json({ 
                error: 'Missing required fields: email and googlePlayUrl are required' 
            });
        }

        // Get webhook URL from environment variables
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        
        if (!webhookUrl) {
            console.error('N8N_WEBHOOK_URL environment variable not set');
            return res.status(500).json({ 
                error: 'Webhook configuration error' 
            });
        }

        // Prepare data for n8n webhook - ensure proper JSON structure
        const webhookData = {
            body: {
                email,
                googlePlayUrl: playstoreUrl,
                timestamp: new Date().toISOString(),
                source: 'https://www.appengage.io/',
                // Include app details if available
                ...(appName && { appName }),
                ...(appDeveloper && { appDeveloper }),
                ...(appIcon && { appIcon })
            }
        };

        // Log the webhook data being sent (for debugging)
        console.log('Sending webhook data:', JSON.stringify(webhookData, null, 2));

        // Send data to n8n webhook
        const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'AppEngage-Website/1.0'
            },
            body: JSON.stringify(webhookData)
        });

        if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            console.error('Webhook error response:', errorText);
            throw new Error(`Webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
        }

        console.log('Webhook sent successfully');

        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: 'Form submitted successfully. We\'ll send your report shortly!' 
        });

    } catch (error) {
        console.error('Form submission error:', error);
        
        // Return error response
        return res.status(500).json({ 
            success: false,
            error: 'Failed to submit form. Please try again later.' 
        });
    }
} 