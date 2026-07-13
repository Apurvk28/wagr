import Market from '../models/market.model.js';
import User from '../models/user.model.js';

// Fallback markets list if Groq API call fails or key is missing
const getMockLongTermSuggestions = (adminId) => {
  const topics = [
    {
      title: 'Will OpenAI release GPT-6 before 2027?',
      description: 'Resolves to YES if OpenAI officially announces and launches the GPT-6 model for public or API developer access before January 1, 2027.',
      category: 'Artificial Intelligence',
    },
    {
      title: 'Will Apple launch a commercial foldable iPhone in 2026?',
      description: 'Resolves to YES if Apple Inc. commercially releases a foldable display smartphone (commonly referred to as foldable iPhone) by December 31, 2026.',
      category: 'Technology',
    },
    {
      title: 'Will SpaceX land a human on Mars before 2030?',
      description: 'Resolves to YES if SpaceX successfully lands at least one human being on the surface of Mars by December 31, 2029.',
      category: 'Technology',
    },
    {
      title: 'Will the Federal Reserve cut interest rates below 3.0% in 2026?',
      description: 'Resolves to YES if the US Federal Reserve lowers the benchmark federal funds rate below 3.0% at any point during the calendar year 2026.',
      category: 'Finance',
    },
  ];

  return topics.map((t) => ({
    title: t.title,
    description: t.description,
    category: t.category,
    marketType: 'Long-Term',
    status: 'Pending Approval',
    resolutionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // ~6 months
    createdBy: adminId,
  }));
};

const getMockShortTermSuggestions = (adminId) => {
  const stockTickers = ['NVIDIA', 'Apple', 'Tesla', 'Microsoft', 'Google', 'Meta'];
  const ticker = stockTickers[Math.floor(Math.random() * stockTickers.length)];

  const topics = [
    {
      title: `Will ${ticker} stock finish green today?`,
      description: `Resolves to YES if the official closing price of ${ticker} common stock (NASDAQ) is higher than its previous trading day close.`,
      category: 'Finance',
    },
    {
      title: 'Will Bitcoin close above $115,000 today?',
      description: 'Resolves to YES if Bitcoin (BTC/USD) closing price is reported above $115,000 at 23:59 UTC today on Binance.',
      category: 'Finance',
    },
    {
      title: 'Will SpaceX successfully launch a Falcon 9 rocket today?',
      description: 'Resolves to YES if SpaceX successfully launches and completes first stage recovery of a Falcon 9 mission today.',
      category: 'Technology',
    },
    {
      title: 'Will OpenAI announce a new product update today?',
      description: 'Resolves to YES if OpenAI issues an official press release or conducts a product announcement today.',
      category: 'Artificial Intelligence',
    },
  ];

  // Pick 2 random topics for daily variety
  const shuffled = topics.sort(() => 0.5 - Math.random()).slice(0, 2);

  return shuffled.map((t) => ({
    title: t.title,
    description: t.description,
    category: t.category,
    marketType: 'Short-Term',
    status: 'Pending Approval',
    resolutionDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Exactly 24 hours
    createdBy: adminId,
  }));
};

/**
 * AI-powered automated market generation service.
 * Runs on cron schedules to draft new market suggestions for admin review.
 */
export const generateMarketsSuggestions = async (marketType) => {
  try {
    const admin = await User.findOne({ email: 'admin@wagr.io' }) || await User.findOne({ role: 'Admin' });
    if (!admin) {
      console.warn('⚠️ No Admin user found to assign as creator of AI markets.');
      return [];
    }

    // Load appropriate API Key based on market type
    const apiKey = marketType === 'Long-Term'
      ? process.env.LONG_TERM_MARKET_API_KEY
      : process.env.SHORT_TREM_MARKET_API_KEY;

    if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      const fallbackList = marketType === 'Long-Term' 
        ? getMockLongTermSuggestions(admin._id) 
        : getMockShortTermSuggestions(admin._id);
      
      const created = await insertMarketsSafely(fallbackList);
      return created;
    }

    // Call Groq API to generate fresh market drafts
    console.log(`📡 Fetching AI ${marketType} market suggestions from Groq using dedicated key...`);
    const prompt = `
You are an expert prediction analyst for a forecasting exchange.
Generate exactly two realistic, high-quality, real-world prediction market contract proposals for the category '${marketType}'.

CRITICAL QUALITY COMPLIANCE:
- The current year is 2026 (July). All generated questions must pertain to future, unresolved, real-world events occurring in late 2026, 2027, or 2028.
- NEVER generate questions for milestones that have already occurred (e.g. Do NOT generate questions about GPT-5 release as that already launched in 2025; instead forecast GPT-6 or Claude 4.5/5).
- Ensure the event is highly relevant to current public interest and has a verifiable resolution source.
- Avoid duplicate markets.
- For Long-Term: focus on major developments in AI, tech, finance, global affairs, or business (e.g. specific space flights, future CPU launches, election outcomes) resolving in months/years.
- For Short-Term: focus on daily financial indexes, corporate stock closing prices (e.g., Apple, NVIDIA, Tesla), major daily launches, or immediate breaking statements resolving in 24 hours.

Return exactly a JSON object matching this schema:
{
  "markets": [
    {
      "title": "A punchy, clear binary prediction question starting with 'Will'",
      "description": "Clear verification criteria, sources, and specifications for resolving the market.",
      "category": "One of: 'Artificial Intelligence', 'Technology', 'Finance', 'Sports', 'Politics'"
    }
  ]
}
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an API service returning only raw, valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error status: ${response.status}`);
    }

    const resJson = await response.json();
    const content = resJson?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    if (!parsed.markets || !Array.isArray(parsed.markets)) {
      throw new Error('Markets array missing in parsed response.');
    }

    const mapped = parsed.markets.map(m => ({
      title: m.title,
      description: m.description,
      category: m.category || 'Technology',
      marketType,
      status: 'Pending Approval',
      resolutionDate: marketType === 'Long-Term'
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days out
        : new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours out
      createdBy: admin._id
    }));

    return await insertMarketsSafely(mapped);
  } catch (error) {
    console.error('❌ AI market suggestions generation failed:', error.message);
    // Execute fallback
    const admin = await User.findOne({ email: 'admin@wagr.io' }) || await User.findOne({ role: 'Admin' });
    if (admin) {
      const fallbackList = marketType === 'Long-Term' 
        ? getMockLongTermSuggestions(admin._id) 
        : getMockShortTermSuggestions(admin._id);
      return await insertMarketsSafely(fallbackList);
    }
    return [];
  }
};

/**
 * Helper to write generated markets to DB, checking for duplicate titles first
 */
const insertMarketsSafely = async (markets) => {
  const created = [];
  for (const m of markets) {
    const exists = await Market.findOne({ title: m.title });
    if (!exists) {
      const inserted = await Market.create(m);
      created.push(inserted);
    }
  }
  console.log(`🤖 Generated ${created.length} new draft ${markets[0]?.marketType} markets.`);
  return created;
};
