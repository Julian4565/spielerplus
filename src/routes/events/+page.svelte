<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { events } from '$lib/stores/mockData.svelte';
  import { MapPin, Clock, Users, Check, X, HelpCircle } from 'lucide-svelte';

  let activeTab = $state('upcoming'); // upcoming, past
  
  let filteredEvents = $derived(
    events.filter(e => 
      activeTab === 'upcoming' ? e.status === 'upcoming' : e.status === 'past'
    )
  );

  function respond(eventId: string, response: string) {
    const event = events.find(e => e.id === eventId);
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
          <div class="participation-bar">
            <div class="bar-segment yes" style="width: {(event.responses.yes / (event.responses.yes + event.responses.no + event.responses.pending)) * 100}%"></div>
            <div class="bar-segment no" style="width: {(event.responses.no / (event.responses.yes + event.responses.no + event.responses.pending)) * 100}%"></div>
          </div>
          <div class="stats-labels">
            <div class="stat"><span class="dot yes"></span> {event.responses.yes} Accepted</div>
            <div class="stat"><span class="dot no"></span> {event.responses.no} Declined</div>
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

  .stats-labels {
    display: flex;
    gap: 1.25rem;
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

