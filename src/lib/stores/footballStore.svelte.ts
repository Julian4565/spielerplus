import { footballApi } from '$lib/services/footballApi';

// Store for real-time football data
export const footballData = $state({
  fixtures: [] as any[],
  results: [] as any[],
  standings: {
    bundesliga: null as any,
    cl: null as any
  },
  liveMatches: [] as any[],
  loading: false,
  error: null as string | null,
  lastUpdated: null as number | null
});

export async function refreshFootballData() {
  if (footballData.loading) return;
  
  footballData.loading = true;
  footballData.error = null;
  
  try {
    const [fixturesData, resultsData, blStandings, clStandings] = await Promise.all([
      footballApi.getBayernFixtures(),
      footballApi.getBayernResults(),
      footballApi.getBundesligaStandings(),
      footballApi.getCLStandings()
    ]);
    
    footballData.fixtures = fixturesData?.matches || [];
    footballData.results = resultsData?.matches || [];
    footballData.standings.bundesliga = blStandings;
    footballData.standings.cl = clStandings;
    footballData.lastUpdated = Date.now();
  } catch (err: any) {
    console.error('Failed to fetch football data:', err);
    footballData.error = err.message;
  } finally {
    footballData.loading = false;
  }
}
