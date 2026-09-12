import Market from '../models/market.model.js';
import User from '../models/user.model.js';
import { getUpcomingMidnight } from '../utils/dateUtils.js';

/**
 * Event-aware post-generation validator.
 * Validates AI output against current runtime date, historical product launches,
 * past events, and logical consistency.
 * 
 * @param {Object} market - Market draft proposal
 * @param {string} marketType - 'Short-Term' | 'Long-Term'
 * @returns {boolean} True if market is valid and fresh, false if stale/invalid.
 */
/**
 * Event-aware post-generation validator.
 * Generic validation against current runtime date, past years, historical phrasing,
 * and logical date consistency without hardcoded keyword blacklists.
 * 
 * @param {Object} market - Market draft proposal
 * @param {string} marketType - 'Short-Term' | 'Long-Term'
 * @returns {boolean} True if market is valid and fresh, false if stale/invalid.
 */
export const validateGeneratedMarket = (market, marketType) => {
  if (!market || !market.title || typeof market.title !== 'string') {
    return false;
  }

  const titleLower = market.title.trim().toLowerCase();
  const descLower = (market.description || '').toLowerCase();
  const combinedText = `${titleLower} ${descLower}`;

  // 1. Must be a clear prediction question starting with 'Will', 'Is', 'Can', 'Should', or 'Would'
  const validStarts = ['will', 'is', 'can', 'should', 'would'];
  const hasValidStart = validStarts.some(start => titleLower.startsWith(start));
  if (!hasValidStart) {
    console.warn(`[Validation Rejected] Title does not start with a valid prediction query: "${market.title}"`);
    return false;
  }

  // 2. Reject historical past-tense phrasing indicating past/completed events
  const pastPhrases = ['was announced', 'was released', 'was launched', 'occurred in', 'happened in', 'launched in 20'];
  for (const phrase of pastPhrases) {
    if (combinedText.includes(phrase)) {
      console.warn(`[Validation Rejected] Historical past-tense phrase detected ("${phrase}") in: "${market.title}"`);
      return false;
    }
  }

  // 3. Generic Year Check: Reject any past 4-digit years prior to current runtime year
  const currentYear = new Date().getUTCFullYear();
  const yearMatches = combinedText.match(/\b(20[0-9]{2})\b/g);
  if (yearMatches) {
    for (const yStr of yearMatches) {
      const y = parseInt(yStr, 10);
      if (y < currentYear) {
        console.warn(`[Validation Rejected] Past year reference (${y} < ${currentYear}) detected in: "${market.title}"`);
        return false;
      }
    }
  }

  // 4. Expiration date check: resolutionDate must be a valid Date strictly in the future
  const resDate = market.resolutionDate instanceof Date 
    ? market.resolutionDate 
    : new Date(market.resolutionDate || market.resolutionDateISO);

  if (!resDate || isNaN(resDate.getTime())) {
    console.warn(`[Validation Rejected] Invalid or missing resolutionDate in: "${market.title}"`);
    return false;
  }

  if (resDate.getTime() <= Date.now()) {
    console.warn(`[Validation Rejected] Resolution date is in past/now for: "${market.title}"`);
    return false;
  }

  return true;
};

/**
 * Token-overlap deduplication helper to prevent near-duplicate questions.
 * 
 * @param {string} newTitle 
 * @param {Array<Object>} existingMarkets 
 * @returns {boolean} True if a duplicate or near-duplicate market exists.
 */
export const isDuplicateMarket = (newTitle, existingMarkets) => {
  const normalize = (str) =>
    str.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2 && !['will', 'that', 'this', 'with', 'from', 'today'].includes(t));

  const newTokens = new Set(normalize(newTitle));
  if (newTokens.size === 0) return false;

  for (const m of existingMarkets) {
    const existingTokens = normalize(m.title);
    let overlapCount = 0;
    for (const token of existingTokens) {
      if (newTokens.has(token)) {
        overlapCount++;
      }
    }
    const similarity = overlapCount / Math.max(newTokens.size, existingTokens.length);
    if (similarity >= 0.65) {
      console.warn(`[Deduplication Rejected] High similarity (${(similarity * 100).toFixed(0)}%) between "${newTitle}" and existing "${m.title}"`);
      return true;
    }
  }

  return false;
};

