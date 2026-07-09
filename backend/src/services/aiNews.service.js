import Market from '../models/market.model.js';
import News from '../models/news.model.js';
import User from '../models/user.model.js';
import { createAndSendNotification } from './notification.service.js';

/**
 * Generate mock news fallback in case Groq call fails or key is missing
 */
const generateMockNewsFallback = (markets) => {
  console.log('⚠️ Using mock fallback news generator.');
  const sources = ['Bloomberg', 'TechCrunch', 'Reuters', 'ESPN', 'Wired', 'Financial Times', 'ESPN Sports', 'BBC Global'];
  const categories = ['Artificial Intelligence', 'Technology', 'Finance', 'Sports', 'Politics'];
  
  return markets.map((market, index) => {
    const marketId = market._id.toString();
    const cleanTitle = market.title.replace(/Will |Is |Are |Would |Should /g, '').replace(/\?/g, '');
    
    const headlines = [
      `Significant development reported on ${cleanTitle}`,
      `New regulation might impact progress on ${cleanTitle}`,
      `Major industry consensus emerges regarding ${cleanTitle}`,
      `Experts debate feasibility and timeline of ${cleanTitle}`
    ];
    
    const randomHeadline = headlines[index % headlines.length];
    const mockUrl = `https://wagr.io/news/mock/${marketId}-${index}-${Date.now()}`;

    return {
      headline: randomHeadline,
      summary: `Industry reports and internal sources indicate active updates surrounding ${market.title}. Stakeholders are closely monitoring key indicators as resolution dates approach.`,
      source: sources[index % sources.length],
      url: mockUrl,
      category: market.category || categories[index % categories.length],
      relatedMarket: market._id,
      publishedDate: new Date(),
      aiSummary: `AI Forecast: Developments surrounding this contract suggest shifting probabilities. Traders are advised to verify latest reports before placing orders.`
    };
  });
};

/**
 * Sync AI News via Groq API
 */
export const syncAiNewsFromGroq = async () => {
  try {
    // 1. Fetch active live markets
    const liveMarkets = await Market.find({ status: 'Live' })
      .select('_id title description category')
      .limit(10); // Sync up to 10 markets

    if (liveMarkets.length === 0) {
      console.log('No active live markets found. Skipping AI news generation.');
      return [];
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      // Fallback
      const fallbackArticles = generateMockNewsFallback(liveMarkets);
      const inserted = await insertNewsSafely(fallbackArticles);
      return inserted;
    }

    // 2. Build Groq prompt
    const marketsDataString = liveMarkets.map((m) => {
      return `Market ID: ${m._id}\nTitle: "${m.title}"\nDescription: "${m.description}"\nCategory: "${m.category}"`;
    }).join('\n---\n');

    const prompt = `
You are an expert news editor and prediction analyst for a forecasting exchange.
For each of the following active prediction markets, generate exactly one highly realistic and contextualized news article briefing that would directly impact its forecasting probability.

Active Markets:
${marketsDataString}

You MUST return exactly a valid JSON object matching this schema, with no additional markdown fences, conversational greetings, or trailing texts. Output ONLY valid JSON:
{
  "articles": [
    {
      "headline": "A realistic, punchy, news headline related to the market theme",
      "summary": "A concise paragraph (2-3 sentences) describing the news development.",
      "source": "A trusted source name like TechCrunch, Reuters, Bloomberg, or ESPN",
      "url": "A unique, realistic mock URL starting with https://",
      "category": "The exact category of the market (must be one of: 'Artificial Intelligence', 'Technology', 'Finance', 'Sports', 'Politics')",
      "relatedMarketId": "The corresponding Market ID string from above",
      "aiSummary": "AI Sentiment Analysis: A 1-2 sentence summary explaining how this news impacts the market probabilities (e.g. 'Positive progress increases the likelihood of a YES outcome.')"
    }
  ]
}
`;

    // 3. Make Groq Chat Completion API Call
    console.log('📡 Fetching AI news briefs from Groq API...');
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
              content: 'You are a professional API service that outputs raw JSON objects. You must never output markdown formatting, code fences, or headers. Only return valid parseable JSON.'
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

    // 4. Map back to database documents
    const mappedArticles = parsedData.articles.map((art) => ({
      headline: art.headline,
      summary: art.summary,
      source: art.source,
      url: art.url || `https://wagr.io/news/ai/${art.relatedMarketId}-${Date.now()}`,
      category: art.category,
      relatedMarket: art.relatedMarketId,
      publishedDate: new Date(),
      aiSummary: art.aiSummary
    }));

    // 5. Insert to Database
    const inserted = await insertNewsSafely(mappedArticles);
    return inserted;
  } catch (error) {
    console.error('❌ Groq news generation failed:', error.message);
    // Fallback
    try {
      const liveMarkets = await Market.find({ status: 'Live' }).select('_id title description category');
      const fallbackArticles = generateMockNewsFallback(liveMarkets);
      return await insertNewsSafely(fallbackArticles);
    } catch (fallbackError) {
      console.error('❌ Seeding fallback articles failed:', fallbackError.message);
      return [];
    }
  }
};

/**
 * Inserts list of news articles safely, checking for duplicates by URL
 */
const insertNewsSafely = async (articles) => {
  const insertedArticles = [];
  
  for (const article of articles) {
    try {
      // Check if duplicate url already exists
      const existing = await News.findOne({ url: article.url });
      if (!existing) {
        const created = await News.create(article);
        insertedArticles.push(created);

        // Notify users who follow this market
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
      // Ignore validation errors (e.g. duplicate key index)
      console.warn(`Duplicate or invalid article URL skipped: ${article.url}`);
    }
  }
  
  console.log(`📰 Dynamic AI News Sync completed: saved ${insertedArticles.length} new articles.`);
  return insertedArticles;
};

