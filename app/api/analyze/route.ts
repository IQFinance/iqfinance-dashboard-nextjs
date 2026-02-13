import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 60;

interface AnalyzeRequest {
  domain: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: 'Company domain is required' },
        { status: 400 }
      );
    }

    // Delegate to Business Intelligence Analyst agent via Nebula
    const NEBULA_API_KEY = process.env.NEBULA_API_KEY;
    if (!NEBULA_API_KEY) {
      return NextResponse.json(
        { error: 'Nebula API key not configured' },
        { status: 500 }
      );
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Construct the agent delegation request
    const agentTask = `Analyze the company at domain "${cleanDomain}" and generate a comprehensive business intelligence report.

Extract and structure the following data:

1. Company Overview
   - Full company name
   - Year founded
   - Headquarters location
   - Industry/sector
   - Business model description
   - Company description (2-3 sentences)
   - Valuation (if available)

2. Top 10 Financial KPIs
   For each KPI provide:
   - Current value with units/currency
   - YoY growth percentage
   - Trend (increasing/stable/decreasing)
   - Data source
   - Confidence score (0-1)
   
   Prioritize these KPIs if available:
   - Total Payment Volume / Annual Revenue
   - Enterprise Adoption Rate
   - AI Sector Penetration
   - ARR (Annual Recurring Revenue)
   - Take Rate / Commission Rate
   - Customer Revenue Impact
   - Time to Revenue Acceleration
   - Active Subscriptions / Customer Count
   - R&D Investment Rate
   - Gross/Net Profit Margin

3. Growth Metrics
   - Revenue CAGR (3-year)
   - Payment Volume CAGR (3-year)
   - Customer Growth Rate
   - Market Expansion Rate
   - Profitability Trend (improving/stable/declining)
   - Efficiency Trend description

4. Financial Projections (1-2 year outlook)
   For revenue and payment volume forecasts:
   - Low estimate, base estimate, high estimate
   - Growth rate ranges
   - Confidence intervals
   - Methodology notes

5. Competitive Landscape
   - Market position description
   - Market share percentage (if known)
   - 3-5 direct competitors
   - 3-5 competitive advantages
   - 2-3 strategic risks
   - Recent strategic moves (acquisitions, partnerships, funding rounds)

6. Data Quality Metadata
   - Overall confidence score (0-1)
   - List of data sources used
   - Estimation methods applied
   - Last verified date

Return the data as structured JSON matching the company intelligence schema. All numerical KPIs must include values, trends, sources, and confidence scores. If data is unavailable for a field, use reasonable estimates based on industry benchmarks and clearly note the estimation method.`;

    const response = await fetch('https://api.nebula.gg/v1/delegate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEBULA_API_KEY}`,
      },
      body: JSON.stringify({
        agent_slug: 'business-intelligence-analyst',
        task: agentTask,
        timeout: 50000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Nebula delegation error:', error);
      return NextResponse.json(
        { error: 'Failed to analyze company', details: error },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // The Business Intelligence Analyst should return structured JSON in result.data
    // that matches the company intelligence schema
    const intelligenceData = result.data || result;

    return NextResponse.json(intelligenceData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });

  } catch (error) {
    console.error('Error analyzing company:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze company',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Company Intelligence API',
    endpoints: {
      analyze: {
        method: 'POST',
        body: { domain: 'string (required)' },
        description: 'Analyze a company and return structured intelligence data'
      }
    }
  });
}
