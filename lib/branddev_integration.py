"""
Brand.dev API Integration for Company Intelligence Analysis

This module fetches company branding assets (logo, colors, brand description)
from Brand.dev API and integrates them into the company intelligence workflow.

API Endpoint: https://api.brand.dev/v1/brand/retrieve?domain={company_domain}
Authentication: Bearer token in Authorization header
"""

import requests
from typing import Dict, Optional, Any
from urllib.parse import urlparse
import re


class BrandDevClient:
    """Client for fetching brand assets from Brand.dev API"""
    
    BASE_URL = "https://api.brand.dev/v1/brand/retrieve"
    API_KEY = "brand_275f0313c59a437687cfcc4fffbc19ee"
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Brand.dev client with API key"""
        self.api_key = api_key or self.API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def extract_domain(self, company_name: str, website_url: Optional[str] = None) -> Optional[str]:
        """
        Extract domain from company name or website URL
        
        Args:
            company_name: Company name (e.g., "Stripe")
            website_url: Optional website URL
            
        Returns:
            Domain string (e.g., "stripe.com") or None
        """
        if website_url:
            parsed = urlparse(website_url)
            domain = parsed.netloc or parsed.path
            # Remove www. prefix
            domain = re.sub(r'^www\.', '', domain)
            return domain
        
        # Fallback: convert company name to likely domain
        # Remove common suffixes and convert to lowercase
        clean_name = re.sub(r'\s+(Inc\.|LLC|Corp\.|Corporation|Ltd\.?|Limited)$', '', company_name, flags=re.IGNORECASE)
        clean_name = clean_name.strip().lower()
        clean_name = re.sub(r'[^a-z0-9]+', '', clean_name)
        return f"{clean_name}.com"
    
    def fetch_brand_assets(self, domain: str) -> Dict[str, Any]:
        """
        Fetch brand assets from Brand.dev API
        
        Args:
            domain: Company domain (e.g., "stripe.com")
            
        Returns:
            Dictionary with brand assets or error information
        """
        try:
            response = requests.get(
                self.BASE_URL,
                params={"domain": domain},
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return self._normalize_brand_data(data, domain)
            elif response.status_code == 404:
                return {
                    "error": "Brand not found",
                    "domain": domain,
                    "confidence": 0
                }
            else:
                return {
                    "error": f"API error: {response.status_code}",
                    "domain": domain,
                    "confidence": 0
                }
                
        except requests.exceptions.RequestException as e:
            return {
                "error": f"Request failed: {str(e)}",
                "domain": domain,
                "confidence": 0
            }
    
    def _normalize_brand_data(self, raw_data: Dict, domain: str) -> Dict[str, Any]:
        """
        Normalize Brand.dev API response to match our schema
        
        Args:
            raw_data: Raw API response (contains 'status', 'brand', 'code')
            domain: Company domain
            
        Returns:
            Normalized brand assets dictionary
        """
        # Extract brand data from response
        brand = raw_data.get("brand", {})
        
        # Extract colors array (list of color objects with 'hex' and 'name')
        colors_list = brand.get("colors", [])
        color_hexes = [c.get("hex") for c in colors_list if c.get("hex")]
        primary_color = color_hexes[0] if color_hexes else None
        secondary_colors = color_hexes[1:] if len(color_hexes) > 1 else []
        
        # Extract logo URL (prefer SVG logo type, fallback to first logo)
        logos = brand.get("logos", [])
        logo_url = None
        if logos:
            # Try to find SVG logo first
            svg_logo = next((l for l in logos if l.get("url", "").endswith(".svg")), None)
            logo_url = svg_logo.get("url") if svg_logo else logos[0].get("url")
        
        # Extract industry tags
        industries = brand.get("industries", {}).get("eic", [])
        industry_tags = [f"{i.get('industry')} - {i.get('subindustry')}" for i in industries if i.get("industry")]
        
        # Calculate confidence score based on data completeness
        confidence = self._calculate_confidence(brand)
        
        return {
            "logoUrl": logo_url,
            "primaryColor": primary_color,
            "secondaryColors": secondary_colors,
            "brandDescription": brand.get("description"),
            "dataSource": "brand.dev",
            "confidence": confidence,
            "domain": domain,
            "industryTags": industry_tags,
            "companyName": brand.get("title"),
            "slogan": brand.get("slogan")
        }
    
    def _calculate_confidence(self, brand_data: Dict) -> int:
        """
        Calculate confidence score (0-100) based on data completeness
        
        Args:
            brand_data: Brand data dictionary from API response
            
        Returns:
            Confidence score as integer (0-100)
        """
        score = 0
        
        # Logo present: +40 points
        logos = brand_data.get("logos", [])
        if logos and len(logos) > 0:
            score += 40
        
        # Colors present: +30 points
        colors = brand_data.get("colors", [])
        if colors and len(colors) > 0:
            score += 30
        
        # Brand description: +20 points
        if brand_data.get("description"):
            score += 20
        
        # Industry tags: +10 points
        industries = brand_data.get("industries", {}).get("eic", [])
        if industries and len(industries) > 0:
            score += 10
        
        return score
    
    def enrich_company_intelligence(self, 
                                   company_data: Dict[str, Any],
                                   company_name: str,
                                   website_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Enrich company intelligence data with brand assets
        
        Args:
            company_data: Existing company intelligence dictionary
            company_name: Company name
            website_url: Optional company website URL
            
        Returns:
            Company data enriched with brandAssets section
        """
        domain = self.extract_domain(company_name, website_url)
        
        if not domain:
            # Add empty brand assets with error
            company_data["brandAssets"] = {
                "error": "Could not determine company domain",
                "confidence": 0
            }
            return company_data
        
        # Fetch brand assets
        brand_assets = self.fetch_brand_assets(domain)
        
        # Add to company data
        company_data["brandAssets"] = brand_assets
        
        return company_data


