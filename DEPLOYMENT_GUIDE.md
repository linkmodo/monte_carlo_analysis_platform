# Deployment Guide - Monte Carlo Analysis Portal

This guide provides step-by-step instructions for deploying the Monte Carlo Analysis Portal to Netlify using GitHub.

## Prerequisites

- GitHub account
- Netlify account (free tier is sufficient)
- Git installed on your computer
- Node.js installed (v16 or higher)

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository (if not already done)

```bash
cd "E:\PycharmProjects\Monte Carlo Analysis Portal"
git init
```

### 1.2 Create .gitignore

The `.gitignore` file is already created. It excludes:
- `node_modules/`
- `dist/`
- IDE files
- Environment files

### 1.3 Make Initial Commit

```bash
git add .
git commit -m "Initial commit: Monte Carlo Analysis Portal"
```

## Step 2: Create GitHub Repository

### 2.1 Create Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it: `monte-carlo-analysis-portal`
5. Choose visibility (Public or Private)
6. **Do NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

### 2.2 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/monte-carlo-analysis-portal.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Netlify

### Option A: Netlify UI (Recommended for First Deployment)

#### 3.1 Connect GitHub to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Sign up or log in
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub"
5. Authorize Netlify to access your GitHub account
6. Select your repository: `monte-carlo-analysis-portal`

#### 3.2 Configure Build Settings

Netlify should auto-detect the settings, but verify:

- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Build settings**: These are already configured in `netlify.toml`

#### 3.3 Deploy

1. Click "Deploy site"
2. Wait for the build to complete (usually 1-3 minutes)
3. Your site will be live at a random Netlify URL (e.g., `random-name-123456.netlify.app`)

#### 3.4 Custom Domain (Optional)

1. In Netlify dashboard, go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Follow instructions to configure DNS

### Option B: Netlify CLI

#### 3.1 Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 3.2 Login to Netlify

```bash
netlify login
```

This opens a browser window for authentication.

#### 3.3 Initialize Site

```bash
netlify init
```

Follow the prompts:
- Choose "Create & configure a new site"
- Select your team
- Choose a site name (or leave blank for random)
- Build command: `npm run build`
- Publish directory: `dist`

#### 3.4 Deploy

```bash
netlify deploy --prod
```

### Option C: GitHub Actions (Automated CI/CD)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automatic deployments.

#### 3.1 Get Netlify Credentials

1. In Netlify dashboard, go to "User settings" → "Applications"
2. Under "Personal access tokens", click "New access token"
3. Name it "GitHub Actions" and create
4. Copy the token (you won't see it again!)

5. In Netlify, go to your site → "Site settings" → "General"
6. Copy the "Site ID" (under "Site information")

#### 3.2 Add GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add two secrets:
   - Name: `NETLIFY_AUTH_TOKEN`, Value: (your Netlify token)
   - Name: `NETLIFY_SITE_ID`, Value: (your site ID)

#### 3.3 Automatic Deployments

Now, every push to `main` branch will trigger automatic deployment!

```bash
git add .
git commit -m "Update application"
git push
```

## Step 4: Verify Deployment

### 4.1 Test the Application

1. Visit your Netlify URL
2. Test all features:
   - Upload sample data
   - Navigate through all phases
   - Run a simulation
   - View results

### 4.2 Check Build Logs

If deployment fails:
1. In Netlify dashboard, go to "Deploys"
2. Click on the failed deploy
3. Review the build logs for errors

## Step 5: Post-Deployment Configuration

### 5.1 Environment Variables (if needed)

If you add API keys or environment variables:

1. In Netlify dashboard, go to "Site settings" → "Environment variables"
2. Add your variables
3. Redeploy the site

### 5.2 Custom Redirects

The `netlify.toml` file already includes:
- API redirects (for future backend integration)
- SPA fallback to `index.html`

### 5.3 HTTPS

Netlify automatically provides HTTPS for all sites. No configuration needed!

## Common Issues and Solutions

### Build Fails with "Command not found"

**Solution**: Ensure `package.json` has the correct build script:
```json
"scripts": {
  "build": "vite build"
}
```

### "Page Not Found" on Refresh

**Solution**: The `netlify.toml` redirect is already configured. If issues persist, verify the file exists in the repository root.

### Slow Build Times

**Solution**: 
- Enable build caching in Netlify settings
- Ensure `node_modules` is in `.gitignore`

### CSS Not Loading

**Solution**: 
- Check that `postcss.config.js` and `tailwind.config.js` are in the repository
- Verify build logs show PostCSS processing

## Updating Your Deployment

### For Manual Deployments

```bash
git add .
git commit -m "Description of changes"
git push
```

Then in Netlify:
1. Go to "Deploys"
2. Click "Trigger deploy" → "Deploy site"

### For Automatic Deployments (GitHub Actions)

Just push to main:
```bash
git add .
git commit -m "Description of changes"
git push
```

Deployment happens automatically!

## Monitoring and Analytics

### Netlify Analytics

1. In Netlify dashboard, go to "Analytics"
2. Enable Netlify Analytics (paid feature)
3. View traffic, performance, and errors

### Free Alternatives

- Google Analytics
- Plausible Analytics
- Simple Analytics

Add tracking code to `index.html` if needed.

## Rollback to Previous Version

If a deployment breaks something:

1. In Netlify dashboard, go to "Deploys"
2. Find a working deployment
3. Click "..." → "Publish deploy"

## Performance Optimization

### Already Implemented

- ✅ Vite for fast builds
- ✅ Code splitting
- ✅ Asset optimization
- ✅ TailwindCSS purging

### Additional Optimizations

1. **Enable Netlify Asset Optimization**
   - Go to "Site settings" → "Build & deploy" → "Post processing"
   - Enable "Bundle CSS" and "Minify JS"

2. **Add Caching Headers** (in `netlify.toml`):
   ```toml
   [[headers]]
     for = "/assets/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   ```

## Security Best Practices

1. **Never commit sensitive data**
   - API keys go in environment variables
   - Use `.gitignore` for sensitive files

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

3. **Enable Netlify security headers** (already in `netlify.toml`)

## Support and Resources

- **Netlify Documentation**: https://docs.netlify.com
- **Netlify Community**: https://answers.netlify.com
- **GitHub Issues**: Create issues in your repository
- **Vite Documentation**: https://vitejs.dev

## Checklist

Before deploying, ensure:

- [ ] All files are committed to Git
- [ ] `.gitignore` excludes `node_modules` and `dist`
- [ ] `package.json` has correct build script
- [ ] `netlify.toml` is in repository root
- [ ] Application builds successfully locally (`npm run build`)
- [ ] GitHub repository is created and pushed
- [ ] Netlify account is set up
- [ ] Build settings are configured
- [ ] Site is deployed and accessible
- [ ] All features work on deployed site

## Next Steps

After successful deployment:

1. Share your site URL
2. Gather user feedback
3. Monitor performance
4. Plan feature enhancements
5. Keep dependencies updated

---

**Congratulations! Your Monte Carlo Analysis Portal is now live! 🎉**
