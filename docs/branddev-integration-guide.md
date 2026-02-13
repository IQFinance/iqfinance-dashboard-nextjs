# Brand.dev API Integration Guide

## Overview

The Brand.dev integration automatically enriches company intelligence reports with branding assets including logos, brand colors, descriptions, and industry tags. This enables the dashboard to display company logos and use authentic brand colors for visual theming.

## Integration Architecture

### Data Flow
```
Company Analysis Request
    ↓
Extract Company Domain (from name or URL)
    ↓
Call Brand.dev API
    ↓
Normalize Response Data
    ↓
Add brandAssets to Intelligence Report
    ↓
Return Enriched Report
```

## API Details

**Endpoint:** `https://api.brand.dev/v1/brand/retrieve?domain={domain}`

**Authentication:** Bearer token in Authorization header
```
Authorization: Bearer brand_275f0313c59a437687cfcc4fffbc19ee
```

**Response Structure:**
```json
{
  "status": "ok",
  "brand": {
    "domain": "stripe.com",
    "title": "Stripe",
    "description": "Company description...",
    "slogan": "Company slogan...",
    "colors": [
      {"hex": "#543cfc", "name": "Meteor Shower"},
      {"hex": "#a494fc", "name": "Cobalite"}
    ],
    "logos": [
      {
        "url": "https://media.brand.dev/...",
        "type": "icon",
        "mode": "light"
      }
    ],
    "industries": {
      "eic": [
        {"industry": "Finance", "subindustry": "Payments"}
      ]
    }
  }
}
```

## Usage

### Python Integration

```python
from branddev_integration import BrandDevClient

# Initialize client
client = BrandDevClient()

# Method 1: Fetch brand assets directly
brand_assets = client.fetch_brand_assets("stripe.com")
print(f"Logo: {brand_assets['logoUrl']}")
print(f"Primary Color: {brand_assets['primaryColor']}")
print(f"Confidence: {brand_assets['confidence']}/100")

# Method 2: Enrich existing company intelligence data
company_data = {
    "company_overview": {
        "name": "Stripe",
        "founded": "2010",
        "headquarters": "San Francisco, CA"
    },
    "financial_kpis": {...}
}

enriched_data = client.enrich_company_intelligence(
    company_data,
    company_name="Stripe",
    website_url="https://stripe.com"
)

# Access brand assets
brand = enriched_data["brandAssets"]
print(f"Logo: {brand['logoUrl']}")
print(f"Colors: {brand['primaryColor']}, {brand['secondaryColors']}")
```

### Convenience Function

```python
from branddev_integration import fetch_brand_assets

# Quick brand asset lookup
assets = fetch_brand_assets("Stripe", "https://stripe.com")
```

## Output Schema

The `brandAssets` section added to company intelligence reports:

```json
{
  "brandAssets": {
    "logoUrl": "https://media.brand.dev/dc0c027f-4ae0-4cce-9580-033e331126f3.svg",
    "primaryColor": "#543cfc",
    "secondaryColors": ["#a494fc", "#0c2444"],
    "brandDescription": "Stripe is a company that provides programmable...",
    "dataSource": "brand.dev",
    "confidence": 100,
    "domain": "stripe.com",
    "industryTags": [
      "Finance - Payments & Money Movement",
      "Finance - Financial Infrastructure & APIs",
      "Technology - Fintech Infrastructure"
    ],
    "companyName": "Stripe",
    "slogan": "Empowering internet businesses with seamless payments..."
  }
}
```

## Confidence Scoring

The integration calculates a confidence score (0-100) based on data completeness:

- **Logo present:** +40 points
- **Colors present:** +30 points
- **Brand description:** +20 points
- **Industry tags:** +10 points

**Confidence Levels:**
- **90-100:** Excellent data quality, all fields populated
- **70-89:** Good data quality, most fields present
- **50-69:** Moderate data quality, partial information
- **0-49:** Low confidence, minimal or no data

## Error Handling

### Brand Not Found (404)
```json
{
  "error": "Brand not found",
  "domain": "example.com",
  "confidence": 0
}
```

### API Error
```json
{
  "error": "API error: 500",
  "domain": "example.com",
  "confidence": 0
}
```

