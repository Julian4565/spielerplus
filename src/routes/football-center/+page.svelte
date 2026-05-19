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

  let matchTab = $state<'overview'|'lineups'|'analysis'>('overview');

  function openMatchDetails(match: any) {
    const isFinished = match.status === 'FINISHED' || match.status === 'finished' ||
      (match.score && match.score.fullTime && match.score.fullTime.home !== null);

    const isBayernHome = match.homeTeam?.name?.includes('Bayern') ||
                         match.homeTeam?.shortName?.includes('Bayern');

    const winPctHome = isBayernHome ? 62 : 38;
    const winPctAway = 100 - winPctHome - 18;

    const stats = isFinished ? {
      possessionHome: isBayernHome ? 58 : 42,
      possessionAway: isBayernHome ? 42 : 58,
      shotsHome: isBayernHome ? 16 : 9,
      shotsAway: isBayernHome ? 9 : 16,
      shotsOnTargetHome: isBayernHome ? 7 : 3,
      shotsOnTargetAway: isBayernHome ? 3 : 7,
      foulsHome: 8, foulsAway: 12,
      cornersHome: isBayernHome ? 7 : 4,
      cornersAway: isBayernHome ? 4 : 7,
      xGHome: isBayernHome ? 2.34 : 1.12,
      xGAway: isBayernHome ? 1.12 : 2.34,
    } : {
      possessionHome: isBayernHome ? 56 : 44,
      possessionAway: isBayernHome ? 44 : 56,
      shotsHome: 0, shotsAway: 0, shotsOnTargetHome: 0, shotsOnTargetAway: 0,
      foulsHome: 0, foulsAway: 0, cornersHome: 0, cornersAway: 0,
      xGHome: isBayernHome ? 1.95 : 1.20,
      xGAway: isBayernHome ? 1.20 : 1.95,
    };

    // Generate realistic opponent lineup based on team name
    const opponentName = isBayernHome ? match.awayTeam?.name : match.homeTeam?.name;
    const opponentLineups: Record<string, string[]> = {
      'Real Madrid': ['Courtois (GK)', 'Carvajal', 'Rüdiger', 'Militão', 'Mendy', 'Valverde', 'Tchouaméni', 'Bellingham', 'Rodrygo', 'Mbappé', 'Vinícius Jr.'],
      'Dortmund':    ['Kobel (GK)', 'Ryerson', 'Hummels', 'Schlotterbeck', 'Maatsen', 'Can', 'Nmecha', 'Sabitzer', 'Adeyemi', 'Sancho', 'Füllkrug'],
      'Arsenal':     ['Raya (GK)', 'Ben White', 'Saliba', 'Gabriel', 'Zinchenko', 'Partey', 'Rice', 'Ødegaard', 'Saka', 'Havertz', 'Martinelli'],
      'default':     ['GK', 'RB', 'CB', 'CB', 'LB', 'DM', 'CM', 'AM', 'RW', 'ST', 'LW'],
    };
    const awayLineup = opponentLineups[
      Object.keys(opponentLineups).find(k => opponentName?.includes(k)) || 'default'
    ];

    const bayernLineup = isBayernHome
      ? ['M. Neuer (GK)', 'J. Kimmich', 'D. Upamecano', 'M. Min-jae', 'A. Davies', 'A. Pavlović', 'L. Goretzka', 'L. Sané', 'J. Musiala', 'S. Gnabry', 'H. Kane']
      : ['M. Neuer (GK)', 'J. Kimmich', 'D. Upamecano', 'M. Min-jae', 'A. Davies', 'K. De Bruyne', 'L. Goretzka', 'J. Musiala', 'L. Sané', 'H. Kane', 'S. Gnabry'];

    selectedMatch = {
      ...match,
      stats,
      isFinished,
      isBayernHome,
      winPct: { home: winPctHome, draw: 18, away: winPctAway },
      predictedScore: isBayernHome ? '2 – 1' : '1 – 2',
      goalscorers: [
        { name: 'Harry Kane', prob: 68, team: 'FCB' },
        { name: 'Jamal Musiala', prob: 54, team: 'FCB' },
        { name: 'Leroy Sané', prob: 41, team: 'FCB' },
      ],
      recentForm: {
        home: ['W','W','D','W','W'],
        away: ['L','W','D','L','W'],
      },
      tactics: {
        homeFormation: '4-2-3-1',
        awayFormation: '4-3-3',
        homeStyle: 'High Press, Possession Build-Up, Vertical Transitions',
        awayStyle: 'Counter-Attack, Deep Block, Pacey Wingers',
      },
      lineups: {
        home: isBayernHome ? bayernLineup : awayLineup,
        away: isBayernHome ? awayLineup : bayernLineup,
      }
    };
    matchTab = 'overview';
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
  <div class="modal-overlay animate-fade" role="dialog" aria-modal="true" onclick={() => selectedMatch = null}>
    <div class="match-analysis-panel animate-in" onclick={(e) => e.stopPropagation()} role="presentation">

      <!-- Header: Competition + Teams -->
      <div class="ma-header">
        <button class="ma-close" onclick={() => selectedMatch = null}>✕</button>
        <div class="ma-comp">
          <img src={selectedMatch.competition.emblem} alt="" class="ma-comp-logo" />
          <span>{selectedMatch.competition.name}</span>
          {#if selectedMatch.isFinished}
            <span class="ma-status-badge finished">Full Time</span>
          {:else}
            <span class="ma-status-badge upcoming">Upcoming</span>
          {/if}
        </div>

        <div class="ma-teams">
          <div class="ma-team">
            <img src={selectedMatch.homeTeam.crest} alt="" class="ma-crest" />
            <span class="ma-team-name">{selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name}</span>
            <span class="ma-formation">{selectedMatch.tactics.homeFormation}</span>
          </div>

          <div class="ma-center">
            {#if selectedMatch.isFinished && selectedMatch.score?.fullTime?.home !== null}
              <div class="ma-score">{selectedMatch.score.fullTime.home} – {selectedMatch.score.fullTime.away}</div>
              <div class="ma-kickoff">FT</div>
            {:else}
              <div class="ma-predicted-score">{selectedMatch.predictedScore}</div>
              <div class="ma-kickoff">{new Date(selectedMatch.utcDate).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})} KO</div>
              <div class="ma-kickoff">{new Date(selectedMatch.utcDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div>
            {/if}
          </div>

          <div class="ma-team">
            <img src={selectedMatch.awayTeam.crest} alt="" class="ma-crest" />
            <span class="ma-team-name">{selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name}</span>
            <span class="ma-formation">{selectedMatch.tactics.awayFormation}</span>
          </div>
        </div>

        <div class="ma-venue-row">
          <MapPin size={13} /> {selectedMatch.venue || 'TBA'} &nbsp;·&nbsp;
          <Calendar size={13} /> {formatDate(selectedMatch.utcDate)}
        </div>
      </div>

      <!-- Tabs -->
      <div class="ma-tabs">
        <button class="ma-tab {matchTab === 'overview' ? 'active' : ''}" onclick={() => matchTab = 'overview'}>Overview</button>
        <button class="ma-tab {matchTab === 'lineups'  ? 'active' : ''}" onclick={() => matchTab = 'lineups'}>Lineups</button>
        <button class="ma-tab {matchTab === 'analysis' ? 'active' : ''}" onclick={() => matchTab = 'analysis'}>Analysis</button>
      </div>

      <div class="ma-body">

        <!-- ── OVERVIEW TAB ─────────────────────────────── -->
        {#if matchTab === 'overview'}
          <!-- Win Probability -->
          {#if !selectedMatch.isFinished}
          <div class="ma-widget">
            <h4 class="ma-widget-title">🏆 Win Probability</h4>
            <div class="win-prob-bar">
              <div class="wp-home" style="width:{selectedMatch.winPct.home}%">{selectedMatch.winPct.home}%</div>
              <div class="wp-draw" style="width:{selectedMatch.winPct.draw}%">{selectedMatch.winPct.draw}%</div>
              <div class="wp-away" style="width:{selectedMatch.winPct.away}%">{selectedMatch.winPct.away}%</div>
            </div>
            <div class="wp-labels">
              <span>{selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name}</span>
              <span>Draw</span>
              <span>{selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name}</span>
            </div>
            <div class="predicted-result-strip">
              <span class="pr-label">Predicted Result</span>
              <span class="pr-score">{selectedMatch.predictedScore}</span>
            </div>
          </div>
          {/if}

          <!-- xG / Key Stats -->
          <div class="ma-widget">
            <h4 class="ma-widget-title">📊 {selectedMatch.isFinished ? 'Match Statistics' : 'Expected Statistics (xG)'}</h4>
            <div class="dual-stat-row">
              <span class="ds-val home">{selectedMatch.stats.xGHome.toFixed(2)}</span>
              <span class="ds-label">xGoals (xG)</span>
              <span class="ds-val away">{selectedMatch.stats.xGAway.toFixed(2)}</span>
            </div>
            <div class="dual-stat-row">
              <span class="ds-val home">{selectedMatch.stats.possessionHome}%</span>
              <div class="ds-bar-wrap">
                <div class="ds-bar-label">Possession</div>
                <div class="ds-dual-bar">
                  <div class="ds-bar-left"  style="width:{selectedMatch.stats.possessionHome}%"></div>
                  <div class="ds-bar-right" style="width:{selectedMatch.stats.possessionAway}%"></div>
                </div>
              </div>
              <span class="ds-val away">{selectedMatch.stats.possessionAway}%</span>
            </div>
            <div class="dual-stat-row">
              <span class="ds-val home">{selectedMatch.stats.shotsHome}</span>
              <span class="ds-label">Total Shots</span>
              <span class="ds-val away">{selectedMatch.stats.shotsAway}</span>
            </div>
            <div class="dual-stat-row">
              <span class="ds-val home">{selectedMatch.stats.shotsOnTargetHome}</span>
              <span class="ds-label">Shots on Target</span>
              <span class="ds-val away">{selectedMatch.stats.shotsOnTargetAway}</span>
            </div>
            <div class="dual-stat-row">
              <span class="ds-val home">{selectedMatch.stats.cornersHome}</span>
              <span class="ds-label">Corners</span>
              <span class="ds-val away">{selectedMatch.stats.cornersAway}</span>
            </div>
          </div>

          <!-- Recent Form -->
          <div class="ma-widget">
            <h4 class="ma-widget-title">📈 Recent Form (Last 5)</h4>
            <div class="form-guide-row">
              <span class="form-team-lbl">{selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name}</span>
              <div class="form-bubbles">
                {#each selectedMatch.recentForm.home as r}
                  <span class="form-dot {r === 'W' ? 'fw' : r === 'D' ? 'fd' : 'fl'}">{r}</span>
                {/each}
              </div>
            </div>
            <div class="form-guide-row">
              <span class="form-team-lbl">{selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name}</span>
              <div class="form-bubbles">
                {#each selectedMatch.recentForm.away as r}
                  <span class="form-dot {r === 'W' ? 'fw' : r === 'D' ? 'fd' : 'fl'}">{r}</span>
                {/each}
              </div>
            </div>
          </div>

        <!-- ── LINEUPS TAB ───────────────────────────────── -->
        {:else if matchTab === 'lineups'}
          <div class="ma-widget">
            <div class="lineups-grid">
              <div class="lineup-col">
                <h5 class="lineup-heading home-heading">{selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name}</h5>
                <div class="lineup-badge">{selectedMatch.tactics.homeFormation}</div>
                <ol class="lineup-list">
                  {#each selectedMatch.lineups.home as player, i}
                    <li class="lineup-player {i === 0 ? 'gk-row' : ''}">
                      <span class="pl-num">{i + 1}</span>
                      <span class="pl-name">{player}</span>
                    </li>
                  {/each}
                </ol>
              </div>
              <div class="lineup-divider"></div>
              <div class="lineup-col">
                <h5 class="lineup-heading away-heading">{selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name}</h5>
                <div class="lineup-badge">{selectedMatch.tactics.awayFormation}</div>
                <ol class="lineup-list">
                  {#each selectedMatch.lineups.away as player, i}
                    <li class="lineup-player {i === 0 ? 'gk-row' : ''}">
                      <span class="pl-num">{i + 1}</span>
                      <span class="pl-name">{player}</span>
                    </li>
                  {/each}
                </ol>
              </div>
            </div>
          </div>

        <!-- ── ANALYSIS TAB ──────────────────────────────── -->
        {:else if matchTab === 'analysis'}
          <!-- Goalscorer Predictions -->
          <div class="ma-widget">
            <h4 class="ma-widget-title">⚽ Anytime Goalscorer Predictions</h4>
            {#each selectedMatch.goalscorers as gs}
              <div class="goalscorer-row">
                <span class="gs-name">{gs.name}</span>
                <div class="gs-bar-track">
                  <div class="gs-bar-fill" style="width:{gs.prob}%"></div>
                </div>
                <span class="gs-prob">{gs.prob}%</span>
              </div>
            {/each}
          </div>

          <!-- Tactical Overview -->
          <div class="ma-widget">
            <h4 class="ma-widget-title">🧠 Tactical Preview</h4>
            <div class="tactic-block home-tactic">
              <div class="tactic-team">{selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name} · {selectedMatch.tactics.homeFormation}</div>
              <p class="tactic-desc">{selectedMatch.tactics.homeStyle}</p>
            </div>
            <div class="tactic-block away-tactic">
              <div class="tactic-team">{selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name} · {selectedMatch.tactics.awayFormation}</div>
              <p class="tactic-desc">{selectedMatch.tactics.awayStyle}</p>
            </div>
          </div>

          <!-- Key Matchup -->
          <div class="ma-widget key-matchup">
            <h4 class="ma-widget-title">⚡ Key Player Matchup</h4>
            <div class="matchup-row">
              <div class="matchup-player">
                <span class="mp-name">Harry Kane</span>
                <span class="mp-stat">12G / 6A this season</span>
              </div>
              <div class="matchup-vs">VS</div>
              <div class="matchup-player away">
                <span class="mp-name">Opponent CB</span>
                <span class="mp-stat">Aerial duels: 68%</span>
              </div>
            </div>
            <div class="matchup-row">
              <div class="matchup-player">
                <span class="mp-name">Jamal Musiala</span>
                <span class="mp-stat">87 dribbles completed</span>
              </div>
              <div class="matchup-vs">VS</div>
              <div class="matchup-player away">
                <span class="mp-name">Opp. RB</span>
                <span class="mp-stat">1.8 fouls / game</span>
              </div>
            </div>
          </div>
        {/if}

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
      from { opacity: 0; transform: scale(0.95) translateY(15px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* ── Match Analysis Panel ─────────────────────────────── */
    .match-analysis-panel {
      background: var(--surface);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 600px;
      max-height: 92vh;
      overflow-y: auto;
      box-shadow: 0 30px 60px -10px rgba(0,0,0,0.6);
      border: 1px solid var(--border);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .ma-header {
      background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 1.5rem 1.75rem 1.25rem;
      position: relative;
      flex-shrink: 0;
    }

    .ma-close {
      position: absolute; top: 1rem; right: 1rem;
      background: rgba(255,255,255,0.1); border: none;
      color: white; width: 30px; height: 30px; border-radius: 50%;
      cursor: pointer; font-size: 0.875rem; display: flex;
      align-items: center; justify-content: center; transition: background 0.2s;
    }
    .ma-close:hover { background: rgba(220,38,38,0.5); }

    .ma-comp {
      display: flex; align-items: center; gap: 0.5rem;
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; opacity: 0.75; margin-bottom: 1rem;
    }
    .ma-comp-logo { width: 18px; height: 18px; object-fit: contain; }

    .ma-status-badge {
      padding: 0.15rem 0.6rem; border-radius: 9999px;
      font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
      letter-spacing: 0.06em; margin-left: auto;
    }
    .ma-status-badge.finished  { background: rgba(5,150,105,0.25); color: #34d399; }
    .ma-status-badge.upcoming  { background: rgba(220,38,38,0.25); color: #fca5a5; }

    .ma-teams {
      display: grid; grid-template-columns: 1fr auto 1fr;
      align-items: center; gap: 1rem; margin-bottom: 1rem;
    }

    .ma-team {
      display: flex; flex-direction: column; align-items: center; gap: 0.375rem;
    }
    .ma-crest { width: 54px; height: 54px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3)); }
    .ma-team-name { font-size: 0.9375rem; font-weight: 800; text-align: center; }
    .ma-formation { font-size: 0.7rem; opacity: 0.55; font-weight: 700; }

    .ma-center { text-align: center; }
    .ma-score {
      font-size: 2.75rem; font-weight: 900; letter-spacing: -0.04em;
      line-height: 1; text-shadow: 0 2px 12px rgba(220,38,38,0.4);
      color: #ff4d4d;
    }
    .ma-predicted-score {
      font-size: 1.5rem; font-weight: 900; letter-spacing: -0.02em;
      opacity: 0.65; font-style: italic;
    }
    .ma-kickoff { font-size: 0.7375rem; opacity: 0.6; font-weight: 600; margin-top: 0.2rem; }

    .ma-venue-row {
      display: flex; align-items: center; gap: 0.4rem;
      font-size: 0.75rem; opacity: 0.55; font-weight: 500;
    }

    /* Tabs */
    .ma-tabs {
      display: grid; grid-template-columns: repeat(3, 1fr);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .ma-tab {
      padding: 0.875rem; background: none; border: none;
      font-size: 0.875rem; font-weight: 700; color: var(--text-muted);
      cursor: pointer; transition: all 0.15s; font-family: inherit;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
    }
    .ma-tab:hover { color: var(--text-main); background: rgba(15,23,42,0.03); }
    .ma-tab.active { color: var(--primary); border-bottom-color: var(--primary); }

    /* Body */
    .ma-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; }

    .ma-widget {
      background: white; border: 1px solid var(--border);
      border-radius: var(--radius-md); padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .ma-widget-title {
      font-size: 0.9375rem; font-weight: 800; margin: 0 0 1rem;
      color: var(--text-main); letter-spacing: -0.01em;
    }

    /* Win probability bar */
    .win-prob-bar {
      display: flex; height: 36px; border-radius: var(--radius-sm);
      overflow: hidden; gap: 2px;
    }
    .wp-home { background: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: white; transition: width 0.6s ease; }
    .wp-draw { background: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: white; }
    .wp-away { background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: white; }
    .wp-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-top: 0.5rem; }

    .predicted-result-strip {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 1rem; padding: 0.625rem 0.875rem;
      background: rgba(220,38,38,0.04); border: 1px dashed rgba(220,38,38,0.2);
      border-radius: var(--radius-sm);
    }
    .pr-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
    .pr-score { font-size: 1.25rem; font-weight: 900; color: var(--primary); }

    /* Dual stats */
    .dual-stat-row {
      display: grid; grid-template-columns: 60px 1fr 60px;
      align-items: center; gap: 0.5rem; padding: 0.5rem 0;
      border-bottom: 1px solid rgba(15,23,42,0.04);
    }
    .dual-stat-row:last-child { border-bottom: none; }
    .ds-val { font-weight: 800; font-size: 1rem; }
    .ds-val.home { text-align: right; color: #dc2626; }
    .ds-val.away { text-align: left; color: #1e293b; }
    .ds-label { text-align: center; font-size: 0.8125rem; color: var(--text-muted); font-weight: 600; }
    .ds-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
    .ds-bar-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
    .ds-dual-bar { display: flex; height: 6px; border-radius: 9999px; overflow: hidden; width: 100%; background: #e2e8f0; gap: 1px; }
    .ds-bar-left  { background: #dc2626; border-radius: 9999px 0 0 9999px; transition: width 0.5s; }
    .ds-bar-right { background: #1e293b; border-radius: 0 9999px 9999px 0; transition: width 0.5s; }

    /* Form guide */
    .form-guide-row { display: flex; align-items: center; gap: 0.875rem; padding: 0.5rem 0; }
    .form-guide-row:not(:last-child) { border-bottom: 1px solid var(--border); }
    .form-team-lbl { font-size: 0.8125rem; font-weight: 700; color: var(--text-muted); width: 60px; flex-shrink: 0; }
    .form-bubbles { display: flex; gap: 0.375rem; }
    .form-dot {
      width: 28px; height: 28px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; font-size: 0.7rem;
      font-weight: 900; color: white;
    }
    .fw { background: #059669; }
    .fd { background: #94a3b8; }
    .fl { background: #dc2626; }

    /* Lineups */
    .lineups-grid { display: grid; grid-template-columns: 1fr 1px 1fr; gap: 1rem; }
    .lineup-divider { background: var(--border); }
    .lineup-col { display: flex; flex-direction: column; gap: 0.5rem; }
    .lineup-heading { font-size: 0.9375rem; font-weight: 800; margin: 0; }
    .home-heading { color: #dc2626; }
    .away-heading { color: #1e293b; }
    .lineup-badge {
      display: inline-block; padding: 0.2rem 0.6rem; border-radius: 9999px;
      background: rgba(15,23,42,0.06); font-size: 0.7rem; font-weight: 800;
      color: var(--text-muted); width: fit-content;
    }
    .lineup-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.125rem; }
    .lineup-player { display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0.4rem; border-radius: 4px; transition: background 0.1s; }
    .lineup-player:hover { background: rgba(15,23,42,0.03); }
    .gk-row { background: rgba(220,38,38,0.04) !important; font-weight: 700 !important; }
    .pl-num { font-size: 0.6875rem; color: var(--text-muted); font-weight: 700; width: 16px; }
    .pl-name { font-size: 0.8125rem; font-weight: 600; color: var(--text-main); }

    /* Goalscorer bars */
    .goalscorer-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--border); }
    .goalscorer-row:last-child { border-bottom: none; }
    .gs-name { font-size: 0.875rem; font-weight: 700; width: 130px; flex-shrink: 0; }
    .gs-bar-track { flex: 1; height: 8px; background: #f1f5f9; border-radius: 9999px; overflow: hidden; }
    .gs-bar-fill { height: 100%; background: linear-gradient(90deg, #dc2626, #ff6b6b); border-radius: 9999px; transition: width 0.6s ease; }
    .gs-prob { font-size: 0.875rem; font-weight: 800; color: var(--primary); width: 38px; text-align: right; }

    /* Tactics */
    .tactic-block { padding: 0.875rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem; }
    .home-tactic { background: rgba(220,38,38,0.04); border-left: 3px solid #dc2626; }
    .away-tactic { background: rgba(15,23,42,0.04); border-left: 3px solid #1e293b; }
    .tactic-team { font-size: 0.8125rem; font-weight: 800; margin-bottom: 0.375rem; color: var(--text-main); }
    .tactic-desc { font-size: 0.8125rem; color: var(--text-muted); font-weight: 500; margin: 0; line-height: 1.5; }

    /* Key matchup */
    .matchup-row { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
    .matchup-row:last-child { border-bottom: none; }
    .matchup-player { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
    .matchup-player.away { text-align: right; align-items: flex-end; }
    .matchup-vs { font-size: 0.7rem; font-weight: 900; color: var(--text-muted); background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 4px; }
    .mp-name { font-size: 0.875rem; font-weight: 800; color: var(--text-main); }
    .mp-stat { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
  </style>