/**
 * AI-powered automated market generation service.
 * Grounded dynamically in runtime Date and strict event-aware validation.
 * Long-Term resolution dates are event-driven from AI output.
 * Does NOT generate fake fallback data on API failure.
 * 
 * @param {string} marketType - 'Short-Term' | 'Long-Term'
 * @returns {Promise<Array>} Array of inserted Market documents
 */
export const generateMarketsSuggestions = async (marketType) => {
  try {
    const admin = (process.env.SEED_ADMIN_EMAIL ? await User.findOne({ email: process.env.SEED_ADMIN_EMAIL }) : null) || await User.findOne({ role: 'Admin' });
    if (!admin) {
      console.warn('⚠️ No Admin user found to assign as creator of AI markets.');
      return [];
    }

    const apiKey = marketType === 'Long-Term'
      ? process.env.LONG_TERM_MARKET_API_KEY
      : (process.env.SHORT_TERM_MARKET_API_KEY || process.env.SHORT_TREM_MARKET_API_KEY);

    if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      console.warn(`⚠️ Groq API key missing or placeholder for ${marketType}. Skipping market generation.`);
      return [];
    }

    const currentDate = new Date();
    const currentDateISO = currentDate.toISOString();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
    const currentDay = currentDate.getUTCDate();

    console.log(`📡 Fetching AI ${marketType} market suggestions from Groq (Grounded: ${currentMonth} ${currentDay}, ${currentYear})...`);

    const prompt = `
You are an expert prediction exchange analyst generating real-world binary prediction contracts.
Current Runtime Date: ${currentDateISO} (Day: ${currentDay}, Month: ${currentMonth}, Year: ${currentYear}).

Generate exactly two realistic, high-quality, real-world prediction market proposals for category '${marketType}'.

STRICT COMPLIANCE RULES:
- Ground questions strictly in current or future real-world events occurring after ${currentMonth} ${currentDay}, ${currentYear}.
- NEVER generate questions for historical product launches or milestones that already occurred prior to ${currentYear}.
- Ensure the outcome is verifiable from reputable news sources (e.g. Reuters, Bloomberg, SEC, official announcements).
- Avoid vague, untestable, or subjective claims.
- For Short-Term (${marketType}): Focus on events, corporate announcements, daily asset closes, or immediate technology releases that resolve today by midnight UTC.
- For Long-Term (${marketType}): Focus on major industry milestones, regulatory decisions, space missions, or next-generation tech releases resolving in future months/years (${currentYear+1}-${currentYear+2}). Provide an explicit, accurate ISO-8601 resolutionDateISO matching the question condition.

Return ONLY a valid JSON object matching this schema:
{
  "markets": [
    {
      "title": "Clear binary prediction question starting with 'Will'",
      "description": "Exact verification criteria and source specification for resolving YES or NO.",
      "category": "One of: 'Artificial Intelligence', 'Technology', 'Finance', 'Sports', 'Politics'",
      "resolutionDateISO": "An explicit ISO-8601 UTC date string (e.g. '2026-12-31T23:59:59.000Z') representing the exact event resolution condition date."
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
          { role: 'system', content: 'You are a professional JSON-only API. You output raw parseable JSON objects without markdown fences.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Groq API returned HTTP ${response.status}: ${errBody}`);
    }

    const resJson = await response.json();
    const content = resJson?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty message content received from Groq.');
    }

    const parsed = JSON.parse(content);
    if (!parsed.markets || !Array.isArray(parsed.markets)) {
      throw new Error('Parsed response missing "markets" array.');
    }

    // Fetch existing active markets to check for deduplication
    const existingActiveMarkets = await Market.find({ status: { $in: ['Live', 'Pending Approval'] } }).select('title');

    const validProposals = [];

    for (const m of parsed.markets) {
      let resDate = null;
      if (marketType === 'Short-Term') {
        // Short-Term: Expire at the upcoming 11:59:59.999 PM in Wagr application timezone
        resDate = getUpcomingMidnight(currentDate);
      } else {
        // Long-Term: Event-driven resolution date from AI proposal
        if (m.resolutionDateISO) {
          const parsedAiDate = new Date(m.resolutionDateISO);
          if (!isNaN(parsedAiDate.getTime()) && parsedAiDate > currentDate) {
            resDate = parsedAiDate;
          }
        }
      }

      // If Long-Term market date is missing, invalid, or in the past, reject proposal
      if (!resDate || resDate.getTime() <= currentDate.getTime()) {
        console.warn(`[Validation Rejected] Event-driven resolutionDate for Long-Term market "${m.title}" is invalid or in the past: ${m.resolutionDateISO}`);
        continue;
      }

      const candidate = {
        title: m.title ? m.title.trim() : '',
        description: m.description ? m.description.trim() : '',
        category: m.category || 'Technology',
        marketType,
        status: 'Pending Approval',
        resolutionDate: resDate,
        createdBy: admin._id,
      };

      // 1. Freshness & Validity check
      if (!validateGeneratedMarket(candidate, marketType)) {
        continue;
      }

      // 2. Semantic & Token Deduplication check
      if (isDuplicateMarket(candidate.title, existingActiveMarkets)) {
        continue;
      }

      validProposals.push(candidate);
    }

    if (validProposals.length === 0) {
      console.warn(`[AI Generation] All ${marketType} proposals failed validation or were duplicates.`);
      return [];
    }

    const inserted = await insertMarketsSafely(validProposals);
    return inserted;
  } catch (error) {
    console.error(`❌ AI ${marketType} market generation failed:`, error.message);
    // Controlled failure state: DO NOT generate fake fallback markets.
    return [];
  }
};

