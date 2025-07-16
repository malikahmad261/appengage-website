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
        const { app_name, app_url, prospect_name, email } = req.body;

        // Validate required fields
        if (!app_name || !app_url || !email) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: app_name, app_url, and email are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide a valid email address' 
            });
        }

        // Validate Google Play URL format
        if (!app_url.includes('play.google.com/store/apps/details')) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide a valid Google Play Store URL' 
            });
        }

        // Generate unique ID for this sample report
        const timestamp = Date.now();
        const cleanAppName = app_name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .substring(0, 20); // Limit length
        
        const reportId = `${cleanAppName}-${timestamp}`;
        
        // n8n webhook URL from environment variables
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
        
        if (!N8N_WEBHOOK_URL) {
            console.error('❌ N8N_WEBHOOK_URL environment variable not set in Vercel');
            return res.status(500).json({ 
                success: false,
                message: 'Webhook not configured. Please contact support.' 
            });
        }

        // Prepare data for n8n webhook in the EXACT format (matching your existing structure)
        const webhookData = JSON.stringify({
            body: {
                email: email,
                googlePlayUrl: app_url,
                timestamp: new Date().toISOString(),
                source: 'admin_panel',
                // Additional fields for sample reports
                app_name: app_name,
                prospect_name: prospect_name || 'Prospect',
                report_id: reportId,
                type: 'sample_report'
            }
        });

        console.log('🚀 Generating sample report for:', app_name);
        console.log('📊 Report ID:', reportId);
        console.log('🎯 Prospect:', prospect_name || 'Unknown');
        console.log('📧 Email:', email);

        // Send data to n8n webhook
        const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'AppEngage-Admin/1.0'
            },
            body: webhookData
        });

        if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text();
            console.error('❌ Webhook error response:', errorText);
            console.error('❌ Status:', webhookResponse.status, webhookResponse.statusText);
            throw new Error(`Webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
        }

        // Parse n8n response
        let webhookResult;
        try {
            webhookResult = await webhookResponse.json();
        } catch (parseError) {
            console.log('⚠️ n8n response not JSON, continuing with basic response');
            webhookResult = { success: true };
        }

        console.log('✅ Sample report generation initiated successfully');
        console.log('📱 App:', app_name);
        console.log('📧 Email:', email);
        console.log('🔗 URL:', app_url);

        // Construct preview URL
        const baseUrl = req.headers.host?.includes('localhost') 
            ? `http://${req.headers.host}` 
            : `https://${req.headers.host}`;
        
        const previewUrl = `${baseUrl}/samples/${reportId}.html`;

        // Return success response with preview URL
        return res.status(200).json({ 
            success: true, 
            message: 'Sample report generation started successfully',
            report_id: reportId,
            preview_url: previewUrl,
            app_name: app_name,
            prospect_name: prospect_name || 'Prospect',
            email: email,
            estimated_time: '30-60 seconds',
            status: 'processing',
            webhook_response: webhookResult.success ? 'initiated' : 'unknown'
        });

    } catch (error) {
        console.error('❌ Error generating sample report:', error.message);
        console.error('❌ Full error:', error);
        
        return res.status(500).json({ 
            success: false,
            message: 'Failed to generate sample report. Please try again or contact support.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}