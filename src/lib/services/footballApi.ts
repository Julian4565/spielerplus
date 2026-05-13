const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';
const BAYERN_ID = 5;

// Simple in-memory cache to avoid rate limits
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function fetchWithCache(endpoint: string) {
  const now = Date.now();
  const cached = cache.get(endpoint);
  
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });

  if (!response.ok) {
    if (response.status === 429) {
      console.warn('Football API rate limit reached. Using stale cache or empty data.');
      return cached?.data || null;
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(endpoint, { data, timestamp: now });
  return data;
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
  }
};
