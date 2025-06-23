// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission
    const reportForm = document.querySelector('.report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const playstoreUrl = document.getElementById('selected-app-url').value;
            
            // Basic validation
            if (!email || !playstoreUrl) {
                alert('Please fill in all fields');
                return;
            }
            
            // Show success message (in a real app, this would submit to a server)
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you! We\'ll send your app analysis report to your email shortly.');
                reportForm.reset();
                clearAppSelection();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // App Search Functionality
    const appSearchInput = document.getElementById('app-search');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchLoading = document.getElementById('search-loading');
    const selectedAppContainer = document.getElementById('selected-app');
    const selectedAppUrl = document.getElementById('selected-app-url');
    const clearSelectionBtn = document.getElementById('clear-selection');

    let searchTimeout;
    let currentSearchResults = [];

    // SERP API Configuration - Replace with your actual API key
    const SERP_API_KEY = '49176704d5bba434ae660e9f04cb58ae318180225e949b1d52e1f675254f71e6'; // You'll need to replace this with your actual API key
    const SERP_API_URL = 'https://serpapi.com/search';

    function searchGooglePlayApps(query) {
        // Show loading state
        searchLoading.classList.add('show');
        searchDropdown.classList.remove('show');

        // Try real SERP API first, fallback to mock if needed
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? `http://localhost:3000/api/search-apps?q=${encodeURIComponent(query)}`
            : `/api/search-apps?q=${encodeURIComponent(query)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                searchLoading.classList.remove('show');
                
                if (data.results && data.results.length > 0) {
                    displaySearchResults(data.results);
                } else {
                    displayNoResults();
                }
            })
            .catch(error => {
                console.error('SERP API Error:', error);
                
                // Fallback to mock search if API fails
                console.log('Falling back to mock search...');
                setTimeout(() => {
                    searchLoading.classList.remove('show');
                    
                    const mockResults = generateMockResults(query);
                    if (mockResults.length > 0) {
                        displayMockResults(mockResults);
                    } else {
                        displayNoResults();
                    }
                }, 500);
            });
    }

    function generateMockResults(query) {
        const mockApps = [
            {
                name: "WhatsApp Messenger",
                developer: "WhatsApp LLC",
                url: "https://play.google.com/store/apps/details?id=com.whatsapp",
                icon: "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s64-rw"
            },
            {
                name: "Instagram",
                developer: "Instagram",
                url: "https://play.google.com/store/apps/details?id=com.instagram.android",
                icon: "https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q=s64-rw"
            },
            {
                name: "Facebook",
                developer: "Meta Platforms, Inc.",
                url: "https://play.google.com/store/apps/details?id=com.facebook.katana",
                icon: "https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=s64-rw"
            },
            {
                name: "TikTok",
                developer: "TikTok Pte. Ltd.",
                url: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
                icon: "https://play-lh.googleusercontent.com/q_TdQf03Va9YYsiJfDXEQJBBFlKN-kaTWL_yaQufIaVyUxLbp9U9LiZdmnY3W-nfLPo=s64-rw"
            },
            {
                name: "YouTube",
                developer: "Google LLC",
                url: "https://play.google.com/store/apps/details?id=com.google.android.youtube",
                icon: "https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc=s64-rw"
            },
            {
                name: "Spotify",
                developer: "Spotify AB",
                url: "https://play.google.com/store/apps/details?id=com.spotify.music",
                icon: "https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qMMZdwEDKI5VEmKAXfzOqbiaeAsqqrEBCTdIEs=s64-rw"
            },
            {
                name: "Netflix",
                developer: "Netflix, Inc.",
                url: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
                icon: "https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=s64-rw"
            },
            {
                name: "Uber",
                developer: "Uber Technologies, Inc.",
                url: "https://play.google.com/store/apps/details?id=com.ubercab",
                icon: "https://play-lh.googleusercontent.com/QDs5ka7_qZCojp_9dXhLSC0sLI7Zpo8WdTsj2rkb5zTRY8jLd2I80NjWMnSZEe4yowQ=s64-rw"
            }
        ];

        // Filter apps based on query
        return mockApps.filter(app => 
            app.name.toLowerCase().includes(query.toLowerCase()) ||
            app.developer.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Limit to 5 results
    }

    function displayMockResults(results) {
        searchDropdown.innerHTML = '';
        currentSearchResults = results;

        results.forEach(appData => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${appData.icon}" alt="${appData.name}" class="search-result-icon" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"%3E%3Crect width=\"40\" height=\"40\" fill=\"%23f0f0f0\"/%3E%3Ctext x=\"20\" y=\"25\" text-anchor=\"middle\" font-size=\"24\"%3E📱%3C/text%3E%3C/svg%3E'">
                <div class="search-result-info">
                    <span class="search-result-name">${appData.name}</span>
                    <span class="search-result-developer">${appData.developer}</span>
                </div>
            `;
            
            resultItem.addEventListener('click', () => selectApp(appData));
            searchDropdown.appendChild(resultItem);
        });

        searchDropdown.classList.add('show');
    }

    function displaySearchResults(results) {
        searchDropdown.innerHTML = '';
        currentSearchResults = [];

        const playStoreResults = results.filter(result => 
            result.link && result.link.includes('play.google.com/store/apps/details')
        );

        if (playStoreResults.length === 0) {
            displayNoResults();
            return;
        }

        playStoreResults.forEach(result => {
            const appData = parseGooglePlayResult(result);
            if (appData) {
                currentSearchResults.push(appData);
                
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${appData.icon}" alt="${appData.name}" class="search-result-icon" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"><rect width=\"40\" height=\"40\" fill=\"%23f0f0f0\"/><text x=\"20\" y=\"25\" text-anchor=\"middle\" font-size=\"24\">📱</text></svg>'">
                    <div class="search-result-info">
                        <span class="search-result-name">${appData.name}</span>
                        <span class="search-result-developer">${appData.developer}</span>
                    </div>
                `;
                
                resultItem.addEventListener('click', () => selectApp(appData));
                searchDropdown.appendChild(resultItem);
            }
        });

        if (currentSearchResults.length > 0) {
            searchDropdown.classList.add('show');
        } else {
            displayNoResults();
        }
    }

    function parseGooglePlayResult(result) {
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

            // Generate a placeholder icon URL (in production, you'd extract this from the page)
            const iconUrl = `https://via.placeholder.com/40x40/4285f4/white?text=${appName.charAt(0)}`;

            return {
                name: appName,
                developer: developer,
                url: result.link,
                icon: iconUrl
            };
        } catch (error) {
            console.error('Error parsing result:', error);
            return null;
        }
    }

    function displayNoResults() {
        searchDropdown.innerHTML = `
            <div class="search-result-item" style="justify-content: center; color: #666; cursor: default;">
                <span>No apps found. Try a different search term.</span>
            </div>
        `;
        searchDropdown.classList.add('show');
    }

    function selectApp(appData) {
        // Hide dropdown
        searchDropdown.classList.remove('show');
        
        // Clear search input
        appSearchInput.value = '';
        
        // Set selected app URL
        selectedAppUrl.value = appData.url;
        
        // Show selected app
        document.getElementById('selected-app-icon').src = appData.icon;
        document.getElementById('selected-app-name').textContent = appData.name;
        document.getElementById('selected-app-developer').textContent = appData.developer;
        selectedAppContainer.style.display = 'flex';
        
        // Hide search container
        document.querySelector('.app-search-container').style.display = 'none';
    }

    function clearAppSelection() {
        selectedAppContainer.style.display = 'none';
        selectedAppUrl.value = '';
        document.querySelector('.app-search-container').style.display = 'block';
        appSearchInput.value = '';
        searchDropdown.classList.remove('show');
    }

    // Event listeners for app search
    if (appSearchInput) {
        appSearchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            // Hide dropdown if query is empty
            if (query.length === 0) {
                searchDropdown.classList.remove('show');
                searchLoading.classList.remove('show');
                return;
            }
            
            // Search after user stops typing for 500ms
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    searchGooglePlayApps(query);
                }, 500);
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.app-search-container')) {
                searchDropdown.classList.remove('show');
                searchLoading.classList.remove('show');
            }
        });
    }

    // Clear selection event listener
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearAppSelection);
    }
    
    // Handle report pill clicks
    const reportPills = document.querySelectorAll('.report-pill');
    const reportPreviews = document.querySelectorAll('.report-preview');
    
    reportPills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remove active class from all pills
            reportPills.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked pill
            this.classList.add('active');
            
            // Hide all previews
            reportPreviews.forEach(preview => preview.classList.remove('active'));
            
            // Show corresponding preview
            const reportType = this.getAttribute('data-report');
            const targetPreview = document.getElementById(`preview-${reportType}`);
            if (targetPreview) {
                targetPreview.classList.add('active');
            }
        });
    });

    // Handle view full report button clicks
    const viewFullReportBtns = document.querySelectorAll('.view-full-report-btn');
    viewFullReportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const fileName = this.getAttribute('data-file');
            
            // Add loading state to button
            const originalText = this.textContent;
            this.textContent = 'Opening Report...';
            this.disabled = true;
            this.style.opacity = '0.7';
            
            // Small delay for better UX, then open report in same page
            setTimeout(() => {
                if (fileName) {
                    // Navigate to the report in the same page
                    window.location.href = `sample-reports/${fileName}`;
                } else {
                    // Fallback for any missing file attributes
                    const fileMap = {
                        'fintech': 'venmo_sample_report.html',
                        'ecommerce': 'amazon_sample_report.html',
                        'streaming': 'netflix_sample_report.html',
                        'gaming': 'minecraft_sample_report.html'
                    };
                    
                    if (fileMap[category]) {
                        window.location.href = `sample-reports/${fileMap[category]}`;
                    } else {
                        alert(`Report for ${category} is not available yet.`);
                        // Reset button state
                        this.textContent = originalText;
                        this.disabled = false;
                        this.style.opacity = '1';
                    }
                }
            }, 500);
        });
    });

    // Handle legacy view report button clicks (if any exist)
    const viewReportBtns = document.querySelectorAll('.view-report-btn');
    viewReportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportCard = this.closest('.report-card');
            const category = reportCard.querySelector('.report-category').textContent;
            const appName = reportCard.querySelector('.app-name').textContent;
            
            // Check if this is the Fintech Cash App report
            if (category === 'Fintech' && appName === 'Cash App') {
                // Add loading state to button
                const originalText = this.textContent;
                this.textContent = 'Opening Report...';
                this.disabled = true;
                this.style.opacity = '0.7';
                
                // Small delay for better UX, then open report
                setTimeout(() => {
                    window.open('sample-reports/app_review_report.html', '_blank');
                    
                    // Reset button state
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.opacity = '1';
                }, 500);
            } else {
                alert(`Viewing ${category} report for ${appName}. This would open a sample report in a real application.`);
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });
    
    // Interactive features section
    const featureItems = document.querySelectorAll('.feature-item');
    const featureImage = document.getElementById('feature-image');
    
    if (featureItems.length > 0 && featureImage) {
        featureItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                featureItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get the feature type from data attribute
                const featureType = this.getAttribute('data-feature');
                
                // Add changing class for animation
                featureImage.classList.add('changing');
                
                // Change image after a brief delay for smooth transition
                setTimeout(() => {
                    featureImage.src = `images/${featureType}.png`;
                    featureImage.alt = `${featureType.replace('-', ' ')} dashboard`;
                    
                    // Remove changing class after image loads
                    featureImage.onload = function() {
                        featureImage.classList.remove('changing');
                    };
                }, 150);
            });
        });
    }
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and report cards
    const cards = document.querySelectorAll('.feature-card, .report-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}); 