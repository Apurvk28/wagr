import Market from '../models/market.model.js';
import News from '../models/news.model.js';
import User from '../models/user.model.js';
import { createAndSendNotification } from './notification.service.js';

/**
 * Validates AI-generated news item against publication date, headline quality, and market validity.
 * 
 * @param {Object} article 
 * @returns {boolean}
 */
export const validateNewsArticle = async (article) => {
  if (!article || !article.headline || typeof article.headline !== 'string' || article.headline.trim().length < 5) {
    return false;
  }
  if (!article.summary || article.summary.trim().length < 10) {
    return false;
  }
  // Check publishedDate is not in the future
  if (article.publishedDate && article.publishedDate instanceof Date) {
    if (article.publishedDate.getTime() > Date.now() + 5 * 60 * 1000) { // allow 5 min clock skew
      console.warn(`[News Validation Rejected] Future publication date in article: "${article.headline}"`);
      return false;
    }
  }

  // Related market validation:
  // If relatedMarket exists, verify that the market is Live and resolutionDate is in the future.
  // If relatedMarket is null or undefined, allow as valid General News.
  if (article.relatedMarket) {
    try {
      const market = typeof article.relatedMarket === 'object' && article.relatedMarket._id
        ? article.relatedMarket
        : await Market.findById(article.relatedMarket);

      if (!market || market.status !== 'Live' || new Date(market.resolutionDate) <= new Date()) {
        console.warn(`[News Validation Rejected] Article linked to non-Live or expired market: "${article.headline}"`);
        return false;
      }
    } catch (err) {
      console.warn(`[News Validation Rejected] Market lookup failed for article: "${article.headline}"`);
      return false;
    }
  }

  return true;
};

/**
 * Generic helper to fetch news briefings from Groq Chat Completion API for specific markets list
 */
const fetchNewsFromGroq = async (markets, marketType, apiKey) => {
  if (markets.length === 0) return [];

  const currentDate = new Date();
  const currentDateISO = currentDate.toISOString();

  const marketsDataString = markets.map((m) => {
    return `Market ID: ${m._id}\nTitle: "${m.title}"\nDescription: "${m.description}"\nCategory: "${m.category}"`;
  }).join('\n---\n');

  const prompt = `
You are a professional financial and technology news editor for a prediction exchange.
Current Runtime Date: ${currentDateISO}.

For each of the following active ${marketType} prediction markets, generate exactly one highly realistic, news briefing that directly impacts its odds.

Active ${marketType} Markets:
${marketsDataString}

STRICT COMPLIANCE RULES:
- Use current real-world news context.
- Do NOT invent historical headlines from prior years.
- Do NOT set publication dates in the future.

Return ONLY a valid JSON object matching this schema:
{
  "articles": [
    {
      "headline": "A realistic, punchy headline related to the market topic",
      "summary": "Concise paragraph (2-3 sentences) summarizing recent news developments.",
      "source": "A trusted source like TechCrunch, Reuters, Bloomberg, Financial Times, or ESPN",
      "url": "A valid unique URL string starting with https://",
      "category": "The exact category of the market",
      "relatedMarketId": "The corresponding Market ID string from above",
      "aiSummary": "AI Probability Impact: 1-2 sentence analysis on market odds."
    }
  ]
}
`;

  console.log(`📡 Fetching AI ${marketType} news briefs using dedicated news API key...`);
  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a professional API service returning raw JSON objects only without markdown fences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
  }

  const responseData = await response.json();
  const jsonString = responseData?.choices?.[0]?.message?.content;
  if (!jsonString) {
    throw new Error('Empty response content received from Groq.');
  }

  const parsedData = JSON.parse(jsonString);
  if (!parsedData.articles || !Array.isArray(parsedData.articles)) {
    throw new Error('Invalid JSON format: articles array is missing.');
  }

  const validArticles = [];
  for (const art of parsedData.articles) {
    const candidate = {
      headline: art.headline ? art.headline.trim() : '',
      summary: art.summary ? art.summary.trim() : '',
      source: art.source || 'Wagr Intelligence',
      url: art.url || `https://wagr.io/news/ai/${art.relatedMarketId}-${Date.now()}`,
      category: art.category || 'Technology',
      relatedMarket: art.relatedMarketId || null,
      publishedDate: new Date(),
      aiSummary: art.aiSummary || 'AI Forecast: Probability shifts based on market sentiment.'
    };

    if (await validateNewsArticle(candidate)) {
      validArticles.push(candidate);
    }
  }

  return validArticles;
};

