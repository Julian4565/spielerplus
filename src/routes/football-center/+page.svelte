<script lang="ts">
  import { onMount } from 'svelte';
  import { footballData, refreshFootballData } from '$lib/stores/footballStore.svelte.ts';
  import Card from '$lib/components/ui/Card.svelte';
  import { Activity, Calendar, Trophy, Clock, MapPin, Info, ChevronRight } from 'lucide-svelte';

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onMount(() => {
    if (!footballData.lastUpdated) {
      refreshFootballData();
    }
  });

  let showDiagnostics = $state(false);
</script>

<div class="football-center-page animate-in">
  <header class="page-header">
    <div class="header-content">
      <h1 class="page-title">Football Center</h1>
      <p class="page-subtitle">Live scores, upcoming fixtures and recent results for FC Bayern</p>
      
      {#if footballData.lastUpdated}
        <div class="last-updated">
          Last synced: {new Date(footballData.lastUpdated).toLocaleTimeString()}
        </div>
      {/if}
    </div>
    
    <div class="header-actions">
      <button class="diagnostic-btn" onclick={() => showDiagnostics = !showDiagnostics}>
        <Info size={16} />
      </button>

      {#if footballData.error}
        <div class="error-badge">
          <span>Error loading data: {footballData.error}</span>
          <button onclick={() => refreshFootballData()} class="retry-btn">Retry</button>
        </div>
      {/if}
      
      <button 
        class="refresh-btn" 
        onclick={() => refreshFootballData()} 
        disabled={footballData.loading}
      >
        <Activity size={16} class={footballData.loading ? 'spin' : ''} />
        <span>{footballData.loading ? 'Updating...' : 'Refresh Data'}</span>
      </button>
    </div>
  </header>

  {#if showDiagnostics}
    <div class="diagnostics-panel animate-in">
      <h3>API Diagnostics</h3>
      <div class="diag-grid">
        <div class="diag-item">
          <span class="label">Status:</span>
          <span class="value" class:text-success={!footballData.error} class:text-error={!!footballData.error}>
            {footballData.error ? 'Error' : 'Connected'}
          </span>
        </div>
        <div class="diag-item">
          <span class="label">Fixtures:</span>
          <span class="value">{footballData.fixtures.length}</span>
        </div>
        <div class="diag-item">
          <span class="label">Results:</span>
          <span class="value">{footballData.results.length}</span>
        </div>
        <div class="diag-item">
          <span class="label">Standings:</span>
          <span class="value">
            BL: {footballData.standings.bundesliga ? 'OK' : 'None'} | 
            CL: {footballData.standings.cl ? 'OK' : 'None'}
          </span>
        </div>
      </div>
      <div class="raw-data-preview">
        <h4>Raw Data Sample (First Fixture):</h4>
        <pre>{JSON.stringify(footballData.fixtures[0], null, 2) || 'No data'}</pre>
      </div>
    </div>
  {/if}

  <div class="center-grid">
    <!-- Live & Upcoming Section -->
    <section class="main-section">
      <div class="section-header">
        <Activity size={20} class="section-icon" />
        <h2>Upcoming Matches</h2>
      </div>

      {#if footballData.fixtures.length > 0}
        <div class="fixtures-list">
          {#each footballData.fixtures.slice(0, 10) as match}
            <Card class="match-card hover-scale">
              <div class="match-header">
                <div class="competition">
                  <img src={match.competition.emblem} alt={match.competition.name} class="comp-logo" />
                  <span>{match.competition.name}</span>
                </div>
                <div class="match-date">{formatDate(match.utcDate)}</div>
              </div>

              <div class="match-teams">
                <div class="team home">
                  <img src={match.homeTeam.crest} alt={match.homeTeam.name} class="team-logo" />
                  <span class="team-name">{match.homeTeam.shortName || match.homeTeam.name}</span>
                </div>
                <div class="match-vs">
                  <span class="vs">VS</span>
                </div>
                <div class="team away">
                  <img src={match.awayTeam.crest} alt={match.awayTeam.name} class="team-logo" />
                  <span class="team-name">{match.awayTeam.shortName || match.awayTeam.name}</span>
                </div>
              </div>

              <div class="match-footer">
                <div class="match-info">
                  <MapPin size={14} />
                  <span>{match.venue || 'TBA'}</span>
                </div>
                <div class="match-status-badge">Scheduled</div>
              </div>
            </Card>
          {/each}
        </div>
      {:else if footballData.loading}
        <div class="empty-state">
          <div class="shimmer-match"></div>
          <div class="shimmer-match"></div>
        </div>
      {:else}
        <div class="empty-state">
          <p>No upcoming matches found.</p>
        </div>
      {/if}
    </section>

    <!-- Recent Results Sidebar -->
    <aside class="side-section">
      <div class="section-header">
        <Trophy size={20} class="section-icon" />
        <h2>Recent Results</h2>
      </div>

      <div class="results-list">
        {#each footballData.results.slice(0, 5) as match}
          <Card class="result-card">
            <div class="result-teams">
              <div class="res-team">
                <img src={match.homeTeam.crest} alt="" class="team-logo-sm" />
                <span class:winner={match.score.fullTime.home > match.score.fullTime.away}>
                  {match.homeTeam.tla || match.homeTeam.shortName}
                </span>
              </div>
              <div class="res-score">
                {match.score.fullTime.home} - {match.score.fullTime.away}
              </div>
              <div class="res-team">
                <img src={match.awayTeam.crest} alt="" class="team-logo-sm" />
                <span class:winner={match.score.fullTime.away > match.score.fullTime.home}>
                  {match.awayTeam.tla || match.awayTeam.shortName}
                </span>
              </div>
            </div>
            <div class="result-meta">
              {match.competition.name} • {new Date(match.utcDate).toLocaleDateString()}
            </div>
          </Card>
        {/each}
      </div>

      <div class="news-section">
        <div class="section-header mt-8">
          <Activity size={20} class="section-icon" />
          <h2>Latest Club News</h2>
        </div>
        
        <Card noPadding class="news-main-card hover-scale">
          <div class="news-image-container">
            <img src="/allianz_arena_matchday_1778668623552.png" alt="Allianz Arena" class="news-hero-img" />
            <div class="news-overlay">
              <span class="news-tag">Matchday</span>
            </div>
          </div>
          <div class="news-content">
            <h3>Preparations for the upcoming match at Allianz Arena</h3>
            <p>The team is in high spirits after the recent training sessions. Fans are expecting a sell-out crowd.</p>
            <div class="news-footer">
              <span>2 hours ago</span>
              <button class="read-more">Read More <ChevronRight size={14}/></button>
            </div>
          </div>
        </Card>

        <div class="mini-news-list">
          <div class="mini-news-item">
            <div class="mini-img-box"></div>
            <div class="mini-content">
              <h4>Training Report: Focus on tactical awareness</h4>
              <span>Today • 10:45 AM</span>
            </div>
          </div>
          <div class="mini-news-item">
            <div class="mini-img-box"></div>
            <div class="mini-content">
              <h4>Interview: Captain speaks on title ambitions</h4>
              <span>Yesterday • 4:20 PM</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</div>

<style>
  .football-center-page {
    padding: 2rem;
    max-width: 1400px;
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
  }

  .last-updated {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 600;
    margin-top: 0.25rem;
  }

  .diagnostic-btn {
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

  .diagnostic-btn:hover {
    color: var(--primary);
    border-color: var(--primary);
  }

  .diagnostics-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-md);
  }

  .diagnostics-panel h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-main);
  }

  .diag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .diag-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--bg-color);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
  }

  .diag-item .label {
    color: var(--text-muted);
    font-weight: 600;
  }

  .diag-item .value {
    font-weight: 700;
    color: var(--text-main);
  }

  .text-success { color: #10b981; }
  .text-error { color: #ef4444; }

  .raw-data-preview {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  .raw-data-preview h4 {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .raw-data-preview pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    overflow-x: auto;
    max-height: 200px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--surface);
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--border);
    font-weight: 700;
    color: var(--primary);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: var(--transition);
  }

  .refresh-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    background: var(--bg-color);
  }

  .refresh-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error-badge {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #fef2f2;
    color: #991b1b;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    border: 1px solid #fee2e2;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .retry-btn {
    background: #991b1b;
    color: white;
    border: none;
    padding: 0.3rem 0.8rem;
    border-radius: var(--radius-sm);
    font-weight: 700;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .retry-btn:hover {
    background: #7f1d1d;
  }

  .spin {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .center-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2.5rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .section-icon {
    color: var(--primary);
  }

  .fixtures-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  :global(.match-card) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    background: linear-gradient(145deg, var(--surface) 0%, var(--bg-color) 100%);
  }

  .match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .competition {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-main);
  }

  .comp-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .match-date {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .match-teams {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }

  .team {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .team-logo {
    width: 70px;
    height: 70px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
  }

  .team-name {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text-main);
  }

  .match-vs {
    padding: 0 1.5rem;
  }

  .vs {
    font-weight: 900;
    color: var(--text-muted);
    font-size: 0.9rem;
    opacity: 0.5;
  }

  .match-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  .match-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .match-status-badge {
    background: rgba(220, 38, 38, 0.1);
    color: var(--primary);
    padding: 0.4rem 0.8rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Results Sidebar Styles */
  .results-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  :global(.result-card) {
    padding: 1.25rem;
  }

  .result-teams {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .res-team {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    font-size: 0.95rem;
    flex: 1;
  }

  .res-team:last-child {
    justify-content: flex-end;
  }

  .team-logo-sm {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .res-score {
    font-weight: 800;
    background: var(--bg-color);
    padding: 0.3rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    color: var(--text-main);
    margin: 0 0.75rem;
  }

  .winner {
    color: var(--primary);
    font-weight: 700;
  }

  .result-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-align: center;
  }

  /* News Section Styles */
  .news-section {
    margin-top: 2rem;
  }

  .mt-8 { margin-top: 2rem; }

  .news-main-card {
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .news-image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  .news-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .news-main-card:hover .news-hero-img {
    transform: scale(1.05);
  }

  .news-overlay {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  .news-tag {
    background: var(--primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .news-content {
    padding: 1.5rem;
  }

  .news-content h3 {
    font-size: 1.1rem;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 0.75rem;
    color: var(--text-main);
  }

  .news-content p {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 1.25rem;
  }

  .news-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .read-more {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }

  .mini-news-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mini-news-item {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem;
    background: var(--surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    transition: var(--transition);
    cursor: pointer;
  }

  .mini-news-item:hover {
    border-color: var(--primary);
    background: var(--bg-color);
  }

  .mini-img-box {
    width: 60px;
    height: 60px;
    background: var(--bg-color);
    border-radius: var(--radius-sm);
    flex-shrink: 0;
  }

  .mini-content h4 {
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: var(--text-main);
    line-height: 1.3;
  }

  .mini-content span {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  @media (max-width: 1200px) {
    .center-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .football-center-page {
      padding: 1rem;
    }
    
    .fixtures-list {
      grid-template-columns: 1fr;
    }

    .page-header {
      flex-direction: column;
      gap: 1.5rem;
    }
  }
</style>
