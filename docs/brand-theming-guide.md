# Brand Theming Integration Guide

## Overview

The CompanyHeader component now supports dynamic brand theming using Brand.dev API data. The component displays company logos and applies brand colors throughout the UI while maintaining a professional fintech aesthetic and WCAG 2.1 AA accessibility standards.

## Updated Component Features

### 1. Logo Display
- **Real Logo**: Displays company logo from `brandAssets.logoUrl` (48x64px, rounded corners)
- **Fallback**: Gradient icon using brand color if logo is unavailable
- **Error Handling**: Automatic fallback to icon if image fails to load
- **Accessibility**: Includes proper `alt` text for screen readers

### 2. Dynamic Brand Colors
The component uses `brandAssets.primaryColor` for:
- Logo border (2px accent border)
- Logo background (5% opacity)
- Industry badge background (10% opacity) with colored text
- Icon backgrounds in stats section (10% opacity)
- Icon colors throughout the component
- Gradient backgrounds for fallback logo

### 3. Professional Aesthetic Principles
- **Subtle Application**: Brand colors at 5-10% opacity for backgrounds
- **High Contrast**: Maintains WCAG AA standards (4.5:1 minimum)
- **Consistent Styling**: Unified application across all accent elements
- **Minimalist Design**: Avoids overwhelming the interface

## TypeScript Interface Updates

### BrandAssets Interface
```typescript
export interface BrandAssets {
  logoUrl?: string;              // URL to company logo
  primaryColor?: string;          // Hex color (e.g., "#543cfc")
  secondaryColors?: string[];     // Array of hex colors
  brandDescription?: string;      // Brand positioning text
  confidence?: number;            // 0-100 confidence score
  dataSource?: string;            // "brand.dev"
}
```

### Updated CompanyOverviewData
```typescript
export interface CompanyOverviewData {
  name: string;
  founded: string;
  headquarters: string;
  industry: string;
  business_model: string;
  description: string;
  valuation?: {
    value: number;
    currency: string;
    date: string;
  };
  last_updated?: string;
  brandAssets?: BrandAssets;  // ← New optional field
}
```

## Usage Example

### With Brand Assets
```typescript
import { CompanyHeader } from '@/components/CompanyHeader';

const companyData = {
  name: "Stripe",
  founded: "2010",
  headquarters: "San Francisco, CA",
  industry: "Fintech",
  business_model: "Payment Processing Platform",
  description: "Stripe builds economic infrastructure for the internet...",
  valuation: {
    value: 95000000000,
    currency: "USD",
    date: "2023-03-14"
  },
  last_updated: "2026-02-12",
  brandAssets: {
    logoUrl: "https://logo.clearbit.com/stripe.com",
    primaryColor: "#635bff",
    secondaryColors: ["#0a2540", "#00d4ff"],
    brandDescription: "Modern payment infrastructure",
    confidence: 100,
    dataSource: "brand.dev"
  }
};

<CompanyHeader data={companyData} />
```

### Without Brand Assets (Fallback)
```typescript
const companyData = {
  name: "Acme Corp",
  founded: "2020",
  headquarters: "Austin, TX",
  industry: "SaaS",
  business_model: "B2B Enterprise Software",
  description: "Enterprise workflow automation platform...",
  last_updated: "2026-02-12"
  // No brandAssets provided
};

<CompanyHeader data={companyData} />
```