### Network Error
```json
{
  "error": "Request failed: Connection timeout",
  "domain": "example.com",
  "confidence": 0
}
```

## Domain Extraction

The integration automatically extracts domains from:

1. **Full URLs:** `https://stripe.com/about` → `stripe.com`
2. **Company names:** `Stripe, Inc.` → `stripe.com` (fallback)

Domain extraction removes:
- Protocol (https://, http://)
- www. prefix
- Corporate suffixes (Inc., LLC, Corp., Ltd.)
- Non-alphanumeric characters

## Integration into Analysis Workflow

### Step 1: Extract Company Domain
When starting a company analysis, extract the domain from the search query or company website URL.

### Step 2: Call Brand.dev API
Make the API call early in the analysis process, ideally after identifying the company but before generating the final report.

### Step 3: Add to Report
Include the `brandAssets` section in the final JSON output alongside existing sections like `company_overview`, `financial_kpis`, etc.

### Example Workflow

```python
def analyze_company(company_name, website_url=None):
    # Step 1: Gather financial data
    financial_data = gather_financial_kpis(company_name)
    
    # Step 2: Analyze competitive landscape
    competitive_data = analyze_competitors(company_name)
    
    # Step 3: Fetch brand assets
    brand_client = BrandDevClient()
    enriched_report = brand_client.enrich_company_intelligence(
        {
            "company_overview": {...},
            "financial_kpis": financial_data,
            "competitive_landscape": competitive_data,
            ...
        },
        company_name=company_name,
        website_url=website_url
    )
    
    return enriched_report
```

## Dashboard Integration

The enriched company intelligence data can be used in the dashboard:

### Display Company Logo
```typescript
import { CompanyHeader } from '@/components/CompanyHeader';

<CompanyHeader
  companyName={report.company_overview.name}
  logoUrl={report.brandAssets?.logoUrl}
  industry={report.company_overview.industry}
  founded={report.company_overview.founded}
/>
```

### Apply Brand Colors
```typescript
// Use primary color for headers, buttons, accents
const primaryColor = report.brandAssets?.primaryColor || '#543cfc';

// Use secondary colors for gradients, charts
const secondaryColors = report.brandAssets?.secondaryColors || [];
```

### Theme Generation
```typescript
// Generate dynamic theme from brand colors
const theme = {
  primary: report.brandAssets?.primaryColor,
  secondary: report.brandAssets?.secondaryColors?.[0],
  accent: report.brandAssets?.secondaryColors?.[1],
};
```

## Best Practices

1. **Call Early:** Fetch brand assets early in the analysis to avoid delays in final report generation

2. **Cache Results:** Consider caching brand assets by domain to reduce API calls for repeated analyses

3. **Fallback Gracefully:** Always handle missing brand data gracefully with fallback colors/placeholders

4. **Confidence Checking:** Check confidence scores before using brand data in critical UI elements

5. **Error Logging:** Log API errors for monitoring and debugging, but don't fail the entire analysis

## Testing

Test the integration with various companies:

```python
# Test with well-known company (should return high confidence)
assets = fetch_brand_assets("Stripe", "https://stripe.com")
assert assets["confidence"] >= 90

# Test with unknown domain (should handle gracefully)
assets = fetch_brand_assets("Unknown Company", "https://unknowncompany123.com")
assert "error" in assets or assets["confidence"] == 0

# Test domain extraction
client = BrandDevClient()
domain = client.extract_domain("Acme Corp.", "https://www.acme.com/about")
assert domain == "acme.com"
```

## API Rate Limits

Brand.dev API rate limits (if applicable):
- Monitor response headers for rate limit information
- Implement exponential backoff for 429 responses
- Consider request queuing for bulk analyses

## Future Enhancements

Potential improvements to the integration:

1. **Caching Layer:** Redis/memory cache for frequently analyzed companies
2. **Fallback Sources:** Clearbit, Brandfetch APIs as alternatives
3. **Logo Size Selection:** Choose optimal logo resolution for display context
4. **Color Accessibility:** Calculate WCAG-compliant color pairs
5. **Brand Consistency Scoring:** Compare extracted brand colors against official guidelines
