import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Company domain is required' },
        { status: 400 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    const prompt = `Analyze the company at domain: ${cleanDomain}

Provide a comprehensive company intelligence report with:

1. COMPANY OVERVIEW
- Full company name
- Industry/sector
- Founding year
- Headquarters location
- Company size (estimated employees)

2. BUSINESS MODEL
- Primary products/services
- Revenue model
- Target market
- Key value propositions

3. MARKET POSITION
- Market share estimate
- Main competitors
- Competitive advantages
- Industry trends affecting them

4. TECHNOLOGY STACK
- Known technologies used
- Platform architecture
- Tech partnerships

5. RECENT DEVELOPMENTS
- Recent news or milestones
- Product launches
- Funding rounds
- Strategic moves

6. FINANCIAL INDICATORS
- Revenue estimates (if public)
- Growth trajectory
- Funding history
- Valuation estimates

7. INTELLIGENCE GRADE
Give an overall intelligence grade (A+ to F) based on:
- Market position strength
- Growth potential
- Innovation level
- Competitive moat
- Financial health

Format your response as a structured analysis with clear sections. Be specific and data-driven where possible.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'https://dashboard.iqfinance.ai',
        'X-Title': 'IQ Finance Company Intelligence',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to analyze company', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || 'No analysis generated';

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      analysis,
      timestamp: new Date().toISOString(),
      model: 'anthropic/claude-3.5-sonnet',
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST method with { "domain": "example.com" }' },
    { status: 405 }
  );
}