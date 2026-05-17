<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { events } from '$lib/stores/mockData.svelte';
  import { footballData } from '$lib/stores/footballStore.svelte.ts';
  import { MapPin, Clock, Users, Check, X, HelpCircle } from 'lucide-svelte';

  let activeTab = $state('upcoming'); // upcoming, past
  
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

  function getLocalPlayers() {
    let squad = footballData.squad.length > 0 ? footballData.squad : events.flatMap(e => []); // Fallback
    // Only use players that actually have a local image mapped
    return squad
      .filter((p: any) => fileMap[p.name] !== undefined)
      .map((p: any) => ({
        name: p.name,
        avatar: `/images/players/${encodeURIComponent(fileMap[p.name])}`
      }));
  }

  let allEvents = $derived(() => {
    const localPlayers = getLocalPlayers();
    
    // Create consistent mocked attendance using the strictly available local players
    const yesPlayers = localPlayers.slice(0, Math.floor(localPlayers.length * 0.7));
    const noPlayers = localPlayers.slice(Math.floor(localPlayers.length * 0.7), Math.floor(localPlayers.length * 0.85));
    const pendingPlayers = localPlayers.slice(Math.floor(localPlayers.length * 0.85));

    const realFixtures = footballData.fixtures.map(f => ({
      id: f.id,
      title: `${f.homeTeam.shortName} vs ${f.awayTeam.shortName}`,
      date: f.utcDate.split('T')[0],
      startTime: new Date(f.utcDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      endTime: '',
      location: f.venue || 'TBA',
      type: 'match',
      status: 'upcoming',
      competition: f.competition.name,
      opponentLogo: f.homeTeam.id === 5 ? f.awayTeam.crest : f.homeTeam.crest,
      isUCL: f.competition.code === 'CL',
      userResponse: 'pending',
      responses: { yes: yesPlayers.length, no: noPlayers.length, pending: pendingPlayers.length },
      attending: yesPlayers,
      declined: noPlayers,
      pending: pendingPlayers
    }));

    const results = footballData.results.map(f => ({
      id: f.id,
      title: `${f.homeTeam.shortName} ${f.score.fullTime.home}-${f.score.fullTime.away} ${f.awayTeam.shortName}`,
      date: f.utcDate.split('T')[0],
      startTime: 'Full Time',
      endTime: '',
      location: f.venue || 'Match Result',
      type: 'match',
      status: 'past',
      competition: f.competition.name,
      opponentLogo: f.homeTeam.id === 5 ? f.awayTeam.crest : f.homeTeam.crest,
      isUCL: f.competition.code === 'CL',
      userResponse: 'yes',
      responses: { yes: localPlayers.length, no: 0, pending: 0 },
      attending: localPlayers,
      declined: [],
      pending: []
    }));

    // For mock events (trainings, tactical, recovery)
    const enrichedMockEvents = events.map(e => ({
      ...e,
      attending: yesPlayers,
      declined: noPlayers,
      pending: pendingPlayers
    }));

    return [...enrichedMockEvents, ...realFixtures, ...results];
  });

  let filteredEvents = $derived(
    allEvents().filter(e => 
      activeTab === 'upcoming' ? e.status === 'upcoming' : e.status === 'past'
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  );

  function respond(eventId: string, response: string) {
    const event = allEvents().find(e => e.id === eventId);
    if (event) {
      event.userResponse = response;
    }
  }
</script>

<div class="page-header">
  <h2>Delegation Schedule</h2>
  <Button variant="primary" class="rounded-btn">Create Event</Button>
</div>

<div class="tabs premium-tabs">
  <button 
    class="tab" 
    class:active={activeTab === 'upcoming'} 
    onclick={() => activeTab = 'upcoming'}
  >
    Scheduled
  </button>
  <button 
    class="tab" 
    class:active={activeTab === 'past'} 
    onclick={() => activeTab = 'past'}
  >
    Archive
  </button>
</div>

<div class="events-grid">
  {#each filteredEvents as event}
    <Card noPadding class="event-full-card hover-scale {event.isUCL ? 'ucl-card' : ''}">
      <div class="event-header">
        <div class="header-left">
          <div class="event-type-tag {event.type}">{event.type}</div>
          {#if event.competition}
            <span class="comp-badge">{event.competition}</span>
          {/if}
        </div>
        <div class="event-date-chip">
          {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'SHORT' })}
        </div>
      </div>
      
      <div class="event-body">
        {#if event.opponentLogo}
          <div class="opponent-visual">
            <img src={event.opponentLogo} alt="Opponent" class="opp-logo" />
            <span class="vs">VS</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg" alt="Bayern" class="opp-logo" />
          </div>
        {/if}
        <h3>{event.title}</h3>
        
        <div class="info-rows">
          <div class="info-row">
            <div class="icon-box"><Clock size={16} /></div>
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          
          <div class="info-row">
            <div class="icon-box"><MapPin size={16} /></div>
            <span>{event.location}</span>
          </div>
        </div>

        <div class="participation-summary">
          <div class="stats-labels">
            <div class="stat"><span class="dot yes"></span> {event.responses.yes} Accepted</div>
            <div class="stat"><span class="dot no"></span> {event.responses.no} Declined</div>
            <div class="stat"><span class="dot pending"></span> {event.responses.pending} Pending</div>
          </div>
          
          <div class="participation-bar">
            <div class="bar-segment yes" style="width: {(event.responses.yes / (event.responses.yes + event.responses.no + event.responses.pending)) * 100}%"></div>
            <div class="bar-segment no" style="width: {(event.responses.no / (event.responses.yes + event.responses.no + event.responses.pending)) * 100}%"></div>
            <div class="bar-segment pending" style="width: {(event.responses.pending / (event.responses.yes + event.responses.no + event.responses.pending)) * 100}%"></div>
          </div>

          <div class="attendance-avatars-section">
            {#if event.attending && event.attending.length > 0}
              <div class="avatar-group-container">
                <div class="avatar-group-label text-success">Attending ({event.attending.length})</div>
                <div class="avatar-group">
                  {#each event.attending.slice(0, 5) as player}
                    <img src={player.avatar} alt={player.name} title={player.name} class="attendance-avatar border-success" />
                  {/each}
                  {#if event.attending.length > 5}
                    <div class="attendance-avatar more-avatar">+{event.attending.length - 5}</div>
                  {/if}
                </div>
              </div>
            {/if}

            {#if event.declined && event.declined.length > 0}
              <div class="avatar-group-container">
                <div class="avatar-group-label text-danger">Unavailable ({event.declined.length})</div>
                <div class="avatar-group">
                  {#each event.declined.slice(0, 5) as player}
                    <img src={player.avatar} alt={player.name} title={player.name} class="attendance-avatar border-danger" />
                  {/each}
                  {#if event.declined.length > 5}
                    <div class="attendance-avatar more-avatar">+{event.declined.length - 5}</div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
      
      <div class="event-footer">
        <div class="response-section">
          <span class="response-title">Confirm Participation</span>
          <div class="response-actions">
            <Button 
              variant={event.userResponse === 'yes' ? 'primary' : 'outline'} 
              class="flex-1 rounded-btn"
              onclick={() => respond(event.id, 'yes')}
            >
              <Check size={16} class="mr-2" /> Accept
            </Button>
            <Button 
              variant={event.userResponse === 'no' ? 'danger' : 'outline'} 
              class="flex-1 rounded-btn"
              onclick={() => respond(event.id, 'no')}
            >
              <X size={16} class="mr-2" /> Decline
            </Button>
          </div>
        </div>
      </div>
    </Card>
  {/each}
</div>

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .page-header h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .premium-tabs {
    display: flex;
    gap: 2rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2.5rem;
  }

  .tab {
    background: none;
    border: none;
    padding: 1rem 0;
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: var(--transition);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tab:hover {
    color: var(--primary);
  }

  .tab.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  .event-full-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .ucl-card {
    border-top: 4px solid #1e293b !important;
    background: linear-gradient(to bottom, #ffffff, #f8fafc);
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: rgba(0,0,0,0.01);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .event-type-tag {
    font-size: 0.625rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.625rem;
    border-radius: 4px;
  }

  .event-type-tag.training { background: #f1f5f9; color: #475569; }
  .event-type-tag.match { background: var(--primary); color: white; }
  .event-type-tag.meeting { background: #fef3c7; color: #b45309; }

  .comp-badge {
    font-size: 0.625rem;
    font-weight: 800;
    color: var(--text-muted);
    background: rgba(0,0,0,0.05);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .event-date-chip {
    font-weight: 700;
    font-size: 0.8125rem;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .event-body {
    padding: 1.5rem;
    flex: 1;
  }

  .opponent-visual {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    justify-content: center;
  }

  .opp-logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .vs {
    font-weight: 900;
    font-size: 0.875rem;
    color: var(--text-muted);
    opacity: 0.5;
  }

  .event-body h3 {
    margin: 0 0 1.25rem 0;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .info-rows {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-muted);
    font-size: 0.9375rem;
    font-weight: 500;
  }

  .icon-box {
    width: 28px;
    height: 28px;
    background: var(--bg-color);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }

  .participation-summary {
    margin-top: 1.5rem;
  }

  .participation-bar {
    height: 6px;
    background: var(--bg-color);
    border-radius: 3px;
    display: flex;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  .bar-segment { height: 100%; }
  .bar-segment.yes { background: var(--success); }
  .bar-segment.no { background: var(--primary); }
  .bar-segment.pending { background: #e2e8f0; }

  .stats-labels {
    display: flex;
    gap: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
  }

  .dot { width: 8px; height: 8px; border-radius: 50%; }
  .dot.yes { background: var(--success); }
  .dot.no { background: var(--primary); }
  .dot.pending { background: #cbd5e1; }

  .attendance-avatars-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--border);
  }

  .avatar-group-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .avatar-group-label {
    font-size: 0.6875rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .text-success { color: var(--success); }
  .text-danger { color: var(--danger); }

  .avatar-group {
    display: flex;
    align-items: center;
    padding-left: 0.5rem;
  }

  .attendance-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top center;
    border: 2px solid white;
    margin-left: -0.5rem;
    background: white;
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s;
  }

  .attendance-avatar:hover {
    transform: translateY(-4px) scale(1.1);
    z-index: 10;
  }

  .border-success { border-color: var(--success); }
  .border-danger { border-color: var(--danger); }

  .more-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 800;
    border-color: white;
  }

  .event-footer {
    padding: 1.5rem;
    background: #fcfcfc;
    border-top: 1px solid var(--border);
  }

  .response-title {
    display: block;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 1rem;
    text-align: center;
    letter-spacing: 0.05em;
  }

  .response-actions {
    display: flex;
    gap: 0.75rem;
  }

  :global(.rounded-btn) { border-radius: var(--radius-md) !important; }
  :global(.mr-2) { margin-right: 0.5rem; }
</style>

