<script lang="ts">
  import { onMount } from 'svelte';
  import { footballData, refreshFootballData } from '$lib/stores/footballStore.svelte.ts';
  import Card from '$lib/components/ui/Card.svelte';
  import { BarChart3, Trophy, ChevronRight, Activity } from 'lucide-svelte';

  onMount(() => {
    if (!footballData.lastUpdated) {
      refreshFootballData();
    }
  });

  const BAYERN_ID = 5;

  let activeTable = $state('bundesliga');

  function getTableData() {
    if (activeTable === 'bundesliga') {
      return footballData.standings.bundesliga?.standings?.[0]?.table || [];
    } else {
      // CL new format: single league phase table
      return footballData.standings.cl?.standings?.[0]?.table || [];
    }
  }

  const clubDetailsMap: Record<string, any> = {
    // ── Bundesliga ──
    'FC Bayern München': { founded: 1900, stadium: 'Allianz Arena', capacity: '75,024', manager: 'Vincent Kompany', league: 'Bundesliga', color: '#dc2626' },
    'Bayern': { founded: 1900, stadium: 'Allianz Arena', capacity: '75,024', manager: 'Vincent Kompany', league: 'Bundesliga', color: '#dc2626' },
    'Bayer 04 Leverkusen': { founded: 1904, stadium: 'BayArena', capacity: '30,210', manager: 'Xabi Alonso', league: 'Bundesliga', color: '#e11d48' },
    'Leverkusen': { founded: 1904, stadium: 'BayArena', capacity: '30,210', manager: 'Xabi Alonso', league: 'Bundesliga', color: '#e11d48' },
    'Borussia Dortmund': { founded: 1909, stadium: 'Signal Iduna Park', capacity: '81,365', manager: 'Nuri Şahin', league: 'Bundesliga', color: '#facc15' },
    'Dortmund': { founded: 1909, stadium: 'Signal Iduna Park', capacity: '81,365', manager: 'Nuri Şahin', league: 'Bundesliga', color: '#facc15' },
    'RB Leipzig': { founded: 2009, stadium: 'Red Bull Arena', capacity: '47,069', manager: 'Marco Rose', league: 'Bundesliga', color: '#2563eb' },
    'VfB Stuttgart': { founded: 1893, stadium: 'MHPArena', capacity: '60,449', manager: 'Sebastian Hoeneß', league: 'Bundesliga', color: '#e11d48' },
    'Stuttgart': { founded: 1893, stadium: 'MHPArena', capacity: '60,449', manager: 'Sebastian Hoeneß', league: 'Bundesliga', color: '#e11d48' },
    'Eintracht Frankfurt': { founded: 1899, stadium: 'Deutsche Bank Park', capacity: '58,000', manager: 'Dino Toppmöller', league: 'Bundesliga', color: '#1e293b' },
    'Frankfurt': { founded: 1899, stadium: 'Deutsche Bank Park', capacity: '58,000', manager: 'Dino Toppmöller', league: 'Bundesliga', color: '#1e293b' },
    'SC Freiburg': { founded: 1904, stadium: 'Europa-Park Stadion', capacity: '34,700', manager: 'Julian Schuster', league: 'Bundesliga', color: '#dc2626' },
    'Freiburg': { founded: 1904, stadium: 'Europa-Park Stadion', capacity: '34,700', manager: 'Julian Schuster', league: 'Bundesliga', color: '#dc2626' },
    'VfL Wolfsburg': { founded: 1945, stadium: 'Volkswagen Arena', capacity: '30,000', manager: 'Ralph Hasenhüttl', league: 'Bundesliga', color: '#16a34a' },
    'Wolfsburg': { founded: 1945, stadium: 'Volkswagen Arena', capacity: '30,000', manager: 'Ralph Hasenhüttl', league: 'Bundesliga', color: '#16a34a' },
    'SV Werder Bremen': { founded: 1899, stadium: 'Weserstadion', capacity: '42,100', manager: 'Ole Werner', league: 'Bundesliga', color: '#059669' },
    'Bremen': { founded: 1899, stadium: 'Weserstadion', capacity: '42,100', manager: 'Ole Werner', league: 'Bundesliga', color: '#059669' },
    '1. FC Union Berlin': { founded: 1966, stadium: 'An der Alten Försterei', capacity: '22,012', manager: 'Bo Svensson', league: 'Bundesliga', color: '#dc2626' },
    'Union Berlin': { founded: 1966, stadium: 'An der Alten Försterei', capacity: '22,012', manager: 'Bo Svensson', league: 'Bundesliga', color: '#dc2626' },
    'Borussia Mönchengladbach': { founded: 1900, stadium: 'Borussia-Park', capacity: '54,042', manager: 'Gerardo Seoane', league: 'Bundesliga', color: '#1e293b' },
    'Gladbach': { founded: 1900, stadium: 'Borussia-Park', capacity: '54,042', manager: 'Gerardo Seoane', league: 'Bundesliga', color: '#1e293b' },
    'FC Augsburg': { founded: 1907, stadium: 'WWK Arena', capacity: '30,660', manager: 'Jess Thorup', league: 'Bundesliga', color: '#dc2626' },
    'Augsburg': { founded: 1907, stadium: 'WWK Arena', capacity: '30,660', manager: 'Jess Thorup', league: 'Bundesliga', color: '#dc2626' },
    '1. FSV Mainz 05': { founded: 1905, stadium: 'Mewa Arena', capacity: '33,305', manager: 'Bo Henriksen', league: 'Bundesliga', color: '#dc2626' },
    'Mainz': { founded: 1905, stadium: 'Mewa Arena', capacity: '33,305', manager: 'Bo Henriksen', league: 'Bundesliga', color: '#dc2626' },
    'TSG 1899 Hoffenheim': { founded: 1899, stadium: 'PreZero Arena', capacity: '30,150', manager: 'Pellegrino Matarazzo', league: 'Bundesliga', color: '#2563eb' },
    'Hoffenheim': { founded: 1899, stadium: 'PreZero Arena', capacity: '30,150', manager: 'Pellegrino Matarazzo', league: 'Bundesliga', color: '#2563eb' },
    'VfL Bochum': { founded: 1848, stadium: 'Vonovia Ruhrstadion', capacity: '27,599', manager: 'Dieter Hecking', league: 'Bundesliga', color: '#2563eb' },
    'Bochum': { founded: 1848, stadium: 'Vonovia Ruhrstadion', capacity: '27,599', manager: 'Dieter Hecking', league: 'Bundesliga', color: '#2563eb' },
    'FC Heidenheim': { founded: 1846, stadium: 'Voith-Arena', capacity: '15,000', manager: 'Frank Schmidt', league: 'Bundesliga', color: '#dc2626' },
    'Heidenheim': { founded: 1846, stadium: 'Voith-Arena', capacity: '15,000', manager: 'Frank Schmidt', league: 'Bundesliga', color: '#dc2626' },
    'FC St. Pauli': { founded: 1910, stadium: 'Millerntor-Stadion', capacity: '29,546', manager: 'Alexander Blessin', league: 'Bundesliga', color: '#78350f' },
    'St. Pauli': { founded: 1910, stadium: 'Millerntor-Stadion', capacity: '29,546', manager: 'Alexander Blessin', league: 'Bundesliga', color: '#78350f' },
    'Holstein Kiel': { founded: 1900, stadium: 'Holstein-Stadion', capacity: '15,034', manager: 'Marcel Rapp', league: 'Bundesliga', color: '#1e40af' },
    'Kiel': { founded: 1900, stadium: 'Holstein-Stadion', capacity: '15,034', manager: 'Marcel Rapp', league: 'Bundesliga', color: '#1e40af' },
    // ── Champions League ──
    'Real Madrid CF': { founded: 1902, stadium: 'Santiago Bernabéu', capacity: '81,044', manager: 'Carlo Ancelotti', league: 'La Liga', color: '#3b82f6' },
    'Real Madrid': { founded: 1902, stadium: 'Santiago Bernabéu', capacity: '81,044', manager: 'Carlo Ancelotti', league: 'La Liga', color: '#3b82f6' },
    'Manchester City FC': { founded: 1880, stadium: 'Etihad Stadium', capacity: '53,400', manager: 'Pep Guardiola', league: 'Premier League', color: '#0ea5e9' },
    'Man City': { founded: 1880, stadium: 'Etihad Stadium', capacity: '53,400', manager: 'Pep Guardiola', league: 'Premier League', color: '#0ea5e9' },
    'Arsenal FC': { founded: 1886, stadium: 'Emirates Stadium', capacity: '60,704', manager: 'Mikel Arteta', league: 'Premier League', color: '#ef4444' },
    'Arsenal': { founded: 1886, stadium: 'Emirates Stadium', capacity: '60,704', manager: 'Mikel Arteta', league: 'Premier League', color: '#ef4444' },
    'Paris Saint-Germain FC': { founded: 1970, stadium: 'Parc des Princes', capacity: '47,929', manager: 'Luis Enrique', league: 'Ligue 1', color: '#1e3a8a' },
    'PSG': { founded: 1970, stadium: 'Parc des Princes', capacity: '47,929', manager: 'Luis Enrique', league: 'Ligue 1', color: '#1e3a8a' },
    'Liverpool FC': { founded: 1892, stadium: 'Anfield', capacity: '61,276', manager: 'Arne Slot', league: 'Premier League', color: '#b91c1c' },
    'Liverpool': { founded: 1892, stadium: 'Anfield', capacity: '61,276', manager: 'Arne Slot', league: 'Premier League', color: '#b91c1c' },
    'FC Barcelona': { founded: 1899, stadium: 'Spotify Camp Nou', capacity: '99,354', manager: 'Hansi Flick', league: 'La Liga', color: '#1e3a8a' },
    'Barcelona': { founded: 1899, stadium: 'Spotify Camp Nou', capacity: '99,354', manager: 'Hansi Flick', league: 'La Liga', color: '#1e3a8a' },
    'FC Internazionale Milano': { founded: 1908, stadium: 'San Siro', capacity: '75,923', manager: 'Simone Inzaghi', league: 'Serie A', color: '#1e3a8a' },
    'Inter': { founded: 1908, stadium: 'San Siro', capacity: '75,923', manager: 'Simone Inzaghi', league: 'Serie A', color: '#1e3a8a' },
    'Juventus FC': { founded: 1897, stadium: 'Allianz Stadium', capacity: '41,507', manager: 'Thiago Motta', league: 'Serie A', color: '#1e293b' },
    'Juventus': { founded: 1897, stadium: 'Allianz Stadium', capacity: '41,507', manager: 'Thiago Motta', league: 'Serie A', color: '#1e293b' },
    'SSC Napoli': { founded: 1926, stadium: 'Stadio Diego Armando Maradona', capacity: '54,726', manager: 'Antonio Conte', league: 'Serie A', color: '#0ea5e9' },
    'Napoli': { founded: 1926, stadium: 'Stadio Diego Armando Maradona', capacity: '54,726', manager: 'Antonio Conte', league: 'Serie A', color: '#0ea5e9' },
    'Tottenham Hotspur FC': { founded: 1882, stadium: 'Tottenham Hotspur Stadium', capacity: '62,850', manager: 'Ange Postecoglou', league: 'Premier League', color: '#1e293b' },
    'Tottenham': { founded: 1882, stadium: 'Tottenham Hotspur Stadium', capacity: '62,850', manager: 'Ange Postecoglou', league: 'Premier League', color: '#1e293b' },
    'Club Atlético de Madrid': { founded: 1903, stadium: 'Metropolitano', capacity: '68,456', manager: 'Diego Simeone', league: 'La Liga', color: '#dc2626' },
    'Atlético': { founded: 1903, stadium: 'Metropolitano', capacity: '68,456', manager: 'Diego Simeone', league: 'La Liga', color: '#dc2626' },
    'AC Milan': { founded: 1899, stadium: 'San Siro', capacity: '75,923', manager: 'Paulo Fonseca', league: 'Serie A', color: '#dc2626' },
    'Milan': { founded: 1899, stadium: 'San Siro', capacity: '75,923', manager: 'Paulo Fonseca', league: 'Serie A', color: '#dc2626' },
    'SL Benfica': { founded: 1904, stadium: 'Estádio da Luz', capacity: '64,642', manager: 'Bruno Lage', league: 'Liga Portugal', color: '#dc2626' },
    'Benfica': { founded: 1904, stadium: 'Estádio da Luz', capacity: '64,642', manager: 'Bruno Lage', league: 'Liga Portugal', color: '#dc2626' },
    'FC Porto': { founded: 1893, stadium: 'Estádio do Dragão', capacity: '50,033', manager: 'Vítor Bruno', league: 'Liga Portugal', color: '#1e3a8a' },
    'Porto': { founded: 1893, stadium: 'Estádio do Dragão', capacity: '50,033', manager: 'Vítor Bruno', league: 'Liga Portugal', color: '#1e3a8a' },
    'Sporting CP': { founded: 1906, stadium: 'Estádio José Alvalade', capacity: '50,095', manager: 'Rúben Amorim', league: 'Liga Portugal', color: '#16a34a' },
    'Sporting': { founded: 1906, stadium: 'Estádio José Alvalade', capacity: '50,095', manager: 'Rúben Amorim', league: 'Liga Portugal', color: '#16a34a' },
    'PSV Eindhoven': { founded: 1913, stadium: 'Philips Stadion', capacity: '35,000', manager: 'Peter Bosz', league: 'Eredivisie', color: '#dc2626' },
    'PSV': { founded: 1913, stadium: 'Philips Stadion', capacity: '35,000', manager: 'Peter Bosz', league: 'Eredivisie', color: '#dc2626' },
    'Celtic FC': { founded: 1887, stadium: 'Celtic Park', capacity: '60,411', manager: 'Brendan Rodgers', league: 'Scottish Premiership', color: '#16a34a' },
    'Celtic': { founded: 1887, stadium: 'Celtic Park', capacity: '60,411', manager: 'Brendan Rodgers', league: 'Scottish Premiership', color: '#16a34a' },
    'FC Salzburg': { founded: 1933, stadium: 'Red Bull Arena', capacity: '30,188', manager: 'Pepijn Lijnders', league: 'Austrian Bundesliga', color: '#dc2626' },
    'Salzburg': { founded: 1933, stadium: 'Red Bull Arena', capacity: '30,188', manager: 'Pepijn Lijnders', league: 'Austrian Bundesliga', color: '#dc2626' },
    'BSC Young Boys': { founded: 1898, stadium: 'Wankdorf', capacity: '31,120', manager: 'Patrick Rahmen', league: 'Swiss Super League', color: '#facc15' },
    'Young Boys': { founded: 1898, stadium: 'Wankdorf', capacity: '31,120', manager: 'Patrick Rahmen', league: 'Swiss Super League', color: '#facc15' }
  };

  let selectedClub = $state<any>(null);
  let selectedClubStats = $state<any>(null);

  function openClubDetails(team: any, stats: any) {
    const details = clubDetailsMap[team.name] || clubDetailsMap[team.shortName] || {
      founded: 1900,
      stadium: 'Municipal Arena',
      capacity: '50,000',
      manager: 'Head Coach',
      league: activeTable === 'bundesliga' ? 'Bundesliga' : 'Champions League',
      color: '#1e293b'
    };
    selectedClub = {
      ...team,
      ...details
    };
    selectedClubStats = stats;
  }

  const r16OrderedIndices = [0, 4, 2, 1, 3, 6, 5, 7];

  function isWinner(teamName: string, round: string, idx: number) {
    if (round === 'roundOf16') {
      const matchWinners: Record<number, string> = {
        0: 'Bayern',
        1: 'Liverpool',
        2: 'Real Madrid',
        3: 'Man City',
        4: 'Arsenal',
        5: 'Barcelona',
        6: 'PSG',
        7: 'Inter'
      };
      return matchWinners[idx] === teamName;
    }
    if (round === 'quarterFinals') {
      const matchWinners: Record<number, string> = {
        0: 'Bayern',
        1: 'Real Madrid',
        2: 'PSG',
        3: 'Barcelona'
      };
      return matchWinners[idx] === teamName;
    }
    return false;
  }

  function isLoser(teamName: string, round: string, idx: number) {
    if (round === 'roundOf16') {
      const matchLosers: Record<number, string> = {
        0: 'Benfica',
        1: 'Sporting',
        2: 'Porto',
        3: 'Napoli',
        4: 'Milan',
        5: 'Leverkusen',
        6: 'RB Leipzig',
        7: 'Dortmund'
      };
      return matchLosers[idx] === teamName;
    }
    if (round === 'quarterFinals') {
      const matchLosers: Record<number, string> = {
        0: 'Arsenal',
        1: 'Liverpool',
        2: 'Man City',
        3: 'Inter'
      };
      return matchLosers[idx] === teamName;
    }
    return false;
  }

  function getRowZoneClass(position: number) {
    if (activeTable === 'bundesliga') {
      if (position <= 4) return 'zone-ucl';
      if (position <= 6) return 'zone-uel';
      if (position === 7) return 'zone-uecl';
      if (position === 16) return 'zone-playoff';
      if (position >= 17) return 'zone-relegation';
    } else {
      if (position <= 8) return 'zone-cl-direct';
      if (position <= 24) return 'zone-cl-playoff';
    }
    return '';
  }