/**
 * Sync AI News via Groq API.
 * Uses dedicated API keys for short-term and long-term markets news.
 * Does NOT generate fake news fallback on API error.
 */
export const syncAiNewsFromGroq = async () => {
  let allInserted = [];

  // 1. Sync Short-Term Market-Related News
  try {
    const shortTermMarkets = await Market.find({ status: 'Live', marketType: 'Short-Term', resolutionDate: { $gt: new Date() } })
      .select('_id title description category')
      .limit(5);

    if (shortTermMarkets.length > 0) {
      const apiKey = process.env.SHORT_TERM_MARKET_NEWS_API_KEY;
      if (apiKey && !apiKey.startsWith('your_') && !apiKey.includes('placeholder')) {
        const articles = await fetchNewsFromGroq(shortTermMarkets, 'Short-Term', apiKey);
        const inserted = await insertNewsSafely(articles);
        allInserted = [...allInserted, ...inserted];
      } else {
        console.warn('⚠️ SHORT_TERM_MARKET_NEWS_API_KEY missing or placeholder. Skipping AI news sync.');
      }
    }
  } catch (error) {
    console.error('❌ Short-Term news sync failed:', error.message);
  }

  // 2. Sync Long-Term Market-Related News
  try {
    const longTermMarkets = await Market.find({ status: 'Live', marketType: 'Long-Term', resolutionDate: { $gt: new Date() } })
      .select('_id title description category')
      .limit(5);

    if (longTermMarkets.length > 0) {
      const apiKey = process.env.LONG_TERM_MARKET_NEWS_API_KEY;
      if (apiKey && !apiKey.startsWith('your_') && !apiKey.includes('placeholder')) {
        const articles = await fetchNewsFromGroq(longTermMarkets, 'Long-Term', apiKey);
        const inserted = await insertNewsSafely(articles);
        allInserted = [...allInserted, ...inserted];
      } else {
        console.warn('⚠️ LONG_TERM_MARKET_NEWS_API_KEY missing or placeholder. Skipping AI news sync.');
      }
    }
  } catch (error) {
    console.error('❌ Long-Term news sync failed:', error.message);
  }

  return allInserted;
};

/**
 * Inserts list of news articles safely, checking for duplicates by URL
 */
const insertNewsSafely = async (articles) => {
  const insertedArticles = [];

  for (const article of articles) {
    try {
      const existing = await News.findOne({ url: article.url });
      if (!existing) {
        const created = await News.create(article);
        insertedArticles.push(created);

        // Send notifications to users who follow this market
        if (article.relatedMarket) {
          const marketFollowers = await User.find({
            followedMarkets: article.relatedMarket,
          }).select('_id');

          const market = await Market.findById(article.relatedMarket).select('title');

          for (const follower of marketFollowers) {
            await createAndSendNotification({
              userId: follower._id,
              title: 'Market Update: New News',
              message: `New article published for a market you follow${market ? `: "${market.title}"` : ''}: ${article.headline}`,
              type: 'Followed Market Updated',
              redirectUrl: `/news`,
            });
          }
        }
      }
    } catch (err) {
      console.warn(`Duplicate or invalid article URL skipped: ${article.url}`);
    }
  }

  console.log(`📰 AI News Sync completed: saved ${insertedArticles.length} new articles.`);
  return insertedArticles;
};
