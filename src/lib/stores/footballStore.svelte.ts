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

const getMockFixtures = () => [
  { id: 1, competition: { name: 'Bundesliga', emblem: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg', code: 'BL1' }, homeTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, awayTeam: { id: 4, name: 'Borussia Dortmund', shortName: 'Dortmund', crest: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' }, utcDate: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Allianz Arena' },
  { id: 2, competition: { name: 'Champions League', emblem: 'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2.svg', code: 'CL' }, homeTeam: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', crest: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' }, awayTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, utcDate: new Date(Date.now() + 86400000 * 6).toISOString(), venue: 'Santiago Bernabéu' }
];

const getMockResults = () => [
  { id: 3, competition: { name: 'Bundesliga' }, homeTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, awayTeam: { id: 2, name: 'Bayer 04 Leverkusen', shortName: 'Leverkusen', crest: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg' }, score: { fullTime: { home: 3, away: 1 } }, utcDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 4, competition: { name: 'Champions League' }, homeTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, awayTeam: { id: 11, name: 'Arsenal FC', shortName: 'Arsenal', crest: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' }, score: { fullTime: { home: 2, away: 0 } }, utcDate: new Date(Date.now() - 86400000 * 7).toISOString() }
];

const getMockBundesliga = () => ({
  standings: [{
    table: [
      { position: 1, team: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, playedGames: 28, won: 22, draw: 4, lost: 2, goalDifference: 58, points: 70 },
      { position: 2, team: { id: 2, name: 'Bayer 04 Leverkusen', shortName: 'Leverkusen', crest: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg' }, playedGames: 28, won: 20, draw: 5, lost: 3, goalDifference: 45, points: 65 },
      { position: 3, team: { id: 4, name: 'Borussia Dortmund', shortName: 'Dortmund', crest: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' }, playedGames: 28, won: 18, draw: 6, lost: 4, goalDifference: 32, points: 60 }
    ]
  }]
});

const getMockCL = () => ({
  standings: [{
    group: 'GROUP_A',
    table: [
      { position: 1, team: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, points: 16 },
      { position: 2, team: { id: 66, name: 'Manchester United FC', shortName: 'Man United', crest: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' }, points: 9 }
    ]
  }]
});

const getMockSquad = () => [
  { id: 420, name: 'Aleksandar Pavlović', position: 'Midfielder', dateOfBirth: '2004-05-03', shirtNumber: 45 },
  { id: 421, name: 'Alphonso Davies', position: 'Defender', dateOfBirth: '2000-11-02', shirtNumber: 19 },
  { id: 422, name: 'Dayot Upamecano', position: 'Defender', dateOfBirth: '1998-10-27', shirtNumber: 2 },
  { id: 423, name: 'Harry Kane', position: 'Attacker', dateOfBirth: '1993-07-28', shirtNumber: 9 },
  { id: 424, name: 'Jamal Musiala', position: 'Midfielder', dateOfBirth: '2003-02-26', shirtNumber: 42 },
  { id: 425, name: 'Joshua Kimmich', position: 'Midfielder', dateOfBirth: '1995-02-08', shirtNumber: 6 },
  { id: 426, name: 'Leon Goretzka', position: 'Midfielder', dateOfBirth: '1995-02-06', shirtNumber: 8 },
  { id: 427, name: 'Manuel Neuer', position: 'Goalkeeper', dateOfBirth: '1986-03-27', shirtNumber: 1 },
  { id: 428, name: 'Serge Gnabry', position: 'Attacker', dateOfBirth: '1995-07-14', shirtNumber: 7 },
  { id: 429, name: 'Michael Olise', position: 'Attacker', dateOfBirth: '2001-12-12', shirtNumber: 17 }
];

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
    if (results[0].status === 'fulfilled' && results[0].value) {
      footballData.fixtures = results[0].value.matches || [];
    } else {
      footballData.fixtures = getMockFixtures();
    }

    if (results[1].status === 'fulfilled' && results[1].value) {
      footballData.results = results[1].value.matches || [];
    } else {
      footballData.results = getMockResults();
    }

    if (results[2].status === 'fulfilled' && results[2].value) {
      footballData.standings.bundesliga = results[2].value;
    } else {
      footballData.standings.bundesliga = getMockBundesliga();
    }

    if (results[3].status === 'fulfilled' && results[3].value) {
      footballData.standings.cl = results[3].value;
    } else {
      footballData.standings.cl = getMockCL();
    }

    if (results[4].status === 'fulfilled' && results[4].value) {
      footballData.squad = results[4].value.squad || [];
    } else {
      footballData.squad = getMockSquad();
    }
    
    // Check if everything failed
    if (results.every(r => r.status === 'rejected')) {
      const error = (results[0] as PromiseRejectedResult).reason;
      footballData.error = error.message || 'Rate limited. Displaying mock data.';
    } else {
      footballData.lastUpdated = Date.now();
    }

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

// Single Source of Truth for strictly local players
export const localBayernSquad = $derived.by(() => {
  const fileMap: Record<string, string> = {
    'Aleksandar Pavlović': 'Aleksander Pavlovic .png',
    'Alphonso Davies': 'Alphonso Davies .png',
    'Dayot Upamecano': 'Dayot Upamecano.png',
    'Harry Kane': 'Harry Kane .png',
    'Jamal Musiala': 'Jamal Musiala .png',
    'Jonas Urbig': 'Jonas Urbig .png',
    'Jonathan Tah': 'Jonathan Tah .png',
    'Joshua Kimmich': 'Joshua Kimmich .png',
    'Josip Stanišić': 'Josip Stanisic.png',
    'Konrad Laimer': 'Konrad Laimer .png',
    'Leon Goretzka': 'Leon Goretzka .png',
    'Luis Díaz': 'Luis Diaz.png',
    'Manuel Neuer': 'Manuel Neuer .png',
    'Michael Olise': 'Michael Olise .png',
    'Serge Gnabry': 'Serge Gnabry.png',
    'Tom Bischof': 'Tom Bischof .png'
  };

  if (!footballData.squad || footballData.squad.length === 0) return [];

  return footballData.squad
    .filter((player: any) => fileMap[player.name] !== undefined)
    .map((player: any) => ({
      id: player.id?.toString(),
      name: player.name,
      role: player.position === 'Coach' ? 'Staff' : 'Player',
      position: player.position,
      avatar: `/images/players/${encodeURIComponent(fileMap[player.name])}`,
      availability: 'available', // Defaults for mock attendance/status
      attendance: 85 + (player.id % 15), // Mock realistic attendance %
      jerseyNumber: player.shirtNumber || (player.id % 99),
      birthdate: player.dateOfBirth || '1990-01-01'
    }));
});
