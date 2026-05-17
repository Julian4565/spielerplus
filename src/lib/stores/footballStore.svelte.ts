import { footballApi } from '$lib/services/footballApi';
import { base } from '$app/paths';

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
  { id: 101, competition: { name: 'Bundesliga', emblem: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg', code: 'BL1' }, homeTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, awayTeam: { id: 4, name: 'Borussia Dortmund', shortName: 'Dortmund', crest: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' }, utcDate: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Allianz Arena' },
  { id: 102, competition: { name: 'Champions League', emblem: `${base}/images/Titels/Champions league.png`, code: 'CL' }, homeTeam: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', crest: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' }, awayTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, utcDate: new Date(Date.now() + 86400000 * 6).toISOString(), venue: 'Santiago Bernabéu' },
  { id: 103, competition: { name: 'Bundesliga', emblem: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg', code: 'BL1' }, homeTeam: { id: 721, name: 'RB Leipzig', shortName: 'RB Leipzig', crest: 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg' }, awayTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, utcDate: new Date(Date.now() + 86400000 * 10).toISOString(), venue: 'Red Bull Arena' },
  { id: 104, competition: { name: 'DFB Pokal', emblem: `${base}/images/Titels/DFB Pokal.png`, code: 'DFB' }, homeTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, awayTeam: { id: 24, name: 'VfL Bochum', shortName: 'Bochum', crest: `${base}/images/Titels/Bochum .png` }, utcDate: new Date(Date.now() + 86400000 * 14).toISOString(), venue: 'Allianz Arena' },
  { id: 105, competition: { name: 'Champions League', emblem: `${base}/images/Titels/Champions league.png`, code: 'CL' }, homeTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, awayTeam: { id: 524, name: 'Paris Saint-Germain FC', shortName: 'PSG', crest: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' }, utcDate: new Date(Date.now() + 86400000 * 18).toISOString(), venue: 'Allianz Arena' }
];

const getMockResults = () => [
  { id: 91, competition: { name: 'Bundesliga', code: 'BL1' }, homeTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, awayTeam: { id: 2, name: 'Bayer 04 Leverkusen', shortName: 'Leverkusen', crest: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg' }, score: { fullTime: { home: 3, away: 1 } }, utcDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 92, competition: { name: 'Champions League', emblem: `${base}/images/Titels/Champions league.png`, code: 'CL' }, homeTeam: { id: 11, name: 'Arsenal FC', shortName: 'Arsenal', crest: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' }, awayTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, score: { fullTime: { home: 0, away: 2 } }, utcDate: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 93, competition: { name: 'Bundesliga', code: 'BL1' }, homeTeam: { id: 9, name: 'Eintracht Frankfurt', shortName: 'Frankfurt', crest: `${base}/images/Titels/Frankfurt .png` }, awayTeam: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, score: { fullTime: { home: 1, away: 4 } }, utcDate: new Date(Date.now() - 86400000 * 12).toISOString() }
];

const getMockBundesliga = () => ({
  standings: [{
    table: [
      { position: 1, team: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, playedGames: 28, won: 22, draw: 4, lost: 2, goalDifference: 58, points: 70 },
      { position: 2, team: { id: 2, name: 'Bayer 04 Leverkusen', shortName: 'Leverkusen', crest: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg' }, playedGames: 28, won: 20, draw: 5, lost: 3, goalDifference: 45, points: 65 },
      { position: 3, team: { id: 4, name: 'Borussia Dortmund', shortName: 'Dortmund', crest: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' }, playedGames: 28, won: 18, draw: 6, lost: 4, goalDifference: 32, points: 60 },
      { position: 4, team: { id: 721, name: 'RB Leipzig', shortName: 'RB Leipzig', crest: 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg' }, playedGames: 28, won: 17, draw: 5, lost: 6, goalDifference: 25, points: 56 },
      { position: 5, team: { id: 10, name: 'VfB Stuttgart', shortName: 'Stuttgart', crest: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg' }, playedGames: 28, won: 16, draw: 6, lost: 6, goalDifference: 20, points: 54 },
      { position: 6, team: { id: 9, name: 'Eintracht Frankfurt', shortName: 'Frankfurt', crest: `${base}/images/Titels/Frankfurt .png` }, playedGames: 28, won: 14, draw: 8, lost: 6, goalDifference: 12, points: 50 },
      { position: 7, team: { id: 17, name: 'SC Freiburg', shortName: 'Freiburg', crest: `${base}/images/Titels/Feiburg .png` }, playedGames: 28, won: 12, draw: 7, lost: 9, goalDifference: 5, points: 43 },
      { position: 8, team: { id: 24, name: 'VfL Bochum', shortName: 'Bochum', crest: `${base}/images/Titels/Bochum .png` }, playedGames: 28, won: 9, draw: 8, lost: 11, goalDifference: -12, points: 35 }
    ]
  }]
});

const getMockCL = () => ({
  standings: [{
    group: 'LEAGUE_PHASE',
    table: [
      { position: 1, team: { id: 5, name: 'FC Bayern München', shortName: 'Bayern', crest: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg' }, playedGames: 8, won: 6, draw: 1, lost: 1, goalDifference: 12, points: 19 },
      { position: 2, team: { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', crest: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' }, playedGames: 8, won: 6, draw: 0, lost: 2, goalDifference: 10, points: 18 },
      { position: 3, team: { id: 65, name: 'Manchester City FC', shortName: 'Man City', crest: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' }, playedGames: 8, won: 5, draw: 2, lost: 1, goalDifference: 11, points: 17 },
      { position: 4, team: { id: 11, name: 'Arsenal FC', shortName: 'Arsenal', crest: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' }, playedGames: 8, won: 5, draw: 1, lost: 2, goalDifference: 8, points: 16 },
      { position: 5, team: { id: 524, name: 'Paris Saint-Germain FC', shortName: 'PSG', crest: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' }, playedGames: 8, won: 4, draw: 3, lost: 1, goalDifference: 6, points: 15 },
      { position: 6, team: { id: 64, name: 'Liverpool FC', shortName: 'Liverpool', crest: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' }, playedGames: 8, won: 4, draw: 2, lost: 2, goalDifference: 5, points: 14 }
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

function checkAndOverrideCrest(team: any) {
  if (!team) return;
  const name = team.name || '';
  const shortName = team.shortName || '';
  if (name.includes('Freiburg') || shortName.includes('Freiburg')) {
    team.crest = `${base}/images/Titels/Feiburg .png`;
  } else if (name.includes('Frankfurt') || shortName.includes('Frankfurt')) {
    team.crest = `${base}/images/Titels/Frankfurt .png`;
  } else if (name.includes('Bochum') || shortName.includes('Bochum')) {
    team.crest = `${base}/images/Titels/Bochum .png`;
  }
}

function sanitizeFixtureOrResult(match: any) {
  if (!match) return null;
  // Overrides Champions League & DFB Pokal emblem with local ones
  if (match.competition) {
    const compName = match.competition.name || '';
    const compCode = match.competition.code || '';
    if (compName.includes('Champions League') || compCode === 'CL' || compName.includes('UCL')) {
      match.competition.emblem = `${base}/images/Titels/Champions league.png`;
    } else if (compName.includes('DFB Pokal') || compCode === 'DFB' || compName.includes('DFB')) {
      match.competition.emblem = `${base}/images/Titels/DFB Pokal.png`;
    }
  }

  // Ensure home and away teams have valid crests and names
  if (!match.homeTeam || !match.awayTeam) return null;
  checkAndOverrideCrest(match.homeTeam);
  checkAndOverrideCrest(match.awayTeam);

  if (!match.homeTeam.crest || match.homeTeam.crest === '' || match.homeTeam.crest.includes('placeholder')) {
    return null;
  }
  if (!match.awayTeam.crest || match.awayTeam.crest === '' || match.awayTeam.crest.includes('placeholder')) {
    return null;
  }

  return match;
}

function sanitizeStandings(standingsData: any) {
  if (!standingsData || !standingsData.standings) return standingsData;
  standingsData.standings = standingsData.standings.map((std: any) => {
    if (std.table) {
      std.table = std.table
        .map((row: any) => {
          if (row.team) {
            checkAndOverrideCrest(row.team);
            if (!row.team.crest || row.team.crest === '' || row.team.crest.includes('placeholder')) {
              return null;
            }
          }
          return row;
        })
        .filter(Boolean);
    }
    return std;
  });
  return standingsData;
}

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
      const rawMatches = results[0].value.matches || [];
      footballData.fixtures = rawMatches.map(sanitizeFixtureOrResult).filter(Boolean);
      if (footballData.fixtures.length === 0) {
        footballData.fixtures = getMockFixtures();
      }
    } else {
      footballData.fixtures = getMockFixtures();
    }

    if (results[1].status === 'fulfilled' && results[1].value) {
      const rawMatches = results[1].value.matches || [];
      footballData.results = rawMatches.map(sanitizeFixtureOrResult).filter(Boolean);
      if (footballData.results.length === 0) {
        footballData.results = getMockResults();
      }
    } else {
      footballData.results = getMockResults();
    }

    if (results[2].status === 'fulfilled' && results[2].value) {
      footballData.standings.bundesliga = sanitizeStandings(results[2].value);
    } else {
      footballData.standings.bundesliga = getMockBundesliga();
    }

    if (results[3].status === 'fulfilled' && results[3].value) {
      footballData.standings.cl = sanitizeStandings(results[3].value);
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
export function getLocalBayernSquad() {
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
}
