import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        // Get report from Supabase
        const { data: report, error } = await supabase
            .from('reports')
            .select('*')
            .eq('report_id', id)
            .single();

        if (error || !report) {
            // Check if report expired
            if (report && new Date(report.expires_at) < new Date()) {
                // Return expired page
                return res.status(410).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Report Expired - AppEngage</title>
                        <style>
                            body { 
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                margin: 0;
                                padding: 40px;
                                background-color: #f5f5f5;
                                color: #333;
                                text-align: center;
                            }
                            .container { 
                                max-width: 500px;
                                margin: 0 auto;
                                background: white;
                                padding: 40px;
                                border-radius: 8px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }
                            h1 { color: #f39c12; margin-bottom: 20px; }
                            p { margin-bottom: 30px; line-height: 1.6; }
                            a { 
                                color: #3498db;
                                text-decoration: none;
                                font-weight: 500;
                            }
                            a:hover { text-decoration: underline; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Report Expired</h1>
                            <p>This report has expired and is no longer available.</p>
                            <p><a href="/">← Generate a New Report</a></p>
                        </div>
                    </body>
                    </html>
                `);
            }

            // Return 404 page
            return res.status(404).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Report Not Found - AppEngage</title>
                    <style>
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            margin: 0;
                            padding: 40px;
                            background-color: #f5f5f5;
                            color: #333;
                            text-align: center;
                        }
                        .container { 
                            max-width: 500px;
                            margin: 0 auto;
                            background: white;
                            padding: 40px;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        h1 { color: #e74c3c; margin-bottom: 20px; }
                        p { margin-bottom: 30px; line-height: 1.6; }
                        a { 
                            color: #3498db;
                            text-decoration: none;
                            font-weight: 500;
                        }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Report Not Found</h1>
                        <p>The report you're looking for doesn't exist or may have expired.</p>
                        <p><a href="/">← Back to AppEngage</a></p>
                    </div>
                </body>
                </html>
            `);
        }

        // Check if report has expired
        if (new Date(report.expires_at) < new Date()) {
            // Return expired page
            return res.status(410).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Report Expired - AppEngage</title>
                    <style>
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            margin: 0;
                            padding: 40px;
                            background-color: #f5f5f5;
                            color: #333;
                            text-align: center;
                        }
                        .container { 
                            max-width: 500px;
                            margin: 0 auto;
                            background: white;
                            padding: 40px;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        h1 { color: #f39c12; margin-bottom: 20px; }
                        p { margin-bottom: 30px; line-height: 1.6; }
                        a { 
                            color: #3498db;
                            text-decoration: none;
                            font-weight: 500;
                        }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Report Expired</h1>
                        <p>This report has expired and is no longer available.</p>
                        <p><a href="/">← Generate a New Report</a></p>
                    </div>
                </body>
                </html>
            `);
        }

        // Increment access count and update last accessed
        await supabase
            .from('reports')
            .update({ 
                access_count: report.access_count + 1,
                last_accessed_at: new Date().toISOString()
            })
            .eq('report_id', id);

        // Set proper headers for HTML content
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        
        // Return the HTML content
        return res.status(200).send(report.html_content);

    } catch (error) {
        console.error('Error fetching report:', error);
        
        // Return error page
        return res.status(500).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error - AppEngage</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 40px;
                        background-color: #f5f5f5;
                        color: #333;
                        text-align: center;
                    }
                    .container { 
                        max-width: 500px;
                        margin: 0 auto;
                        background: white;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 { color: #e74c3c; margin-bottom: 20px; }
                    p { margin-bottom: 30px; line-height: 1.6; }
                    a { 
                        color: #3498db;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Something went wrong</h1>
                    <p>We're having trouble loading this report. Please try again later.</p>
                    <p><a href="/">← Back to AppEngage</a></p>
                </div>
            </body>
            </html>
        `);
    }
}