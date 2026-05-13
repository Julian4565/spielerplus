<script lang="ts">
  import { footballData } from '$lib/stores/footballStore.svelte.ts';
  import Card from '$lib/components/ui/Card.svelte';
  import { BarChart3, Trophy, ChevronRight } from 'lucide-svelte';

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
</script>

<div class="standings-page animate-in">
  <header class="page-header">
    <div class="header-content">
      <h1 class="page-title">League Standings</h1>
      <p class="page-subtitle">Current position and performance across competitions</p>
    </div>
    
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
                <tr class:highlight={row.team.id === BAYERN_ID}>
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
                  <tr class:highlight={row.team.id === BAYERN_ID}>
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

<style>
  .standings-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
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
</style>
