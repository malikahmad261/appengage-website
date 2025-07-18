import { supabase } from '../lib/supabase.js';

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
        const { reportId, htmlContent, appName, reportType, email, appId } = req.body;

        // Validate required fields
        if (!reportId || !htmlContent) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields: reportId and htmlContent are required' 
            });
        }

        // Store the report in Supabase
        const { data, error } = await supabase
            .from('reports')
            .insert([
                {
                    report_id: reportId,
                    html_content: htmlContent,
                    app_name: appName || 'Unknown App',
                    app_id: appId || null,
                    report_type: reportType || 'analysis',
                    email: email || null,
                    access_count: 0
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to store report in database.' 
            });
        }

        // Generate the shareable URL
        const shareableUrl = `https://appengage.io/api/report/${reportId}`;

        console.log(`Report stored with ID: ${reportId}`);

        // Return success response with shareable URL
        return res.status(200).json({ 
            success: true,
            message: 'Report stored successfully',
            shareableUrl: shareableUrl,
            reportId: reportId,
            expiresAt: data.expires_at
        });

    } catch (error) {
        console.error('Report storage error:', error.message);
        
        // Return error response
        return res.status(500).json({ 
            success: false,
            message: 'Failed to store report. Please try again later.' 
        });
    }
}