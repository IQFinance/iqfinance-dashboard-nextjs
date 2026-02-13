# IQFinance Dashboard - Vercel Deployment Guide

Complete step-by-step guide to deploy your Next.js financial dashboard to Vercel with custom domain configuration.

---

## 🚀 Quick Deploy (Recommended)

Click the button below to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IQFinance/iqfinance-dashboard-nextjs&env=OPENROUTER_API_KEY,SITE_URL&envDescription=Required%20environment%20variables%20for%20IQFinance%20Dashboard&envLink=https://github.com/IQFinance/iqfinance-dashboard-nextjs#environment-variables&project-name=iqfinance-dashboard&repository-name=iqfinance-dashboard-nextjs)

**What this does:**
1. Clones your repository to Vercel
2. Prompts for required environment variables
3. Builds and deploys automatically
4. Provides a preview URL immediately

---

## 📋 Manual Deployment Steps

### Step 1: Connect GitHub to Vercel

1. Go to [https://vercel.com/login](https://vercel.com/login)
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Grant permissions to the `IQFinance` organization

### Step 2: Import the Repository

1. From your Vercel dashboard, click **"Add New..."** → **"Project"**
2. In the "Import Git Repository" section:
   - Search for `iqfinance-dashboard-nextjs`
   - Or paste the URL: `https://github.com/IQFinance/iqfinance-dashboard-nextjs`
3. Click **"Import"**

### Step 3: Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Root Directory:** `.` (leave as root)

### Step 4: Add Environment Variables

Before deploying, add these required environment variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `OPENROUTER_API_KEY` | `sk-or-...` | Your OpenRouter API key for AI analysis |
| `SITE_URL` | `https://dashboard.iqfinance.ai` | Your custom domain URL |

**How to add:**
1. In the "Configure Project" section, scroll to **"Environment Variables"**
2. Click **"Add"** for each variable
3. Select which environments (Production, Preview, Development)
   - **Production:** ✅ Required
   - **Preview:** ✅ Recommended
   - **Development:** ⬜ Optional

**Get your API keys:**
- **OPENROUTER_API_KEY:** [https://openrouter.ai/keys](https://openrouter.ai/keys)
  - Sign up or log in
  - Navigate to "API Keys"
  - Create new key
  - Copy the key (starts with `sk-or-`)

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run build (`npm run build`)
   - Deploy to production
3. Wait 2-3 minutes for the build to complete

**Deployment URL:**
- Automatic: `https://iqfinance-dashboard-nextjs-<random>.vercel.app`
- You'll customize this in the next step

---

## 🌐 Custom Domain Configuration

### Step 1: Add Domain in Vercel

1. Go to your project dashboard in Vercel
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter: `dashboard.iqfinance.ai`
5. Click **"Add"**

### Step 2: Configure DNS Records

Vercel will show you one of these options:

#### Option A: CNAME Record (Recommended)

If you manage DNS through a provider that supports CNAME for subdomains:

```
Type:  CNAME
Name:  dashboard
Value: cname.vercel-dns.com
TTL:   3600 (or default)
```

**Provider-Specific Instructions:**

**Cloudflare:**
1. Log in to Cloudflare
2. Select `iqfinance.ai` domain
3. Go to **DNS** → **Records**
4. Click **"Add record"**
5. Type: `CNAME`, Name: `dashboard`, Target: `cname.vercel-dns.com`
6. Proxy status: ⚠️ **DNS only (click the orange cloud to turn it gray)**
7. Click **"Save"**

**Namecheap:**
1. Log in to Namecheap
2. Go to **Domain List** → Select `iqfinance.ai`
3. Click **"Manage"** → **"Advanced DNS"**
4. Add new record:
   - Type: `CNAME Record`
   - Host: `dashboard`
   - Value: `cname.vercel-dns.com`
   - TTL: `Automatic`
5. Click **"Save"**

**GoDaddy:**
1. Log in to GoDaddy
2. Go to **My Products** → **DNS**
3. Click **"Add"** under DNS Records
4. Type: `CNAME`, Name: `dashboard`, Value: `cname.vercel-dns.com`
5. TTL: `1 Hour`
6. Click **"Save"**

#### Option B: A Record

If CNAME is not available:

```
Type:  A
Name:  dashboard
Value: 76.76.21.21  (Vercel's IP - check Vercel dashboard for current IP)
TTL:   3600
```

### Step 3: Verify Domain

1. Back in Vercel, click **"Verify"**
2. Vercel checks DNS records automatically
3. DNS propagation can take **5-60 minutes**
4. Once verified, SSL certificate is issued automatically (via Let's Encrypt)

**Check propagation status:**
```bash
# Check CNAME record
dig dashboard.iqfinance.ai CNAME

# Check A record
dig dashboard.iqfinance.ai A
```

Or use online tools:
- [https://dnschecker.org](https://dnschecker.org)
- [https://www.whatsmydns.net](https://www.whatsmydns.net)

### Step 4: Set as Primary Domain (Optional)

1. In Vercel → **Settings** → **Domains**
2. Find `dashboard.iqfinance.ai`
3. Click **"⋯"** (three dots) → **"Set as Primary Domain"**
4. This redirects all other domains (like `*.vercel.app`) to your custom domain

---

## 🔧 Environment Variables Management

### Update Variables After Deployment

1. Go to **Settings** → **Environment Variables**
2. Find the variable you want to update
3. Click **"Edit"** or **"⋯"** → **"Edit"**
4. Update the value
5. Click **"Save"**
6. **Important:** Click **"Redeploy"** to apply changes

### Add New Variables

1. Go to **Settings** → **Environment Variables**
2. Click **"Add"**
3. Enter key and value
4. Select environments (Production/Preview/Development)
5. Click **"Save"**
6. Redeploy if needed

---

## 🔄 Continuous Deployment

### Automatic Deployments

Once connected, Vercel automatically deploys:

- **Production:** Every push to `main` branch
- **Preview:** Every push to feature branches or pull requests

### Manual Redeployment

1. Go to **Deployments** tab
2. Find the deployment you want to redeploy
3. Click **"⋯"** → **"Redeploy"**
4. Confirm

### Rollback to Previous Version

1. Go to **Deployments** tab
2. Find the previous successful deployment
3. Click **"⋯"** → **"Promote to Production"**
4. Confirm rollback

---

## 🛠️ Troubleshooting

### Build Failures

#### Error: "Module not found"
**Cause:** Missing dependencies in `package.json`

**Solution:**
```bash
# Locally install missing packages
npm install <package-name>

# Commit and push
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push origin main
```

#### Error: "Environment variable not defined"
**Cause:** Missing required environment variables

**Solution:**
1. Go to **Settings** → **Environment Variables**
2. Add missing variables: `OPENROUTER_API_KEY`, `SITE_URL`
3. Click **"Redeploy"**

#### Error: "Build exceeded maximum duration"
**Cause:** Build takes too long (free tier: 45s limit per Serverless Function)

**Solution:**
1. Check if large dependencies can be optimized
2. Review `next.config.js` for unnecessary processing
3. Consider upgrading Vercel plan if needed

### DNS Configuration Issues

#### Domain not verifying
**Possible causes:**
- DNS changes haven't propagated (wait 5-60 minutes)
- Wrong DNS record type or value
- Cloudflare proxy enabled (must be "DNS only")

**Check DNS:**
```bash
dig dashboard.iqfinance.ai
```

**Solution:**
1. Verify DNS records match Vercel's instructions exactly
2. Wait for propagation
3. Use [https://dnschecker.org](https://dnschecker.org) to check global propagation

#### SSL Certificate not issuing
**Cause:** Domain not verified or DNS propagation incomplete

**Solution:**
1. Ensure domain is verified in Vercel
2. Wait for DNS propagation
3. Vercel auto-issues SSL via Let's Encrypt (can take 5-10 minutes)
4. Check **Settings** → **Domains** for SSL status

### Runtime Errors

#### Error: "Failed to fetch AI analysis"
**Cause:** Invalid or missing `OPENROUTER_API_KEY`

**Solution:**
1. Verify API key at [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Update in Vercel: **Settings** → **Environment Variables**
3. Click **"Redeploy"**

#### Error: "CORS policy blocked"
**Cause:** Missing or incorrect `SITE_URL` environment variable

**Solution:**
1. Set `SITE_URL=https://dashboard.iqfinance.ai`
2. Ensure no trailing slash
3. Redeploy

### Performance Issues

#### Slow initial load
**Expected behavior:** First load after deployment or inactivity may be slow (cold start)

**Optimizations:**
1. Enable **Edge Functions** (Vercel Settings → Functions)
2. Configure **ISR (Incremental Static Regeneration)** in Next.js
3. Add **caching headers** in `next.config.js`

#### High function execution time
**Solution:**
1. Monitor in **Analytics** → **Functions**
2. Optimize API calls (reduce data fetched, add pagination)
3. Consider upgrading Vercel plan for higher limits

---

## 📊 Monitoring & Analytics

### View Deployment Logs

1. Go to **Deployments** tab
2. Click on any deployment
3. Click **"Build Logs"** to see build output
4. Click **"Function Logs"** to see runtime logs

### Real-time Analytics

1. Go to **Analytics** tab (requires Pro plan)
2. View:
   - Page views
   - Visitors
   - Top pages
   - Performance metrics

### Function Metrics

1. Go to **Analytics** → **Functions**
2. Monitor:
   - Invocations
   - Execution duration
   - Errors
   - Cold starts

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ **Never commit** API keys to Git
- ✅ Use Vercel's environment variable system
- ✅ Rotate API keys regularly
- ✅ Set different keys for Production/Preview/Development

### API Keys

- ✅ Use `.env.example` to document required variables
- ✅ Keep production keys separate from development
- ✅ Monitor API usage at [https://openrouter.ai/usage](https://openrouter.ai/usage)
- ✅ Set up spending limits on OpenRouter

### Access Control

- ✅ Limit Vercel project access to team members only
- ✅ Use GitHub branch protection rules for `main`
- ✅ Require pull request reviews before merging
- ✅ Enable two-factor authentication (2FA) on Vercel and GitHub

---

## 📚 Additional Resources

### Vercel Documentation
- [Deploying Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Next.js Documentation
- [Deployment Guide](https://nextjs.org/docs/deployment)
- [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### DNS Providers
- [Cloudflare DNS Setup](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)
- [Namecheap DNS Setup](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
- [GoDaddy DNS Setup](https://www.godaddy.com/help/add-a-cname-record-19236)

---

## ✅ Deployment Checklist

Use this checklist to ensure everything is configured correctly:

### Pre-Deployment
- [ ] Repository `IQFinance/iqfinance-dashboard-nextjs` exists and is up-to-date
- [ ] All code changes committed and pushed to `main` branch
- [ ] OpenRouter API key obtained from [https://openrouter.ai/keys](https://openrouter.ai/keys)
- [ ] Custom domain (`dashboard.iqfinance.ai`) DNS access ready

### Vercel Setup
- [ ] GitHub account connected to Vercel
- [ ] Repository imported to Vercel
- [ ] Environment variables added:
  - [ ] `OPENROUTER_API_KEY`
  - [ ] `SITE_URL`
- [ ] Initial deployment successful
- [ ] Preview URL accessible (e.g., `https://iqfinance-dashboard-nextjs-abc123.vercel.app`)

### Custom Domain
- [ ] Domain `dashboard.iqfinance.ai` added in Vercel
- [ ] DNS record configured (CNAME to `cname.vercel-dns.com`)
- [ ] DNS propagation verified (use `dig` or [dnschecker.org](https://dnschecker.org))
- [ ] Domain verified in Vercel (green checkmark)
- [ ] SSL certificate issued (https:// working)
- [ ] Set as primary domain (optional)

### Testing
- [ ] Dashboard loads at `https://dashboard.iqfinance.ai`
- [ ] All pages render correctly
- [ ] AI analysis endpoint working (`/api/analyze`)
- [ ] No console errors in browser
- [ ] Mobile responsive design verified

### Post-Deployment
- [ ] Team notified of new deployment
- [ ] Deployment URL bookmarked
- [ ] Monitoring set up (if applicable)
- [ ] Documentation updated with production URL

---

## 🎉 Success!

Once all steps are complete, your IQFinance Dashboard will be live at:

**https://dashboard.iqfinance.ai**

**Next steps:**
1. Test all features thoroughly
2. Share with your team
3. Monitor analytics and logs
4. Set up alerts for deployment failures (Vercel integrations)

**Need help?**
- Vercel Support: [https://vercel.com/support](https://vercel.com/support)
- GitHub Issues: [https://github.com/IQFinance/iqfinance-dashboard-nextjs/issues](https://github.com/IQFinance/iqfinance-dashboard-nextjs/issues)

---

*Last updated: February 12, 2026*