**Result**: Component uses default blue (#3B82F6) and displays gradient Building icon.

## Key Implementation Details

### Color Conversion Utility
The component includes a `hexToRgba()` utility function:
```typescript
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
```

**Usage:**
- `hexToRgba(primaryColor, 0.05)` → 5% opacity background for logo container
- `hexToRgba(primaryColor, 0.1)` → 10% opacity for badges and icon backgrounds
- `hexToRgba(primaryColor, 0.7)` → 70% opacity for gradient fallback

### Logo Rendering Logic
```typescript
const hasLogo = brandAssets?.logoUrl && brandAssets.logoUrl.trim() !== '';

{hasLogo ? (
  <div style={{ borderColor: primaryColor, backgroundColor: hexToRgba(primaryColor, 0.05) }}>
    <img src={brandAssets.logoUrl} alt={`${data.name} logo`} />
  </div>
) : (
  <div style={{ background: `linear-gradient(135deg, ${primaryColor}, ${hexToRgba(primaryColor, 0.7)})` }}>
    <Building2 className="w-8 h-8 text-white" />
  </div>
)}
```

### Error Handling
The `<img>` element includes an `onError` handler that:
1. Hides the failed image
2. Replaces with an SVG icon colored with the brand's primary color
3. Maintains the visual hierarchy and spacing

## Design System Integration

### Color Application Matrix

| Element | Background Opacity | Text/Icon Color | Purpose |
|---------|-------------------|-----------------|---------|
| Logo Container | 5% | Border: 100% | Subtle highlight without overwhelming |
| Industry Badge | 10% | 100% | Clear category identification |
| Stat Icons | 10% | 100% | Visual consistency across metrics |
| Fallback Logo | Gradient | White text | High contrast for readability |

### Accessibility Compliance

**WCAG 2.1 AA Standards Met:**
- ✓ Minimum 4.5:1 contrast ratio for text
- ✓ Alt text for images
- ✓ Semantic HTML structure
- ✓ Color not sole indicator of information
- ✓ Keyboard navigable (via parent components)

**Testing Recommendations:**
```bash
# Test contrast ratios
npm run test:a11y

# Manual testing
# 1. Test with screen reader (NVDA/JAWS)
# 2. Test with high contrast mode
# 3. Test with colorblind simulation tools
```

## Data Flow

### From Business Intelligence Analyst to UI

1. **API Call**: Business Intelligence Analyst fetches company data
2. **Brand.dev Integration**: Analyst calls `https://api.brand.dev/v1/brand/retrieve?domain={domain}`
3. **Schema Mapping**: Brand data mapped to `brandAssets` schema
4. **Response Structure**:
```json
{
  "company_overview": { ... },
  "financial_kpis": { ... },
  "brandAssets": {
    "logoUrl": "https://...",
    "primaryColor": "#635bff",
    "secondaryColors": ["#0a2540", "#00d4ff"],
    "brandDescription": "Modern payment infrastructure",
    "confidence": 100,
    "dataSource": "brand.dev"
  }
}
```
5. **UI Rendering**: CompanyHeader component receives full data object and applies theming

## Best Practices

### ✓ Do:
- Use brand colors at low opacity (5-15%) for backgrounds
- Always provide fallback to default blue (#3B82F6)
- Test contrast ratios for all color combinations
- Include alt text for logos
- Use the hexToRgba utility for consistent opacity application

### ✗ Don't:
- Use brand colors at full opacity for large background areas
- Skip accessibility testing
- Assume logo URLs are always valid
- Hard-code brand colors in multiple places
- Override semantic HTML for styling convenience

## Performance Considerations

### Image Loading
- Logos are lazy-loaded by browser default
- Error handling prevents broken image icons
- Small image size (64x64px max) ensures fast loading

### Inline Styles vs. CSS Classes
**Why inline styles for brand colors?**
- Dynamic values from API (not known at build time)
- Component-level scope prevents global style pollution
- Eliminates need for CSS-in-JS library overhead
- Direct DOM manipulation for error fallback

## Future Enhancements

### Potential Additions
1. **Secondary Color Usage**: Apply secondary colors to charts/graphs
2. **Dark Mode**: Adjust opacity/brightness for dark backgrounds
3. **Brand Font**: Integrate custom typography from Brand.dev
4. **Animated Logo**: Support for animated SVG logos
5. **Brand Pattern**: Background patterns/textures from brand assets

### API Extensions
If Brand.dev adds more fields:
```typescript
export interface BrandAssets {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColors?: string[];
  brandDescription?: string;
  confidence?: number;
  dataSource?: string;
  // Future fields:
  fontFamily?: string;           // Custom brand font
  logoVariants?: {               // Multiple logo versions
    dark?: string;
    light?: string;
    icon?: string;
  };
  brandPatterns?: string[];      // Background patterns
  colorPalette?: {               // Extended color system
    neutral: string[];
    accent: string[];
  };
}
```

## Troubleshooting

### Logo Not Displaying
1. **Check URL validity**: Open `brandAssets.logoUrl` in browser
2. **CORS issues**: Verify logo domain allows cross-origin requests
3. **Fallback triggered**: Check browser console for image load errors
4. **Invalid data**: Ensure `logoUrl` is a string and not empty

### Colors Not Applying
1. **Hex format**: Verify `primaryColor` matches pattern `^#[0-9A-Fa-f]{6}$`
2. **Missing data**: Check if `brandAssets` is undefined
3. **Default blue**: Component falls back to `#3B82F6` if brand color missing

### Accessibility Warnings
1. **Contrast ratio**: Use WebAIM contrast checker for color combinations
2. **Alt text**: Ensure logo alt text is descriptive, not generic
3. **Icon labels**: Add ARIA labels if icons convey unique information

## Related Components

These components should also integrate brand theming:
- [ ] **KPICard**: Use brand color for trend indicators and sparklines
- [ ] **RevenueTrendChart**: Apply primary color to chart lines
- [ ] **ProjectionsChart**: Use color palette for confidence intervals
- [ ] **CompetitiveTable**: Highlight company row with brand color
- [ ] **DataQuality**: Use brand color for confidence badges

## Resources

- **Brand.dev API**: https://api.brand.dev/docs
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colorblind Simulator**: https://www.color-blindness.com/coblis-color-blindness-simulator/

---

**Last Updated**: February 12, 2026  
**Component Version**: 2.0.0  
**Maintainer**: Enterprise UI/UX Design Specialist
