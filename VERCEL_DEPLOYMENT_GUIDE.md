# 🚀 Vercel Deployment Guide for AppEngage Website

This guide will help you deploy your AppEngage website to Vercel with full SERP API integration for dynamic app search functionality.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) installed (version 18 or higher)
- [Git](https://git-scm.com/) installed
- A [GitHub](https://github.com/) account
- A [Vercel](https://vercel.com/) account
- Your SERP API key from [serpapi.com](https://serpapi.com/)

## 📁 Project Structure

Your project should have this structure:
```
AppEngage Website/
├── api/
│   └── search-apps.js          # Vercel serverless function
├── images/                     # All your images
├── sample-reports/            # Sample report files
├── index.html                 # Main website
├── styles.css                 # Stylesheet
├── script.js                  # JavaScript with API integration
├── package.json               # Node.js dependencies
├── vercel.json               # Vercel configuration
├── .gitignore                # Git ignore file
└── VERCEL_DEPLOYMENT_GUIDE.md # This guide
```

## 🛠️ Step-by-Step Deployment

### Step 1: Initialize Git Repository

1. **Open terminal** in your project folder
2. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

3. **Add all files**:
   ```bash
   git add .
   ```

4. **Commit files**:
   ```bash
   git commit -m "Initial commit: AppEngage website with SERP API integration"
   ```

### Step 2: Push to GitHub

1. **Create a new repository** on GitHub:
   - Go to [github.com/new](https://github.com/new)
   - Name it "appengage-website" (or your preferred name)
   - Make it public or private
   - Don't initialize with README (since you already have files)

2. **Connect your local repo to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/appengage-website.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Website (Recommended)

1. **Go to** [vercel.com](https://vercel.com/)
2. **Sign up/Login** using your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository**:
   - Find "appengage-website" in the list
   - Click "Import"
5. **Configure the project**:
   - **Project Name**: `appengage-website`
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (default)
   - **Build Command**: Leave empty or use default
   - **Output Directory**: Leave empty
6. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `SERP_API_KEY` = `49176704d5bba434ae660e9f04cb58ae318180225e949b1d52e1f675254f71e6`
7. **Click "Deploy"**

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project folder**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? `N`
   - What's your project's name? `appengage-website`
   - In which directory is your code located? `./`

5. **Add environment variable**:
   ```bash
   vercel env add SERP_API_KEY
   ```
   Enter your SERP API key when prompted.

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Step 4: Configure Environment Variables

In the Vercel dashboard:

1. **Go to your project**
2. **Click "Settings"**
3. **Click "Environment Variables"**
4. **Add the following**:
   - **Name**: `SERP_API_KEY`
   - **Value**: `49176704d5bba434ae660e9f04cb58ae318180225e949b1d52e1f675254f71e6`
   - **Environments**: Production, Preview, Development (check all)
5. **Click "Save"**

### Step 5: Test Your Deployment

1. **Visit your deployed URL** (Vercel will provide this)
2. **Test the app search functionality**:
   - Scroll to "Search for Your App" section
   - Type an app name (e.g., "WhatsApp", "Instagram")
   - Verify the dropdown appears with real results
3. **Check the API endpoint**:
   - Visit `https://your-app.vercel.app/api/search-apps?q=whatsapp`
   - Should return JSON with app search results

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. CORS Errors
**Problem**: Browser blocks API requests
**Solution**: The `vercel.json` file already includes CORS headers. If issues persist, check browser console for specific errors.

#### 2. API Function Timeout
**Problem**: Search takes too long
**Solution**: The function timeout is set to 30 seconds in `vercel.json`. You can increase it if needed.

#### 3. Environment Variable Not Working
**Problem**: SERP API key not found
**Solution**: 
- Ensure environment variable is set in Vercel dashboard
- Redeploy after adding environment variables
- Check the variable name matches exactly: `SERP_API_KEY`

#### 4. Build Errors
**Problem**: Deployment fails
**Solution**:
- Check that all files are committed to Git
- Ensure `package.json` is in the root directory
- Verify Node.js version compatibility

#### 5. API Returns No Results
**Problem**: Search returns empty results
**Solution**:
- Check SERP API key validity
- Test the API directly: `https://serpapi.com/search?engine=google&q=whatsapp+site:play.google.com/store/apps&api_key=YOUR_KEY`
- Check Vercel function logs in the dashboard

### Checking Logs

1. **Go to Vercel dashboard**
2. **Click on your project**
3. **Click "Functions"**
4. **Click "View Function Logs"**
5. **Check for any error messages**

## 🚀 Going Live

Once deployed successfully:

1. **Update your domain** (optional):
   - In Vercel dashboard, go to "Domains"
   - Add your custom domain if you have one

2. **Monitor usage**:
   - Check Vercel dashboard for function invocations
   - Monitor SERP API usage at serpapi.com

3. **Update as needed**:
   - Push changes to GitHub
   - Vercel will automatically redeploy

## 📞 Support

If you encounter issues:

1. **Check Vercel documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **SERP API documentation**: [serpapi.com/search-api](https://serpapi.com/search-api)
3. **Function logs** in Vercel dashboard
4. **GitHub Issues** for code-related problems

## 🎉 Success!

Your AppEngage website is now live with:
- ✅ Dynamic app search functionality
- ✅ Real-time SERP API integration
- ✅ Automatic fallback to mock search
- ✅ Global CDN distribution via Vercel
- ✅ Serverless architecture for optimal performance

**Live URL**: `https://your-project-name.vercel.app`

Enjoy your fully functional AppEngage website! 🚀 