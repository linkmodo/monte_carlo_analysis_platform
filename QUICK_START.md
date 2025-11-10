# Quick Start Guide

Get your Monte Carlo Analysis Portal running in 5 minutes!

## 🚀 Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to: `http://localhost:3000`

## 🎯 Try the Demo

1. Click **"Load Sample Sales Data"** button
2. Click **"Continue to Analysis"** (preprocessing step)
3. Select **"Sales"** as target variable
4. Check **"Marketing"** and **"Temperature"** as input variables
5. Click **"Configure Model"**
6. Click **"Run Monte Carlo Simulation"**
7. View your results!

## 📦 Deploy to Netlify

### Quick Deploy (3 steps)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Click "Deploy site"

Done! Your site is live! 🎉

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Check code quality
```

## 📚 Next Steps

- Read the full [README.md](README.md)
- Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions
- Customize the application for your needs

## ❓ Need Help?

- Check the README for detailed documentation
- Review sample dataset in `sample_data.csv`
- Open an issue on GitHub

---

**Happy analyzing! 📊**