# Convenience function for direct usage
def fetch_brand_assets(company_name: str, website_url: Optional[str] = None) -> Dict[str, Any]:
    """
    Fetch brand assets for a company
    
    Args:
        company_name: Company name (e.g., "Stripe")
        website_url: Optional website URL
        
    Returns:
        Brand assets dictionary
    
    Example:
        >>> assets = fetch_brand_assets("Stripe", "https://stripe.com")
        >>> print(assets["primaryColor"])
        '#543cfc'
    """
    client = BrandDevClient()
    domain = client.extract_domain(company_name, website_url)
    return client.fetch_brand_assets(domain)


# Example usage and testing
if __name__ == "__main__":
    # Test with Stripe
    print("Testing Brand.dev API integration with Stripe...")
    client = BrandDevClient()
    
    # Test domain extraction
    domain = client.extract_domain("Stripe, Inc.", "https://stripe.com")
    print(f"Extracted domain: {domain}")
    
    # Fetch brand assets
    assets = client.fetch_brand_assets(domain)
    print(f"\nBrand Assets:")
    print(f"  Logo URL: {assets.get('logoUrl')}")
    print(f"  Primary Color: {assets.get('primaryColor')}")
    print(f"  Secondary Colors: {assets.get('secondaryColors')}")
    print(f"  Confidence: {assets.get('confidence')}/100")
    print(f"  Brand Description: {assets.get('brandDescription', 'N/A')[:100]}...")
    
    # Test enrichment workflow
    print("\n\nTesting enrichment workflow...")
    sample_company_data = {
        "company_overview": {
            "name": "Stripe",
            "founded": "2010",
            "headquarters": "San Francisco, CA"
        }
    }
    
    enriched = client.enrich_company_intelligence(
        sample_company_data,
        "Stripe",
        "https://stripe.com"
    )
    
    print(f"Enriched data includes brandAssets: {'brandAssets' in enriched}")
    if 'brandAssets' in enriched:
        print(f"  Primary color: {enriched['brandAssets'].get('primaryColor')}")
        print(f"  Confidence: {enriched['brandAssets'].get('confidence')}/100")
