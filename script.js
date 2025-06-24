// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Script starting');
    
    // Handle form submission
    const reportForm = document.querySelector('.report-form');
    console.log('Form found:', reportForm);
    
    if (reportForm) {
        reportForm.addEventListener('submit', async function(e) {
            console.log('Form submit triggered!');
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const playstoreUrl = document.getElementById('selected-app-url').value;
            
            console.log('Form values:', { email, playstoreUrl });
            
            // Get selected app details if available
            const selectedAppName = document.getElementById('selected-app-name')?.textContent || '';
            const selectedAppDeveloper = document.getElementById('selected-app-developer')?.textContent || '';
            const selectedAppIcon = document.getElementById('selected-app-icon')?.src || '';
            
            // Basic validation with better user feedback
            if (!email) {
                alert('Please enter your email address');
                document.getElementById('email').focus();
                return;
            }
            
            if (!playstoreUrl) {
                alert('Please search for and select your app from the dropdown first');
                document.getElementById('app-search').focus();
                return;
            }
            
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            try {
                // Update button state
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Prepare form data
                const formData = {
                    email: email,
                    playstoreUrl: playstoreUrl,
                    appName: selectedAppName,
                    appDeveloper: selectedAppDeveloper,
                    appIcon: selectedAppIcon
                };
                
                // Send to webhook API
                const response = await fetch('/api/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success overlay instead of alert
                    showSuccessState();
                    reportForm.reset();
                    clearAppSelection();
                } else {
                    throw new Error(result.error || 'Submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error submitting your request. Please try again later.');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Backup: Direct button click listener
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        console.log('Submit button found:', submitBtn);
        submitBtn.addEventListener('click', function(e) {
            console.log('Submit button clicked directly!');
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
    // API key is handled by the backend serverless function for security
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
                icon: "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s64-rw",
                rating: "4.1",
                downloads: "5B+"
            },
            {
                name: "Instagram",
                developer: "Instagram",
                url: "https://play.google.com/store/apps/details?id=com.instagram.android",
                icon: "https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q=s64-rw",
                rating: "4.2",
                downloads: "5B+"
            },
            {
                name: "Facebook",
                developer: "Meta Platforms, Inc.",
                url: "https://play.google.com/store/apps/details?id=com.facebook.katana",
                icon: "https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=s64-rw",
                rating: "3.9",
                downloads: "5B+"
            },
            {
                name: "TikTok",
                developer: "TikTok Pte. Ltd.",
                url: "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically",
                icon: "https://play-lh.googleusercontent.com/q_TdQf03Va9YYsiJfDXEQJBBFlKN-kaTWL_yaQufIaVyUxLbp9U9LiZdmnY3W-nfLPo=s64-rw",
                rating: "4.4",
                downloads: "1B+",
                featured: true
            },
            {
                name: "YouTube",
                developer: "Google LLC",
                url: "https://play.google.com/store/apps/details?id=com.google.android.youtube",
                icon: "https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc=s64-rw",
                rating: "4.3",
                downloads: "10B+"
            },
            {
                name: "Spotify",
                developer: "Spotify AB",
                url: "https://play.google.com/store/apps/details?id=com.spotify.music",
                icon: "https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qMMZdwEDKI5VEmKAXfzOqbiaeAsqqrEBCTdIEs=s64-rw",
                rating: "4.3",
                downloads: "1B+"
            },
            {
                name: "Netflix",
                developer: "Netflix, Inc.",
                url: "https://play.google.com/store/apps/details?id=com.netflix.mediaclient",
                icon: "https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=s64-rw",
                rating: "4.1",
                downloads: "1B+"
            },
            {
                name: "Uber",
                developer: "Uber Technologies, Inc.",
                url: "https://play.google.com/store/apps/details?id=com.ubercab",
                icon: "https://play-lh.googleusercontent.com/QDs5ka7_qZCojp_9dXhLSC0sLI7Zpo8WdTsj2rkb5zTRY8jLd2I80NjWMnSZEe4yowQ=s64-rw",
                rating: "4.0",
                downloads: "1B+"
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
            
            // Enhanced display with ratings and download counts
            let additionalInfo = '';
            if (appData.rating || appData.downloads) {
                const ratingDisplay = appData.rating ? `<span class="rating">${appData.rating} stars</span>` : '';
                const downloadsDisplay = appData.downloads ? `<span class="downloads">${appData.downloads} downloads</span>` : '';
                const separator = (ratingDisplay && downloadsDisplay) ? ' • ' : '';
                additionalInfo = `<div class="search-result-meta">${ratingDisplay}${separator}${downloadsDisplay}</div>`;
            }

            resultItem.innerHTML = `
                <img src="${appData.icon}" alt="${appData.name}" class="search-result-icon" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"%3E%3Crect width=\"40\" height=\"40\" fill=\"%23e1e5e9\" rx=\"8\"/%3E%3Crect x=\"12\" y=\"8\" width=\"16\" height=\"20\" fill=\"%23fff\" rx=\"2\"/%3E%3Crect x=\"14\" y=\"10\" width=\"12\" height=\"1\" fill=\"%23ddd\"/%3E%3Crect x=\"14\" y=\"12\" width=\"8\" height=\"1\" fill=\"%23ddd\"/%3E%3Crect x=\"14\" y=\"14\" width=\"10\" height=\"1\" fill=\"%23ddd\"/%3E%3C/svg%3E'">
                <div class="search-result-info">
                    <span class="search-result-name">${appData.name}${appData.featured ? ' (Featured)' : ''}</span>
                    <span class="search-result-developer">${appData.developer}</span>
                    ${additionalInfo}
                </div>
            `;
            
            resultItem.addEventListener('click', () => selectApp(appData));
            searchDropdown.appendChild(resultItem);
        });

        searchDropdown.classList.add('show');
    }

    function displaySearchResults(results) {
        searchDropdown.innerHTML = '';
        currentSearchResults = results;

        if (!results || results.length === 0) {
            displayNoResults();
            return;
        }

        results.forEach(appData => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            // Enhanced display with ratings and download counts
            let additionalInfo = '';
            if (appData.rating || appData.downloads) {
                const ratingDisplay = appData.rating ? `<span class="rating">${appData.rating} stars</span>` : '';
                const downloadsDisplay = appData.downloads ? `<span class="downloads">${appData.downloads} downloads</span>` : '';
                const separator = (ratingDisplay && downloadsDisplay) ? ' • ' : '';
                additionalInfo = `<div class="search-result-meta">${ratingDisplay}${separator}${downloadsDisplay}</div>`;
            }

            resultItem.innerHTML = `
                <img src="${appData.icon}" alt="${appData.name}" class="search-result-icon" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"%3E%3Crect width=\"40\" height=\"40\" fill=\"%23e1e5e9\" rx=\"8\"/%3E%3Crect x=\"12\" y=\"8\" width=\"16\" height=\"20\" fill=\"%23fff\" rx=\"2\"/%3E%3Crect x=\"14\" y=\"10\" width=\"12\" height=\"1\" fill=\"%23ddd\"/%3E%3Crect x=\"14\" y=\"12\" width=\"8\" height=\"1\" fill=\"%23ddd\"/%3E%3Crect x=\"14\" y=\"14\" width=\"10\" height=\"1\" fill=\"%23ddd\"/%3E%3C/svg%3E'">
                <div class="search-result-info">
                    <span class="search-result-name">${appData.name}${appData.featured ? ' (Featured)' : ''}</span>
                    <span class="search-result-developer">${appData.developer}</span>
                    ${additionalInfo}
                </div>
            `;
            
            resultItem.addEventListener('click', () => selectApp(appData));
            searchDropdown.appendChild(resultItem);
        });

        searchDropdown.classList.add('show');
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

    // Success state functions
    function showSuccessState() {
        const successOverlay = document.getElementById('success-overlay');
        if (successOverlay) {
            successOverlay.classList.add('show');
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    function hideSuccessState() {
        const successOverlay = document.getElementById('success-overlay');
        if (successOverlay) {
            successOverlay.classList.remove('show');
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    // Success state close button listener
    const successCloseBtn = document.getElementById('success-close-btn');
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', hideSuccessState);
    }

    // Close success state when clicking outside the content
    const successOverlay = document.getElementById('success-overlay');
    if (successOverlay) {
        successOverlay.addEventListener('click', function(e) {
            if (e.target === successOverlay) {
                hideSuccessState();
            }
        });
    }

    // Close success state with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const successOverlay = document.getElementById('success-overlay');
            if (successOverlay && successOverlay.classList.contains('show')) {
                hideSuccessState();
            }
        }
    });
    
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
        const poweredBySection = document.querySelector('.powered-by');
        
        // Calculate when the powered-by section comes into view
        const poweredByOffset = poweredBySection ? poweredBySection.offsetTop : 200;
        
        if (window.scrollY >= poweredByOffset - 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = 'none';
        }
    });
    

    
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

    // Interactive features section for new features
    const featureNewItems = document.querySelectorAll('.feature-new-item');
    const featureNewImage = document.getElementById('feature-new-image');
    
    if (featureNewItems.length > 0 && featureNewImage) {
        featureNewItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                featureNewItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get the feature type from data attribute
                const featureType = this.getAttribute('data-feature');
                
                // Add changing class for animation
                const featureNewImageContainer = document.getElementById('feature-new-image-container');
                featureNewImageContainer.classList.add('changing');
                
                // Change image after a brief delay for smooth transition
                setTimeout(() => {
                    featureNewImage.src = `images/${featureType}.png`;
                    featureNewImage.alt = `${featureType.replace('-', ' ')} dashboard`;
                    
                    // Remove changing class after image loads
                    featureNewImage.onload = function() {
                        featureNewImageContainer.classList.remove('changing');
                    };
                }, 150);
            });
        });
    }
}); 