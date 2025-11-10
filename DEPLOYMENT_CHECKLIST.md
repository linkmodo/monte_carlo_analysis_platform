# Deployment Checklist

Use this checklist to ensure a smooth deployment of your Monte Carlo Analysis Portal.

## Pre-Deployment Checklist

### 1. Local Testing
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Test all features locally:
  - [ ] Upload CSV file
  - [ ] Upload Excel file
  - [ ] Load sample data
  - [ ] Data preprocessing (all imputation methods)
  - [ ] EDA visualizations (all charts render)
  - [ ] Variable selection
  - [ ] Model configuration
  - [ ] Run simulation (10,000+ iterations)
  - [ ] View all result visualizations
  - [ ] Calculate custom threshold
  - [ ] Export results
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile device or responsive mode
- [ ] Check console for errors
- [ ] Verify no warnings in terminal

### 2. Build Verification
- [ ] Run production build: `npm run build`
- [ ] Build completes without errors
- [ ] Preview production build: `npm run preview`
- [ ] Test production build locally
- [ ] Check `dist` folder is created
- [ ] Verify file sizes are reasonable (<1MB total)

### 3. Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Fix any linting errors
- [ ] Remove console.log statements (except intentional ones)
- [ ] Remove commented-out code
- [ ] Check for TODO comments
- [ ] Verify all files have proper formatting

### 4. Documentation
- [ ] README.md is complete
- [ ] DEPLOYMENT_GUIDE.md is accurate
- [ ] QUICK_START.md is clear
- [ ] PROJECT_SUMMARY.md is up to date
- [ ] Code comments are helpful
- [ ] Sample data is included

### 5. Configuration Files
- [ ] `package.json` has correct name and version
- [ ] `netlify.toml` is in root directory
- [ ] `.gitignore` excludes node_modules and dist
- [ ] `.gitattributes` is configured
- [ ] `vite.config.js` is correct
- [ ] `tailwind.config.js` is configured
- [ ] `.eslintrc.cjs` is present

## Git & GitHub Setup

### 6. Git Repository
- [ ] Initialize git: `git init`
- [ ] Review `.gitignore`
- [ ] Stage all files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] Check git status is clean
- [ ] No sensitive data in repository

### 7. GitHub Repository
- [ ] Create repository on GitHub
- [ ] Repository name is descriptive
- [ ] Add repository description
- [ ] Choose visibility (Public/Private)
- [ ] Don't initialize with README (already have one)
- [ ] Copy repository URL

### 8. Push to GitHub
- [ ] Add remote: `git remote add origin <URL>`
- [ ] Verify remote: `git remote -v`
- [ ] Push to GitHub: `git push -u origin main`
- [ ] Verify files on GitHub
- [ ] Check README renders correctly
- [ ] Verify .gitignore is working (no node_modules)

## Netlify Deployment

### 9. Netlify Account Setup
- [ ] Create Netlify account (if needed)
- [ ] Verify email address
- [ ] Complete profile
- [ ] Choose free tier (or paid if needed)

### 10. Connect Repository
- [ ] Click "New site from Git"
- [ ] Choose GitHub
- [ ] Authorize Netlify
- [ ] Select repository
- [ ] Verify repository access

### 11. Build Settings
- [ ] Branch to deploy: `main`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Verify settings match `netlify.toml`
- [ ] No environment variables needed (initially)

### 12. Deploy Site
- [ ] Click "Deploy site"
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Build succeeds (green checkmark)
- [ ] Site is published

### 13. Verify Deployment
- [ ] Click on site URL
- [ ] Site loads correctly
- [ ] Test all features on deployed site:
  - [ ] Upload functionality
  - [ ] Sample data loads
  - [ ] All visualizations render
  - [ ] Simulation runs successfully
  - [ ] Results display correctly
  - [ ] Export works
- [ ] Test on mobile device
- [ ] Check different browsers
- [ ] Verify HTTPS is enabled

### 14. Site Configuration
- [ ] Site name is appropriate
- [ ] Custom domain (if applicable)
- [ ] DNS configured (if custom domain)
- [ ] SSL certificate active
- [ ] Redirects working (SPA fallback)

## Optional: GitHub Actions CI/CD

### 15. GitHub Actions Setup
- [ ] `.github/workflows/deploy.yml` exists
- [ ] Get Netlify auth token
- [ ] Get Netlify site ID
- [ ] Add `NETLIFY_AUTH_TOKEN` to GitHub secrets
- [ ] Add `NETLIFY_SITE_ID` to GitHub secrets
- [ ] Verify secrets are saved

### 16. Test Automatic Deployment
- [ ] Make a small change
- [ ] Commit and push
- [ ] Check GitHub Actions tab
- [ ] Workflow runs successfully
- [ ] Site updates automatically
- [ ] Verify changes on live site

## Post-Deployment

### 17. Performance Check
- [ ] Run Lighthouse audit
- [ ] Performance score >80
- [ ] Accessibility score >90
- [ ] Best Practices score >90
- [ ] SEO score >90
- [ ] Fix any critical issues

### 18. Monitoring Setup
- [ ] Enable Netlify Analytics (optional)
- [ ] Set up error tracking (optional)
- [ ] Configure uptime monitoring (optional)
- [ ] Add Google Analytics (optional)

### 19. Documentation Update
- [ ] Update README with live URL
- [ ] Add screenshots (optional)
- [ ] Update deployment guide if needed
- [ ] Document any custom configuration

### 20. Share & Announce
- [ ] Share site URL with stakeholders
- [ ] Add to portfolio
- [ ] Post on social media (optional)
- [ ] Add to GitHub profile README (optional)

## Maintenance

### 21. Regular Updates
- [ ] Check for dependency updates monthly
- [ ] Run `npm audit` for security issues
- [ ] Update packages: `npm update`
- [ ] Test after updates
- [ ] Monitor site performance
- [ ] Review error logs

### 22. Backup & Version Control
- [ ] Regular commits to GitHub
- [ ] Tag releases: `git tag v1.0.0`
- [ ] Keep local backup
- [ ] Document major changes
- [ ] Maintain changelog (optional)

## Troubleshooting

### Common Issues

**Build Fails**
- [ ] Check Node.js version (16+)
- [ ] Delete node_modules and reinstall
- [ ] Check build logs for specific errors
- [ ] Verify all dependencies in package.json

**Site Not Loading**
- [ ] Check Netlify deploy status
- [ ] Verify publish directory is `dist`
- [ ] Check for JavaScript errors in console
- [ ] Verify redirects in netlify.toml

**Features Not Working**
- [ ] Check browser console for errors
- [ ] Verify all files deployed correctly
- [ ] Test with sample data
- [ ] Check network tab for failed requests

**Slow Performance**
- [ ] Enable Netlify asset optimization
- [ ] Check bundle size
- [ ] Optimize images
- [ ] Review Lighthouse suggestions

## Success Criteria

Your deployment is successful when:
- ✅ Site is accessible via HTTPS
- ✅ All features work correctly
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Fast load times (<3 seconds)
- ✅ Automatic deployments working (if using GitHub Actions)
- ✅ Documentation is complete
- ✅ Stakeholders can access and use the site

## Final Notes

- Keep this checklist for future deployments
- Update as you add new features
- Share with team members
- Document any custom steps

---

**Congratulations on your deployment! 🎉**

*Last updated: [Current Date]*
