<script lang="ts">
  import { onMount } from 'svelte';
  import { footballData, refreshFootballData } from '$lib/stores/footballStore.svelte.ts';
  import Card from '$lib/components/ui/Card.svelte';
  import { Activity, Calendar, Trophy, Clock, MapPin, Info, ChevronRight } from 'lucide-svelte';
  import { base } from '$app/paths';

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
  let selectedMatch = $state<any>(null);
  let selectedArticle = $state<any>(null);

  function openArticle(article: any) {
    selectedArticle = article;
  }

  function openMatchDetails(match: any) {
    const isFinished = match.status === 'FINISHED' || match.status === 'finished' || (match.score && match.score.fullTime && match.score.fullTime.home !== null);
    
    // Generate realistic, consistent match stats
    const stats = isFinished ? {
      possessionHome: 58,
      possessionAway: 42,
      shotsHome: 16,
      shotsAway: 9,
      shotsOnTargetHome: 7,
      shotsOnTargetAway: 3,
      foulsHome: 8,
      foulsAway: 12,
      cornersHome: 6,
      cornersAway: 4,
    } : {
      possessionHome: 50,
      possessionAway: 50,
      shotsHome: 0,
      shotsAway: 0,
      shotsOnTargetHome: 0,
      shotsOnTargetAway: 0,
      foulsHome: 0,
      foulsAway: 0,
      cornersHome: 0,
      cornersAway: 0,
    };
    
    selectedMatch = {
      ...match,
      stats,
      lineups: {
        home: ['M. Neuer (GK)', 'J. Kimmich', 'D. Upamecano', 'M. Min-jae', 'A. Davies', 'A. Pavlović', 'L. Goretzka', 'L. Sané', 'J. Musiala', 'S. Gnabry', 'H. Kane'],
        away: ['Courtois (GK)', 'Carvajal', 'Rüdiger', 'Militão', 'Mendy', 'Valverde', 'Tchouaméni', 'Bellingham', 'Rodrygo', 'Mbappé', 'Vinícius Jr.']
      }
    };
  }
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
            <Card class="match-card hover-scale clickable-card" onclick={() => openMatchDetails(match)}>
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
          <Card class="result-card hover-scale clickable-card" onclick={() => openMatchDetails(match)}>
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
          <div role="button" tabindex="0" onclick={() => openArticle({
            title: "Preparations for the upcoming match at Allianz Arena",
            tag: "Matchday",
            date: "Today • 12:00 PM",
            image: `${base}/images/Titels/Allianz Arena.avif`,
            content: "Säbener Straße is fully focused on the massive upcoming match at the Allianz Arena. Vincent Kompany led an intense tactical session this morning, emphasizing high counter-pressing and fluid possession build-up from the back. Neuer participated in full goalkeeper training, showing outstanding reflexes. With a sell-out crowd expected, the atmosphere in Munich is reaching a fever pitch. Kompany stated: 'We respect our opponent, but we are playing on our turf. The Allianz Arena will be a fortress.'"
          })} class="news-image-container cursor-pointer">
            <img src="{base}/images/Titels/Allianz Arena.avif" alt="Allianz Arena" class="news-hero-img" />
            <div class="news-overlay">
              <span class="news-tag">Matchday</span>
            </div>
          </div>
          <div class="news-content">
            <h3>Preparations for the upcoming match at Allianz Arena</h3>
            <p>The team is in high spirits after the recent training sessions. Fans are expecting a sell-out crowd.</p>
            <div class="news-footer">
              <span>2 hours ago</span>
              <button class="read-more" onclick={() => openArticle({
                title: "Preparations for the upcoming match at Allianz Arena",
                tag: "Matchday",
                date: "Today • 12:00 PM",
                image: `${base}/images/Titels/Allianz Arena.avif`,
                content: "Säbener Straße is fully focused on the massive upcoming match at the Allianz Arena. Vincent Kompany led an intense tactical session this morning, emphasizing high counter-pressing and fluid possession build-up from the back. Neuer participated in full goalkeeper training, showing outstanding reflexes. With a sell-out crowd expected, the atmosphere in Munich is reaching a fever pitch. Kompany stated: 'We respect our opponent, but we are playing on our turf. The Allianz Arena will be a fortress.'"
              })}>Read More <ChevronRight size={14}/></button>
            </div>
          </div>
        </Card>

        <div class="mini-news-list">
          <div role="button" tabindex="0" class="mini-news-item cursor-pointer" onclick={() => openArticle({
            title: "Training Report: Focus on tactical awareness",
            tag: "Training",
            date: "Today • 10:45 AM",
            image: `${base}/images/Titels/Training.avif`,
            content: "Head coach Vincent Kompany dedicated today's entire training curriculum to positional transition drills and defensive solidity. The tactical layout focused heavily on rapid recovery of possession within five seconds of loss. The coaching staff utilized digital tactical boards directly on the pitch, allowing the squad to analyze positioning in real time. Musiala and Kane showed brilliant synergy, scoring several goals in the mock scrimmage. General Director Max Eberl watched from the sidelines, expressing great satisfaction with the high level of focus shown by the entire team."
          })}>
            <div class="mini-img-box">
              <img src="{base}/images/Titels/Training.avif" alt="Training" class="mini-news-img" />
            </div>
            <div class="mini-content">
              <h4>Training Report: Focus on tactical awareness</h4>
              <span>Today • 10:45 AM</span>
            </div>
          </div>
          <div role="button" tabindex="0" class="mini-news-item cursor-pointer" onclick={() => openArticle({
            title: "Interview: Captain speaks on title ambitions",
            tag: "Interview",
            date: "Yesterday • 4:20 PM",
            image: `${base}/images/players/Manuel Neuer .png`,
            content: "Our legendary captain Manuel Neuer sat down with the media at Säbener Straße to discuss the team's objectives. Neuer emphasized the squad's hunger to reclaim the league title and push deep into the Champions League knockout stages. 'The quality in this squad is incredible,' Neuer remarked. 'Vincent Kompany has brought a very clear, ambitious vision that everyone has bought into. We are working hard every single day, keeping our feet on the ground but aiming for the absolute top. The leadership team is ready to guide the younger players through the critical upcoming fixtures.'"
          })}>
            <div class="mini-img-box">
              <img src="{base}/images/players/Manuel Neuer .png" alt="Manuel Neuer" class="mini-news-img" />
            </div>
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