</script>

<div class="standings-page animate-in">
  <header class="page-header">
    <div class="header-content">
      <h1 class="page-title">League Standings</h1>
      <p class="page-subtitle">Current position and performance across competitions</p>
      
      {#if footballData.error}
        <div class="error-inline">
          <span>{footballData.error}</span>
          <button onclick={() => refreshFootballData()} class="text-btn">Retry</button>
        </div>
      {/if}
    </div>
    
    <div class="header-actions">
      <button 
        class="refresh-icon-btn" 
        onclick={() => refreshFootballData()} 
        disabled={footballData.loading}
        title="Refresh Standings"
      >
        <Activity size={18} class={footballData.loading ? 'spin' : ''} />
      </button>

      <div class="table-switcher">
        <button 
          class="switch-btn" 
          class:active={activeTable === 'bundesliga'} 
          onclick={() => activeTable = 'bundesliga'}
        >
          Bundesliga
        </button>
        <button 
          class="switch-btn" 
          class:active={activeTable === 'cl'} 
          onclick={() => activeTable = 'cl'}
        >
          Champions League
        </button>
      </div>
    </div>
  </header>

  <div class="standings-container">
    <Card class="table-card">
      <div class="table-wrapper">
        <table class="standings-table">
          <thead>
            <tr>
              <th class="pos">Pos</th>
              <th class="team">Club</th>
              <th class="stat">P</th>
              <th class="stat">W</th>
              <th class="stat">D</th>
              <th class="stat">L</th>
              <th class="stat">GD</th>
              <th class="stat pts">Pts</th>
            </tr>
          </thead>
          <tbody>
            {#each getTableData() as row}
              <tr class:highlight={row.team.id === BAYERN_ID} class="clickable-row {getRowZoneClass(row.position)}" onclick={() => openClubDetails(row.team, row)}>
                <td class="pos">{row.position}</td>
                <td class="team">
                  <div class="team-info">
                    <img src={row.team.crest} alt="" class="crest" />
                    <span class="team-name">{row.team.shortName || row.team.name}</span>
                  </div>
                </td>
                <td class="stat">{row.playedGames}</td>
                <td class="stat">{row.won}</td>
                <td class="stat">{row.draw}</td>
                <td class="stat">{row.lost}</td>
                <td class="stat">{row.goalDifference}</td>
                <td class="stat pts">{row.points}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </Card>

    {#if activeTable === 'cl'}
      <!-- Knockout Bracket Section -->
      <div class="knockout-section animate-in">
        <div class="knockout-header">
          <Trophy size={22} class="knockout-icon" />
          <h2>Knockout Stage</h2>
        </div>
        
        {#if footballData.clKnockout}
          <div class="bracket-container">
            <!-- Round of 16 -->
            <div class="bracket-column">
              <h3 class="round-title">Round of 16</h3>
              <div class="matches-list">
                {#each r16OrderedIndices as idx}
                  {@const match = footballData.clKnockout.roundOf16[idx]}
                  {#if match}
                    <div class="bracket-match-card" class:highlight-match={match.home.includes('Bayern') || match.away.includes('Bayern')}>
                      <div class="match-teams-box">
                        <div class="team-row" class:winner={isWinner(match.home, 'roundOf16', idx)} class:loser={isLoser(match.home, 'roundOf16', idx)}>
                          <img src={match.homeCrest} alt="" class="crest-xs" />
                          <span class="team-name-xs">{match.home}</span>
                          <span class="score-xs">{match.scoreHome !== null ? match.scoreHome : '-'}</span>
                        </div>
                        <div class="team-row" class:winner={isWinner(match.away, 'roundOf16', idx)} class:loser={isLoser(match.away, 'roundOf16', idx)}>
                          <img src={match.awayCrest} alt="" class="crest-xs" />
                          <span class="team-name-xs">{match.away}</span>
                          <span class="score-xs">{match.scoreAway !== null ? match.scoreAway : '-'}</span>
                        </div>
                      </div>
                      <div class="match-meta-xs">
                        <span class="agg-badge">{match.agg}</span>
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>

            <!-- Quarter-Finals -->
            <div class="bracket-column">
              <h3 class="round-title">Quarter-Finals</h3>
              <div class="matches-list">
                {#each footballData.clKnockout.quarterFinals as match, idx}
                  <div class="bracket-match-card" class:highlight-match={match.home.includes('Bayern') || match.away.includes('Bayern')}>
                    <div class="match-teams-box">
                      <div class="team-row" class:winner={isWinner(match.home, 'quarterFinals', idx)} class:loser={isLoser(match.home, 'quarterFinals', idx)}>
                        <img src={match.homeCrest} alt="" class="crest-xs" />
                        <span class="team-name-xs">{match.home}</span>
                        <span class="score-xs">{match.scoreHome !== null ? match.scoreHome : '-'}</span>
                      </div>
                      <div class="team-row" class:winner={isWinner(match.away, 'quarterFinals', idx)} class:loser={isLoser(match.away, 'quarterFinals', idx)}>
                        <img src={match.awayCrest} alt="" class="crest-xs" />
                        <span class="team-name-xs">{match.away}</span>
                        <span class="score-xs">{match.scoreAway !== null ? match.scoreAway : '-'}</span>
                      </div>
                    </div>
                    <div class="match-meta-xs">
                      <span class="agg-badge">{match.agg}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Semi-Finals -->
            <div class="bracket-column">
              <h3 class="round-title">Semi-Finals</h3>
              <div class="matches-list">
                {#each footballData.clKnockout.semiFinals as match, idx}
                  <div class="bracket-match-card" class:highlight-match={match.home.includes('Bayern') || match.away.includes('Bayern')}>
                    <div class="match-teams-box">
                      <div class="team-row" class:winner={isWinner(match.home, 'semiFinals', idx)} class:loser={isLoser(match.home, 'semiFinals', idx)}>
                        <img src={match.homeCrest} alt="" class="crest-xs" />
                        <span class="team-name-xs">{match.home}</span>
                        <span class="score-xs">{match.scoreHome !== null ? match.scoreHome : '-'}</span>
                      </div>
                      <div class="team-row" class:winner={isWinner(match.away, 'semiFinals', idx)} class:loser={isLoser(match.away, 'semiFinals', idx)}>
                        <img src={match.awayCrest} alt="" class="crest-xs" />
                        <span class="team-name-xs">{match.away}</span>
                        <span class="score-xs">{match.scoreAway !== null ? match.scoreAway : '-'}</span>
                      </div>
                    </div>
                    <div class="match-meta-xs">
                      <span class="agg-badge">{match.agg}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Final -->
            <div class="bracket-column">
              <h3 class="round-title">Final</h3>
              <div class="matches-list">
                <div class="bracket-match-card final-card highlight-match">
                  <div class="match-teams-box">
                    <div class="team-row">
                      {#if footballData.clKnockout.final.homeCrest}
                        <img src={footballData.clKnockout.final.homeCrest} alt="" class="crest-xs" />
                      {/if}
                      <span class="team-name-xs font-bold">{footballData.clKnockout.final.home}</span>
                      <span class="score-xs">{footballData.clKnockout.final.scoreHome !== null ? footballData.clKnockout.final.scoreHome : '-'}</span>
                    </div>
                    <div class="team-row">
                      {#if footballData.clKnockout.final.awayCrest}
                        <img src={footballData.clKnockout.final.awayCrest} alt="" class="crest-xs" />
                      {/if}
                      <span class="team-name-xs font-bold">{footballData.clKnockout.final.away}</span>
                      <span class="score-xs">{footballData.clKnockout.final.scoreAway !== null ? footballData.clKnockout.final.scoreAway : '-'}</span>
                    </div>
                  </div>
                  <div class="match-meta-xs final-meta">
                    <div class="final-venue">🏟️ {footballData.clKnockout.final.venue}</div>
                    <div class="final-date">📅 {footballData.clKnockout.final.date}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

{#if selectedClub}
  <div class="modal-overlay" onclick={() => selectedClub = null}>
    <div class="modal-content animate-in" onclick={(e) => e.stopPropagation()} style="--club-color: {selectedClub.color}">
      <button class="close-btn" onclick={() => selectedClub = null}>&times;</button>
      
      <div class="modal-header-banner">
        <img src={selectedClub.crest} alt={selectedClub.name} class="modal-crest" />
        <h2 class="club-title">{selectedClub.name}</h2>
        <span class="club-subtitle">{selectedClub.league} • Founded {selectedClub.founded}</span>
      </div>

      <div class="modal-body-grid">
        <div class="modal-section-card">
          <h4>🏟️ Arena & Staff</h4>
          <div class="info-row">
            <span class="lbl">Stadium</span>
            <span class="val">{selectedClub.stadium}</span>
          </div>
          <div class="info-row">
            <span class="lbl">Capacity</span>
            <span class="val">{selectedClub.capacity}</span>
          </div>
          <div class="info-row">
            <span class="lbl">Head Coach</span>
            <span class="val">{selectedClub.manager}</span>
          </div>
        </div>

        {#if selectedClubStats}
          <div class="modal-section-card">
            <h4>🏆 Performance Profile</h4>
            <div class="info-row">
              <span class="lbl">Current Standing</span>
              <span class="val ranking-value">Rank #{selectedClubStats.position}</span>
            </div>
            <div class="info-row">
              <span class="lbl">Points</span>
              <span class="val pts-value">{selectedClubStats.points} pts</span>
            </div>
            {#if selectedClubStats.won !== undefined}
              <div class="info-row">
                <span class="lbl">Record (W-D-L)</span>
                <span class="val">{selectedClubStats.won} - {selectedClubStats.draw} - {selectedClubStats.lost}</span>
              </div>
              <div class="info-row">
                <span class="lbl">Goal Difference</span>
                <span class="val">{selectedClubStats.goalDifference > 0 ? '+' : ''}{selectedClubStats.goalDifference}</span>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .standings-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2.5rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
  }

  .page-subtitle {
    color: var(--text-muted);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .error-inline {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #b91c1c;
    font-size: 0.85rem;
    font-weight: 600;
    background: #fef2f2;
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-sm);
    width: fit-content;
  }

  .text-btn {
    background: none;
    border: none;
    color: var(--primary);
    text-decoration: underline;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .refresh-icon-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-muted);
    transition: var(--transition);
  }

  .refresh-icon-btn:hover:not(:disabled) {
    color: var(--primary);
    border-color: var(--primary);
    background: var(--bg-color);
  }

  .refresh-icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .table-switcher {
    display: flex;
    background: var(--bg-color);
    padding: 0.4rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
  }

  .switch-btn {
    padding: 0.6rem 1.5rem;
    border-radius: var(--radius-sm);
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--text-muted);
    transition: var(--transition);
  }

  .switch-btn:hover {
    color: var(--text-main);
  }

  .switch-btn.active {
    background: var(--surface);
    color: var(--primary);
    box-shadow: var(--shadow-sm);
  }

  :global(.table-card) {
    padding: 0;
    overflow: hidden;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .standings-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .standings-table th {
    padding: 1.25rem 1rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    font-weight: 700;
    background: rgba(0,0,0,0.02);
  }

  .standings-table td {
    padding: 1.25rem 1rem;
    border-top: 1px solid var(--border);
    color: var(--text-main);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .standings-table tr.highlight {
    background: rgba(220, 38, 38, 0.05);
  }

  .standings-table tr.highlight .team-name {
    color: var(--primary);
    font-weight: 700;
  }

  .pos {
    width: 60px;
    text-align: center;
    font-weight: 700;
  }

  .team-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .crest {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .stat {
    width: 60px;
    text-align: center;
  }

  .pts {
    width: 80px;
    text-align: center;
    font-weight: 800;
    color: var(--text-main);
  }

  /* Standing Zones styling */
  tr.zone-ucl td.pos { border-left: 3px solid #3b82f6 !important; }
  tr.zone-uel td.pos { border-left: 3px solid #f97316 !important; }
  tr.zone-uecl td.pos { border-left: 3px solid #14b8a6 !important; }
  tr.zone-playoff td.pos { border-left: 3px solid #eab308 !important; }
  tr.zone-relegation td.pos { border-left: 3px solid #ef4444 !important; }
  
  tr.zone-cl-direct td.pos { border-left: 3px solid #10b981 !important; }
  tr.zone-cl-playoff td.pos { border-left: 3px solid #3b82f6 !important; }

  /* Knockout Bracket styling */
  .knockout-section {
    margin-top: 3rem;
  }

  .knockout-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .knockout-header h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0;
  }

  .knockout-icon {
    color: var(--primary);
  }

  .bracket-container {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    padding: 2.5rem 1.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    height: 880px;
    scrollbar-width: thin;
    box-shadow: var(--shadow-sm);
  }

  .bracket-column {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 210px;
    height: 100%;
  }

  .round-title {
    font-size: 0.85rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    text-align: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border);
  }

  .matches-list {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
  }

  .bracket-match-card {
    background: var(--bg-color);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.75rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .bracket-match-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: rgba(220, 38, 38, 0.35);
  }

  .highlight-match {
    border-color: rgba(220, 38, 38, 0.25);
    background: linear-gradient(180deg, rgba(220, 38, 38, 0.02) 0%, transparent 100%);
  }

  .match-teams-box {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .team-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .team-row.winner {
    font-weight: 700;
    color: var(--text-main);
  }

  .team-row.loser {
    opacity: 0.5;
  }

  .crest-xs {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }

  .team-name-xs {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .score-xs {
    font-weight: 700;
    min-width: 16px;
    text-align: right;
  }

  .match-meta-xs {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.4rem;
    padding-top: 0.4rem;
    border-top: 1px solid var(--border);
  }

  .agg-badge {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--text-muted);
    background: rgba(0, 0, 0, 0.03);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }

  .final-card {
    border: 2px solid var(--primary);
    background: rgba(220, 38, 38, 0.03);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
  }

  .final-meta {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.25rem;
    font-size: 0.72rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .final-venue, .final-date {
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .standings-page {
      padding: 1rem;
    }
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }
    .table-switcher {
      width: 100%;
    }
    .switch-btn {
      flex: 1;
    }
  }

  /* Clickable Table Rows */
  .clickable-row {
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;
  }

  .clickable-row:hover {
    background-color: rgba(220, 38, 38, 0.05) !important;
    transform: translateY(-1px);
  }

  .clickable-row:active {
    transform: translateY(0);
  }

  /* Interactive Premium Modal Styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 1.5rem;
  }

  .modal-content {
    background: var(--surface);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 650px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border-top: 6px solid var(--club-color);
    position: relative;
    overflow: hidden;
    color: var(--text-main);
  }

  .close-btn {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: rgba(15, 23, 42, 0.05);
    border: none;
    font-size: 1.75rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .close-btn:hover {
    background: rgba(220, 38, 38, 0.1);
    color: var(--primary);
  }

  .modal-header-banner {
    padding: 3rem 2rem 2rem;
    background: linear-gradient(180deg, rgba(220, 38, 38, 0.02) 0%, transparent 100%);
    text-align: center;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-crest {
    width: 90px;
    height: 90px;
    object-fit: contain;
    margin-bottom: 1.25rem;
    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));
    transition: transform 0.3s ease;
  }

  .modal-crest:hover {
    transform: scale(1.08) rotate(3deg);
  }

  .club-title {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0 0 0.5rem;
    letter-spacing: -0.02em;
    color: var(--text-main);
  }

  .club-subtitle {
    font-size: 0.9375rem;
    color: var(--text-muted);
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .modal-body-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 2rem;
    background: #fafafa;
  }

  @media (max-width: 640px) {
    .modal-body-grid {
      grid-template-columns: 1fr;
    }
  }

  .modal-section-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
  }

  .modal-section-card h4 {
    margin: 0 0 1.25rem;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-main);
    border-bottom: 2px solid rgba(15, 23, 42, 0.05);
    padding-bottom: 0.5rem;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(15, 23, 42, 0.03);
    font-size: 0.9375rem;
  }

  .info-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .info-row .lbl {
    color: var(--text-muted);
    font-weight: 500;
  }

  .info-row .val {
    font-weight: 700;
    color: var(--text-main);
  }

  .ranking-value {
    color: var(--primary) !important;
  }

  .pts-value {
    font-size: 1.1rem;
    color: var(--text-main);
  }

  .animate-in {
    animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
