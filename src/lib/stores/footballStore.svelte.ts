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
  squad: [] as any[],
  loading: false,
  error: null as string | null,
  lastUpdated: null as number | null
});

export async function refreshFootballData() {
  if (footballData.loading) return;
  
  console.log('[FootballStore] Refreshing all football data...');
  footballData.loading = true;
  footballData.error = null;
  
  try {
    const results = await Promise.allSettled([
      footballApi.getBayernFixtures(),
      footballApi.getBayernResults(),
      footballApi.getBundesligaStandings(),
      footballApi.getCLStandings(),
      footballApi.getBayernSquad()
    ]);
    
    // Process results individually to allow partial success
    if (results[0].status === 'fulfilled') footballData.fixtures = results[0].value?.matches || [];
    if (results[1].status === 'fulfilled') footballData.results = results[1].value?.matches || [];
    if (results[2].status === 'fulfilled') footballData.standings.bundesliga = results[2].value;
    if (results[3].status === 'fulfilled') footballData.standings.cl = results[3].value;
    if (results[4].status === 'fulfilled') footballData.squad = results[4].value?.squad || [];
    
    // Check if everything failed
    if (results.every(r => r.status === 'rejected')) {
      const error = (results[0] as PromiseRejectedResult).reason;
      footballData.error = error.message || 'Failed to fetch any data';
    }

    footballData.lastUpdated = Date.now();
    console.log('[FootballStore] Data refresh complete', {
      fixtures: footballData.fixtures.length,
      results: footballData.results.length,
      hasBL: !!footballData.standings.bundesliga,
      hasCL: !!footballData.standings.cl,
      squadSize: footballData.squad.length
    });
  } catch (err: any) {
    console.error('[FootballStore] Global error in refresh:', err);
    footballData.error = err.message;
  } finally {
    footballData.loading = false;
  }
}
