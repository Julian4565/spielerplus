// Use env variable or fallback to the provided Native Stats API key
const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || '8e347984230f458d9513410c6fb7f06b';
const BASE_URL = 'https://native-stats.org/v4';
const BAYERN_ID = 5;

if (!API_KEY) {
  console.error('[FootballAPI] CRITICAL: API_KEY is not defined!');
} else {
  console.log('[FootballAPI] Initialized with key:', `${API_KEY.slice(0, 4)}...${API_KEY.slice(-4)}`);
}

// Simple in-memory cache to avoid rate limits
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function fetchWithCache(endpoint: string) {
  const now = Date.now();
  const cached = cache.get(endpoint);
  
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    console.log(`[FootballAPI] Returning cached data for ${endpoint}`);
    return cached.data;
  }

  if (!API_KEY) {
    console.error('[FootballAPI] No API key found in environment variables!');
    throw new Error('API Key missing');
  }

  console.log(`[FootballAPI] Fetching ${endpoint}...`);
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    if (!response.ok) {
      console.error(`[FootballAPI] Error ${response.status} for ${endpoint}`);
      if (response.status === 429) {
        console.warn('Football API rate limit reached. Using stale cache or empty data.');
        return cached?.data || null;
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[FootballAPI] Successfully fetched ${endpoint}`);
    cache.set(endpoint, { data, timestamp: now });
    return data;
  } catch (err) {
    console.error(`[FootballAPI] Fetch failed for ${endpoint}:`, err);
    throw err;
  }
}

export const footballApi = {
  getBayernFixtures: async () => {
    return fetchWithCache(`/teams/${BAYERN_ID}/matches?status=SCHEDULED`);
  },
  
  getBayernResults: async () => {
    return fetchWithCache(`/teams/${BAYERN_ID}/matches?status=FINISHED&limit=10`);
  },
  
  getBundesligaStandings: async () => {
    return fetchWithCache('/competitions/BL1/standings');
  },
  
  getCLStandings: async () => {
    return fetchWithCache('/competitions/CL/standings');
  },
  
  getLiveMatches: async () => {
    // Only available in paid tier usually, but we can try
    return fetchWithCache('/matches?status=LIVE');
  },
  
  getCompetitionMatches: async (competitionCode: string) => {
    return fetchWithCache(`/competitions/${competitionCode}/matches?status=SCHEDULED&limit=20`);
  },
  
  getBayernSquad: async () => {
    return fetchWithCache(`/teams/${BAYERN_ID}`);
  }
};