{#if selectedMatch}
  <div class="modal-overlay animate-fade" onclick={() => selectedMatch = null}>
    <div class="modal-content animate-in" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => selectedMatch = null}>&times;</button>

      <div class="modal-header-banner">
        <div class="competition-badge">
          <img src={selectedMatch.competition.emblem} alt="" class="modal-comp-logo" />
          <span>{selectedMatch.competition.name}</span>
        </div>
        
        <div class="teams-versus-container">
          <div class="modal-team">
            <img src={selectedMatch.homeTeam.crest} alt="" class="modal-team-crest" />
            <span class="modal-team-name">{selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name}</span>
          </div>

          <div class="modal-score-vs">
            {#if selectedMatch.score && selectedMatch.score.fullTime && selectedMatch.score.fullTime.home !== null}
              <div class="modal-score">{selectedMatch.score.fullTime.home} - {selectedMatch.score.fullTime.away}</div>
              <div class="modal-match-status">Full Time</div>
            {:else}
              <div class="modal-vs-badge">VS</div>
              <div class="modal-match-status">Scheduled</div>
            {/if}
          </div>

          <div class="modal-team">
            <img src={selectedMatch.awayTeam.crest} alt="" class="modal-team-crest" />
            <span class="modal-team-name">{selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name}</span>
          </div>
        </div>

        <div class="modal-matchday-details">
          <div class="detail-item">
            <Calendar size={16} />
            <span>{formatDate(selectedMatch.utcDate)}</span>
          </div>
          <div class="detail-item">
            <MapPin size={16} />
            <span>{selectedMatch.venue || 'TBA'}</span>
          </div>
        </div>
      </div>

      <div class="modal-body-container">
        <div class="tabs-control">
          <h3 class="tab-title active">Match Center</h3>
        </div>

        <div class="modal-grid-content">
          <!-- Statistics -->
          <div class="modal-card-widget">
            <h4>📊 Match Statistics</h4>
            
            <div class="stat-progress-item">
              <div class="stat-lbls">
                <span>{selectedMatch.stats.possessionHome}%</span>
                <span class="stat-title">Possession</span>
                <span>{selectedMatch.stats.possessionAway}%</span>
              </div>
              <div class="dual-progress-bar">
                <div class="progress-left" style="width: {selectedMatch.stats.possessionHome}%"></div>
                <div class="progress-right" style="width: {selectedMatch.stats.possessionAway}%"></div>
              </div>
            </div>

            <div class="simple-stat-row">
              <span class="stat-val">{selectedMatch.stats.shotsHome}</span>
              <span class="stat-name">Total Shots</span>
              <span class="stat-val">{selectedMatch.stats.shotsAway}</span>
            </div>

            <div class="simple-stat-row">
              <span class="stat-val">{selectedMatch.stats.shotsOnTargetHome}</span>
              <span class="stat-name">Shots on Target</span>
              <span class="stat-val">{selectedMatch.stats.shotsOnTargetAway}</span>
            </div>

            <div class="simple-stat-row">
              <span class="stat-val">{selectedMatch.stats.cornersHome}</span>
              <span class="stat-name">Corners</span>
              <span class="stat-val">{selectedMatch.stats.cornersAway}</span>
            </div>

            <div class="simple-stat-row">
              <span class="stat-val">{selectedMatch.stats.foulsHome}</span>
              <span class="stat-name">Fouls</span>
              <span class="stat-val">{selectedMatch.stats.foulsAway}</span>
            </div>
          </div>

          <!-- Lineups -->
          <div class="modal-card-widget">
            <h4>📋 Tactical Lineups</h4>
            <div class="lineups-dual-list">
              <div class="lineup-side home-side">
                <h5>{selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name}</h5>
                <ul>
                  {#each selectedMatch.lineups.home as player}
                    <li>{player}</li>
                  {/each}
                </ul>
              </div>
              <div class="lineup-side away-side">
                <h5>{selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name}</h5>
                <ul>
                  {#each selectedMatch.lineups.away as player}
                    <li>{player}</li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if selectedArticle}
  <div class="modal-overlay animate-fade" onclick={() => selectedArticle = null}>
    <div class="modal-content animate-in" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => selectedArticle = null}>&times;</button>
      
      <div class="checkout-header-banner font-bold" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 2rem; border-radius: var(--radius-md) var(--radius-md) 0 0;">
        <div class="comp-badge-shop uppercase font-black text-xs tracking-wider" style="color: var(--primary);">
          <span>📰 Official Club Announcement</span>
        </div>
        <h2 style="color: white; font-size: 1.5rem; margin-top: 0.5rem; font-weight: 850;">{selectedArticle.title}</h2>
        <p style="opacity: 0.7; font-size: 0.8125rem; margin: 0.25rem 0 0 0;">{selectedArticle.date} • Category: {selectedArticle.tag}</p>
      </div>

      <div class="modal-body-container" style="padding: 2rem;">
        <div style="width: 100%; height: 240px; overflow: hidden; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border);">
          <img src={selectedArticle.image} alt="" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        
        <p style="font-size: 0.9375rem; line-height: 1.6; color: var(--text-main); font-weight: 550; white-space: pre-line; margin: 0;">
          {selectedArticle.content}
        </p>

        <div style="display: flex; justify-content: flex-end; margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1rem;">
          <Button variant="secondary" onclick={() => selectedArticle = null}>Close Article</Button>
        </div>
      </div>
    </div>
  </div>
{/if}

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
    overflow: hidden;
  }

  .mini-news-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

    /* Clickable Match Cards */
    .clickable-card {
      cursor: pointer;
      transition: all 0.25s ease !important;
    }

    .clickable-card:hover {
      transform: translateY(-4px) scale(1.01) !important;
      box-shadow: 0 12px 24px -6px rgba(220, 38, 38, 0.15) !important;
      border-color: rgba(220, 38, 38, 0.3) !important;
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
      max-width: 750px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      color: var(--text-main);
      border: 1px solid var(--border);
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
      padding: 3rem 2rem 2.5rem;
      background: linear-gradient(180deg, rgba(220, 38, 38, 0.04) 0%, transparent 100%);
      text-align: center;
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .competition-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(15, 23, 42, 0.05);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .modal-comp-logo {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }

    .teams-versus-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      max-width: 550px;
      margin: 1rem 0 1.5rem;
    }

    .modal-team {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .modal-team-crest {
      width: 80px;
      height: 80px;
      object-fit: contain;
      filter: drop-shadow(0 6px 12px rgba(0,0,0,0.1));
      transition: transform 0.3s ease;
    }

    .modal-team-crest:hover {
      transform: scale(1.08) rotate(2deg);
    }

    .modal-team-name {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-main);
      text-align: center;
    }

    .modal-score-vs {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 1.5rem;
    }

    .modal-score {
      font-size: 3rem;
      font-weight: 900;
      letter-spacing: -0.05em;
      color: var(--text-main);
      font-variant-numeric: tabular-nums;
    }

    .modal-match-status {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary);
      margin-top: 0.25rem;
    }

    .modal-vs-badge {
      font-size: 1.25rem;
      font-weight: 900;
      background: var(--primary);
      color: white;
      padding: 0.375rem 0.875rem;
      border-radius: var(--radius-sm);
      letter-spacing: 0.05em;
    }

    .modal-matchday-details {
      display: flex;
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .modal-body-container {
      padding: 2rem;
      background: #fafafa;
    }

    .tabs-control {
      margin-bottom: 1.5rem;
      border-bottom: 2px solid var(--border);
    }

    .tab-title.active {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-main);
      padding-bottom: 0.75rem;
      display: inline-block;
      border-bottom: 3px solid var(--primary);
      margin-bottom: -2px;
    }

    .modal-grid-content {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 640px) {
      .modal-grid-content {
        grid-template-columns: 1fr;
      }
    }

    .modal-card-widget {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    .modal-card-widget h4 {
      margin: 0 0 1.25rem;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-main);
      border-bottom: 2px solid rgba(15, 23, 42, 0.05);
      padding-bottom: 0.5rem;
    }

    /* Stat progress bar comparison */
    .stat-progress-item {
      margin-bottom: 1.5rem;
    }

    .stat-lbls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 800;
      font-size: 0.9375rem;
      color: var(--text-main);
      margin-bottom: 0.5rem;
    }

    .stat-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .dual-progress-bar {
      display: flex;
      height: 8px;
      border-radius: 999px;
      overflow: hidden;
      background: #e2e8f0;
    }

    .progress-left {
      background: var(--primary);
    }

    .progress-right {
      background: #475569;
    }

    .simple-stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(15, 23, 42, 0.03);
      font-size: 0.9375rem;
    }

    .simple-stat-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .stat-val {
      font-weight: 800;
      color: var(--text-main);
      width: 30px;
      text-align: center;
    }

    .stat-name {
      color: var(--text-muted);
      font-weight: 600;
    }

    /* Tactical Lineups */
    .lineups-dual-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .lineup-side h5 {
      font-size: 0.875rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0 0 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.25rem;
    }

    .lineup-side ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .lineup-side li {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-muted);
      padding: 0.25rem 0.5rem;
      background: #f8fafc;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(15, 23, 42, 0.02);
    }

    .home-side li {
      border-left: 3px solid var(--primary);
    }

    .away-side li {
      border-left: 3px solid #475569;
    }

    /* Animation effects */
    .animate-fade {
      animation: overlayFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .animate-in {
      animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes overlayFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(15px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  </style>
