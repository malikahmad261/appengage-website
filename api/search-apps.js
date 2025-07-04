// Vercel serverless function for SERP API integration
// File: api/search-apps.js

export default async function handler(req, res) {
    console.log('Search function started.');

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
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query } = req.query;
        console.log('Received query:', query);
        
        if (!query) {
            console.log('Query parameter is missing.');
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Your SERP API key (stored as environment variable for security)
        const SERP_API_KEY = process.env.SERP_API_KEY;
        
        if (!SERP_API_KEY) {
            console.error('SERP_API_KEY environment variable not found.');
            throw new Error('SERP API key not configured');
        }
        console.log('SERP API Key is present.');
        
        // Prepare SERP API request using Google Play Store API
        const params = new URLSearchParams({
            engine: 'google_play',
            q: query,
            store: 'apps',
            api_key: SERP_API_KEY,
            gl: 'us',
            hl: 'en'
        });

        // Call SERP API
        const apiUrl = `https://serpapi.com/search?${params}`;
        console.log('Fetching from SerpApi with query:', query);
        console.log('Full SerpApi URL (without API key):', apiUrl.replace(/api_key=[^&]+/, 'api_key=***'));
        console.log('SerpApi parameters:', Object.fromEntries(params));
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('SerpApi response not OK:', response.status, errorText);
            throw new Error(`SERP API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully received data from SerpApi.');
        console.log('Raw SerpApi response:', JSON.stringify(data, null, 2));

        // Process results from Google Play Store API
        let playStoreResults = [];

        // Handle app_highlight (featured app result)
        if (data.app_highlight) {
            const app = data.app_highlight;
            playStoreResults.push({
                title: app.title || 'Unknown App',
                developer: app.author || 'Unknown Developer',
                url: app.link || '',
                icon: app.thumbnail || `https://via.placeholder.com/64x64/4285f4/white?text=${(app.title || 'A').charAt(0)}`,
                snippet: app.description || '',
                rating: app.rating || null,
                reviews: app.reviews || null,
                downloads: app.downloads || null,
                featured: true
            });
        }

        // Handle organic_results (regular app search results)
        if (data.organic_results && Array.isArray(data.organic_results)) {
            const organicApps = data.organic_results.map(app => {
                return {
                    title: app.title || 'Unknown App',
                    developer: app.author || 'Unknown Developer', 
                    url: app.link || '',
                    icon: app.thumbnail || `https://via.placeholder.com/64x64/4285f4/white?text=${(app.title || 'A').charAt(0)}`,
                    snippet: app.description?.substring(0, 150) + '...' || '',
                    rating: app.rating || null,
                    reviews: app.reviews || null,
                    downloads: app.downloads || null,
                    featured: false
                };
            }).filter(app => app.title && app.title !== 'Unknown App');

            playStoreResults = playStoreResults.concat(organicApps);
        }

        // Remove duplicates and limit results
        const uniqueResults = playStoreResults
            .filter((app, index, self) => 
                index === self.findIndex(a => a.title === app.title && a.developer === app.developer)
            )
            .slice(0, 8);

        console.log(`Found ${uniqueResults.length} unique results.`);
        console.log('Final results being sent to frontend:', JSON.stringify(uniqueResults, null, 2));

        if (uniqueResults.length > 0) {
            res.status(200).json({ 
                success: true,
                apps: uniqueResults,
                total: uniqueResults.length,
                query: query 
            });
        } else {
            console.log('No results found from SerpApi, returning fallback.');
            // Fallback to mock search if no results
            const mockApps = [
                { title: 'WhatsApp Messenger', developer: 'WhatsApp LLC', url: 'https://play.google.com/store/apps/details?id=com.whatsapp', icon: 'https://play-lh.googleusercontent.com/bYtqbOcTYOlbel5rXFBQDaXj_d3vAj5KqPqz7FXJ1FNJFNqCbUrwPnD7aRMpDJVa5A=s64-rw' },
                { title: 'Instagram', developer: 'Instagram', url: 'https://play.google.com/store/apps/details?id=com.instagram.android', icon: 'https://play-lh.googleusercontent.com/3Mz0YpIKWBaHnGjG_oSGqHvmHc1QTN5k_LMRWzS3UGqJ6HbJGHhGHhGHhGHhGHhGHhG=s64-rw' },
                { title: 'easypaisa', developer: 'Telenor Microfinance Bank', url: 'https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix', icon: 'https://via.placeholder.com/64x64/00A651/white?text=E', snippet: 'Mobile Financial Services', rating: 4.2, reviews: '100K+', downloads: '10M+' }
            ].filter(app => app.title.toLowerCase().includes(query.toLowerCase()));

            res.status(200).json({ 
                success: true,
                apps: mockApps,
                total: mockApps.length,
                query: query,
                fallback: true
            });
        }

    } catch (error) {
        console.error('Caught an error in search function:', error.message);
        
        // Enhanced fallback search for better user experience
        const mockApps = [
            { title: 'WhatsApp Messenger', developer: 'WhatsApp LLC', url: 'https://play.google.com/store/apps/details?id=com.whatsapp', icon: 'https://via.placeholder.com/64x64/25D366/white?text=W', snippet: 'Simple. Reliable. Secure.', rating: 4.1, reviews: '50M+', downloads: '5B+' },
            { title: 'Instagram', developer: 'Instagram', url: 'https://play.google.com/store/apps/details?id=com.instagram.android', icon: 'https://via.placeholder.com/64x64/E4405F/white?text=I', snippet: 'Create and share photos, stories, and videos', rating: 4.2, reviews: '100M+', downloads: '5B+' },
            { title: 'Facebook', developer: 'Meta Platforms, Inc.', url: 'https://play.google.com/store/apps/details?id=com.facebook.katana', icon: 'https://via.placeholder.com/64x64/1877F2/white?text=F', snippet: 'Find friends and discover new ones', rating: 3.9, reviews: '50M+', downloads: '5B+' },
            { title: 'Netflix', developer: 'Netflix, Inc.', url: 'https://play.google.com/store/apps/details?id=com.netflix.mediaclient', icon: 'https://via.placeholder.com/64x64/E50914/white?text=N', snippet: 'Watch TV shows & movies', rating: 4.1, reviews: '10M+', downloads: '1B+' },
            { title: 'Spotify', developer: 'Spotify AB', url: 'https://play.google.com/store/apps/details?id=com.spotify.music', icon: 'https://via.placeholder.com/64x64/1DB954/white?text=S', snippet: 'Music and Podcasts', rating: 4.3, reviews: '20M+', downloads: '1B+' },
            { title: 'Uber', developer: 'Uber Technologies, Inc.', url: 'https://play.google.com/store/apps/details?id=com.ubercab', icon: 'https://via.placeholder.com/64x64/000000/white?text=U', snippet: 'Request a ride', rating: 4.1, reviews: '5M+', downloads: '500M+' },
            { title: 'YouTube', developer: 'Google LLC', url: 'https://play.google.com/store/apps/details?id=com.google.android.youtube', icon: 'https://via.placeholder.com/64x64/FF0000/white?text=Y', snippet: 'Watch, upload and share videos', rating: 4.1, reviews: '50M+', downloads: '10B+' },
            { title: 'TikTok', developer: 'TikTok Pte. Ltd.', url: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically', icon: 'https://via.placeholder.com/64x64/000000/white?text=T', snippet: 'Make Your Day', rating: 4.4, reviews: '50M+', downloads: '1B+' },
            { title: 'easypaisa', developer: 'Telenor Microfinance Bank', url: 'https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix', icon: 'https://via.placeholder.com/64x64/00A651/white?text=E', snippet: 'Mobile Financial Services', rating: 4.2, reviews: '100K+', downloads: '10M+' }
        ].filter(app => app.title.toLowerCase().includes(req.query.query?.toLowerCase() || ''));

        res.status(200).json({ 
            success: true,
            apps: mockApps.slice(0, 8),
            total: mockApps.length,
            query: req.query.query || '',
            fallback: true,
            error: 'Using fallback search due to API error'
        });
    }
} 