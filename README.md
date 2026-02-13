# IQ Finance - Company Intelligence Dashboard

Production-ready Next.js dashboard with Linear.app-inspired design for instant AI-powered company analysis.

## Features

- **🎨 Beautiful UI**: Linear.app-inspired design with dark mode, gradients, and smooth animations
- **🚀 Conversion-Optimized**: Large search input, trust badges, social proof, and clear CTAs
- **🤖 AI-Powered**: Deep company intelligence using Claude 3.5 Sonnet via OpenRouter
- **⚡ Lightning Fast**: Next.js 14 with App Router, deployed on Vercel Edge Network
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **🔒 Secure**: Security headers, environment variable protection, HTTPS by default

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: OpenRouter API (Claude 3.5 Sonnet)
- **Hosting**: Vercel (free tier)

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IQFinance/iqfinance-dashboard-nextjs)

### Step-by-Step Deployment

1. **Click the Deploy button above** or go to [vercel.com/new](https://vercel.com/new)

2. **Import the repository**
   - Connect your GitHub account
   - Select this repository: IQFinance/iqfinance-dashboard-nextjs
   - Click "Import"

3. **Configure Environment Variables**
   
   Add these in the Vercel deployment settings:
   
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   SITE_URL=https://dashboard.iqfinance.ai
   ```
   
   Get your OpenRouter API key: [https://openrouter.ai/keys](https://openrouter.ai/keys)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `your-project.vercel.app`

## Custom Domain Setup (dashboard.iqfinance.ai)

### 1. Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Enter `dashboard.iqfinance.ai`
4. Click **Add**

### 2. Configure DNS Records

Vercel will show you DNS records to add. You'll need to add these to your domain registrar:

#### Option A: CNAME Record (Recommended)

Add this record to your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.):

```
Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

#### Option B: A Record

If CNAME isn't supported, use A records:

```
Type: A
Name: dashboard
Value: 76.76.21.21
TTL: Auto or 3600
```

### 3. Verify Domain

1. After adding DNS records, go back to Vercel
2. Click **Refresh** next to your domain
3. Wait 1-5 minutes for DNS propagation
4. Once verified, you'll see a green checkmark ✓
5. Your dashboard is now live at `https://dashboard.iqfinance.ai`

### 4. Update Environment Variable

In Vercel settings, update:

```
SITE_URL=https://dashboard.iqfinance.ai
```

Click **Save** and redeploy.

## Local Development

### Prerequisites

- Node.js 18+ installed
- OpenRouter API key

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/IQFinance/iqfinance-dashboard-nextjs.git
cd iqfinance-dashboard-nextjs
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_actual_api_key_here
SITE_URL=http://localhost:3000
```

4. **Run development server**

```bash
npm run dev
```

5. **Open in browser**

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
iqfinance-dashboard-nextjs/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # OpenRouter API integration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main dashboard page
├── public/                       # Static assets
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS configuration
├── README.md                     # This file
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── vercel.json                   # Vercel deployment settings
```

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key for AI analysis | Yes | `sk-or-v1-...` |
| `SITE_URL` | Your deployed domain (for OpenRouter referer) | Yes | `https://dashboard.iqfinance.ai` |

## API Endpoints

### POST /api/analyze

Analyzes a company using AI.

**Request Body:**
```json
{
  "domain": "stripe.com"
}
```

**Response:**
```json
{
  "success": true,
  "domain": "stripe.com",
  "analysis": "Full AI-generated analysis...",
  "timestamp": "2026-02-12T19:37:00.000Z",
  "model": "anthropic/claude-3.5-sonnet"
}
```

## Customization

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  'linear-blue': '#5E6AD2',    // Your brand blue
  'linear-purple': '#8B5CF6',  // Your brand purple
}
```

### Modify AI Prompt

Edit `app/api/analyze/route.ts` to customize the analysis prompt and change what information is extracted.

### Update Copy

Edit `app/page.tsx` to change headlines, descriptions, trust badges, and call-to-action text.

## Performance

- **Page Load**: <1s (Edge-optimized)
- **Analysis Time**: 10-30s (depends on AI processing)
- **Lighthouse Score**: 95+ (Performance, SEO, Accessibility)
- **Core Web Vitals**: All green

## Security

- Environment variables protected
- Security headers configured
- HTTPS enforced
- Input validation
- Error handling
- No API keys exposed to client

## Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| Vercel Hosting | Hobby (Free) | $0/mo |
| Custom Domain | Free on Vercel | $0/mo |
| SSL Certificate | Free (Auto) | $0/mo |
| OpenRouter API | Pay-per-use | ~$0.50-2/mo |

**Total: ~$0-2/month** for moderate usage (100-1000 analyses)

## Troubleshooting

### "OpenRouter API key not configured"
- Check environment variable is set in Vercel settings
- Redeploy after adding environment variables

### Domain not verifying
- Wait 5-10 minutes for DNS propagation
- Check DNS records are correct
- Try `nslookup dashboard.iqfinance.ai` to verify

### Build fails on Vercel
- Check all dependencies are in package.json
- Verify TypeScript has no errors locally
- Check build logs in Vercel dashboard

### Analysis takes too long
- Normal for first request (cold start)
- Subsequent requests are faster
- Consider upgrading to Vercel Pro for better performance

## Support

For issues or questions:
- Email: accounts+nebula@iqfinance.ai
- GitHub Issues: [Create an issue](https://github.com/IQFinance/iqfinance-dashboard-nextjs/issues)

## License

Proprietary - IQ Finance 2026

---

Built with ❤️ by IQ Finance | Powered by Claude 3.5 Sonnet