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
      // CL is usually a list of groups
      return footballData.standings.cl?.standings || [];
    }
  }

  const clubDetailsMap: Record<string, any> = {
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
    '1. FC Union Berlin': { founded: 1966, stadium: 'An der Alten Försterei', capacity: '22,012', manager: 'Bo Svensson', league: 'Bundesliga', color: '#dc2626' },
    'Union Berlin': { founded: 1966, stadium: 'An der Alten Försterei', capacity: '22,012', manager: 'Bo Svensson', league: 'Bundesliga', color: '#dc2626' },
    'Real Madrid CF': { founded: 1902, stadium: 'Santiago Bernabéu', capacity: '81,044', manager: 'Carlo Ancelotti', league: 'La Liga', color: '#3b82f6' },
    'Real Madrid': { founded: 1902, stadium: 'Santiago Bernabéu', capacity: '81,044', manager: 'Carlo Ancelotti', league: 'La Liga', color: '#3b82f6' },
    'Manchester City FC': { founded: 1880, stadium: 'Etihad Stadium', capacity: '53,400', manager: 'Pep Guardiola', league: 'Premier League', color: '#0ea5e9' },
    'Man City': { founded: 1880, stadium: 'Etihad Stadium', capacity: '53,400', manager: 'Pep Guardiola', league: 'Premier League', color: '#0ea5e9' },
    'Arsenal FC': { founded: 1886, stadium: 'Emirates Stadium', capacity: '60,704', manager: 'Mikel Arteta', league: 'Premier League', color: '#ef4444' },
    'Arsenal': { founded: 1886, stadium: 'Emirates Stadium', capacity: '60,704', manager: 'Mikel Arteta', league: 'Premier League', color: '#ef4444' },
    'Paris Saint-Germain FC': { founded: 1970, stadium: 'Parc des Princes', capacity: '47,929', manager: 'Luis Enrique', league: 'Ligue 1', color: '#1e3a8a' },
    'PSG': { founded: 1970, stadium: 'Parc des Princes', capacity: '47,929', manager: 'Luis Enrique', league: 'Ligue 1', color: '#1e3a8a' },
    'Liverpool FC': { founded: 1892, stadium: 'Anfield', capacity: '61,276', manager: 'Arne Slot', league: 'Premier League', color: '#b91c1c' },
    'Liverpool': { founded: 1892, stadium: 'Anfield', capacity: '61,276', manager: 'Arne Slot', league: 'Premier League', color: '#b91c1c' }
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
    {#if activeTable === 'bundesliga'}
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
                <tr class:highlight={row.team.id === BAYERN_ID} class="clickable-row" onclick={() => openClubDetails(row.team, row)}>
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
    {:else}
      <!-- CL Groups -->
      <div class="groups-grid">
        {#each getTableData() as group}
          <Card class="group-card">
            <h3 class="group-name">{group.group.replace('_', ' ')}</h3>
            <table class="group-table">
              <tbody>
                {#each group.table as row}
                  <tr class:highlight={row.team.id === BAYERN_ID} class="clickable-row" onclick={() => openClubDetails(row.team, row)}>
                    <td class="pos">{row.position}</td>
                    <td class="team">
                      <img src={row.team.crest} alt="" class="crest-sm" />
                      <span>{row.team.tla || row.team.shortName}</span>
                    </td>
                    <td class="pts">{row.points}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </Card>
        {/each}
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

  /* Groups Grid */
  .groups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .group-name {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary);
    color: var(--text-main);
  }

  .group-table {
    width: 100%;
  }

  .group-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }

  .crest-sm {
    width: 20px;
    height: 20px;
    object-fit: contain;
    margin-right: 0.5rem;
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