/**
 * Safely inserts generated markets into database, ensuring no duplicate title exists
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
  console.log(`🤖 Successfully saved ${created.length} fresh ${markets[0]?.marketType} markets.`);
  return created;
};

/**
 * Generates standard high-quality Short-Term daily markets for today's trading session
 * resolving at 11:00 PM IST today.
 * 
 * @param {ObjectId} adminId 
 * @returns {Array<Object>}
 */
export const getFallbackShortTermMarkets = (adminId) => {
  const resolutionDate = getUpcomingMidnight();
  return [
    {
      title: 'Will the S&P 500 close green today?',
      description: 'Resolves to YES if the S&P 500 Index closes higher than yesterday\'s close today. Resolves at 11:00 PM IST today.',
      category: 'Finance',
      marketType: 'Short-Term',
      status: 'Live',
      yesProbability: 51,
      noProbability: 49,
      volume: 32400,
      resolutionDate,
      createdBy: adminId,
      participants: [],
      probabilityHistory: [
        { yesProbability: 50, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { yesProbability: 51, timestamp: new Date() }
      ]
    },
    {
      title: 'Will Google announce a new Gemini update today?',
      description: 'Resolves to YES if Google officially announces or releases an update to the Gemini model family today.',
      category: 'Artificial Intelligence',
      marketType: 'Short-Term',
      status: 'Live',
      yesProbability: 45,
      noProbability: 55,
      volume: 18900,
      resolutionDate,
      createdBy: adminId,
      participants: [],
      probabilityHistory: [
        { yesProbability: 48, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { yesProbability: 45, timestamp: new Date() }
      ]
    },
    {
      title: 'Will NVIDIA stock close above $135 today?',
      description: 'Resolves to YES if NVIDIA common stock closes above $135 in normal Nasdaq trading hours today.',
      category: 'Finance',
      marketType: 'Short-Term',
      status: 'Live',
      yesProbability: 55,
      noProbability: 45,
      volume: 45000,
      resolutionDate,
      createdBy: adminId,
      participants: [],
      probabilityHistory: [
        { yesProbability: 50, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { yesProbability: 55, timestamp: new Date() }
      ]
    },
    {
      title: 'Will Bitcoin close above $120,000 today?',
      description: 'Resolves to YES if the index price of Bitcoin closes above $120,000 at 23:59 UTC today on global feeds.',
      category: 'Finance',
      marketType: 'Short-Term',
      status: 'Live',
      yesProbability: 40,
      noProbability: 60,
      volume: 89000,
      resolutionDate,
      createdBy: adminId,
      participants: [],
      probabilityHistory: [
        { yesProbability: 42, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { yesProbability: 40, timestamp: new Date() }
      ]
    }
  ];
};
