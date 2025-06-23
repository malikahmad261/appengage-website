// Vercel serverless function for SERP API integration
// File: api/search-apps.js

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { q: query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Your SERP API key (stored as environment variable for security)
        const SERP_API_KEY = process.env.SERP_API_KEY;
        
        // Prepare SERP API request
        const params = new URLSearchParams({
            engine: 'google',
            q: `${query} site:play.google.com/store/apps`,
            api_key: SERP_API_KEY,
            num: 10
        });

        // Call SERP API
        const response = await fetch(`https://serpapi.com/search?${params}`);
        
        if (!response.ok) {
            throw new Error(`SERP API responded with status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.organic_results) {
            // Process and filter results
            const playStoreResults = data.organic_results
                .filter(result => result.link && result.link.includes('play.google.com/store/apps/details'))
                .map(result => {
                    try {
                        // Extract app name from title
                        const title = result.title || '';
                        const appName = title.split(' - ')[0].trim();
                        
                        // Extract developer from snippet or title
                        let developer = 'Unknown Developer';
                        if (result.snippet) {
                            const snippetMatch = result.snippet.match(/by (.+?)(\.|$)/i);
                            if (snippetMatch) {
                                developer = snippetMatch[1].trim();
                            }
                        }

                        // Extract app ID from URL for better icon URL
                        const urlMatch = result.link.match(/id=([^&]+)/);
                        let iconUrl = `https://via.placeholder.com/64x64/4285f4/white?text=${appName.charAt(0)}`;
                        
                        if (urlMatch) {
                            const appId = urlMatch[1];
                            // Use Google Play Store icon URL format
                            iconUrl = `https://play-lh.googleusercontent.com/${appId}=s64-rw`;
                        }

                        return {
                            name: appName,
                            developer: developer,
                            url: result.link,
                            icon: iconUrl,
                            snippet: result.snippet?.substring(0, 150) + '...' || ''
                        };
                    } catch (error) {
                        console.error('Error processing result:', error);
                        return null;
                    }
                })
                .filter(Boolean) // Remove null results
                .slice(0, 8); // Limit to 8 results

            res.status(200).json({ 
                results: playStoreResults,
                total: playStoreResults.length,
                query: query 
            });
        } else {
            res.status(200).json({ 
                results: [],
                total: 0,
                query: query,
                message: 'No apps found'
            });
        }

    } catch (error) {
        console.error('SERP API Error:', error);
        res.status(500).json({ 
            error: 'Search failed',
            message: error.message 
        });
    }
} 