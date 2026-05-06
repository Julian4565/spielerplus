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
  <h2>Events</h2>
  <Button variant="primary">Create Event</Button>
</div>

<div class="tabs">
  <button 
    class="tab" 
    class:active={activeTab === 'upcoming'} 
    onclick={() => activeTab = 'upcoming'}
  >
    Upcoming
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
    <Card class="event-full-card">
      <div class="event-header">
        <div class="event-type-badge {event.type}">{event.type.toUpperCase()}</div>
        <div class="event-date">
          <span class="date">{event.date}</span>
        </div>
      </div>
      
      <div class="event-body">
        <h3>{event.title}</h3>
        
        <div class="info-row">
          <Clock size={16} class="text-muted" />
          <span>{event.startTime} - {event.endTime}</span>
        </div>
        
        <div class="info-row">
          <MapPin size={16} class="text-muted" />
          <span>{event.location}</span>
        </div>

        <div class="participation-stats">
          <div class="stat yes"><Check size={14}/> {event.responses.yes}</div>
          <div class="stat no"><X size={14}/> {event.responses.no}</div>
          <div class="stat pending"><HelpCircle size={14}/> {event.responses.pending}</div>
        </div>
      </div>
      
      <div class="event-footer">
        <p class="response-label">Your Response:</p>
        <div class="response-buttons">
          <Button 
            variant={event.userResponse === 'yes' ? 'primary' : 'outline'} 
            class="flex-1"
            onclick={() => respond(event.id, 'yes')}
          >
            Yes
          </Button>
          <Button 
            variant={event.userResponse === 'no' ? 'danger' : 'outline'} 
            class="flex-1"
            onclick={() => respond(event.id, 'no')}
          >
            No
          </Button>
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
    margin-bottom: 1.5rem;
  }

  .page-header h2 {
    margin: 0;
  }

  .tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }

  .tab {
    background: none;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
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
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .event-type-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-full);
  }

  .event-type-badge.training { background-color: #e0f2fe; color: #0284c7; }
  .event-type-badge.match { background-color: #fef3c7; color: #d97706; }
  .event-type-badge.meeting { background-color: #f3e8ff; color: #9333ea; }

  .date {
    font-weight: 600;
    color: var(--text-muted);
  }

  .event-body h3 {
    margin: 0 0 1rem 0;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  .participation-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .stat.yes { color: var(--success); }
  .stat.no { color: var(--danger); }
  .stat.pending { color: var(--text-muted); }

  .event-footer {
    margin-top: 1rem;
    background-color: var(--bg-color);
    padding: 1rem;
    border-radius: var(--radius-sm);
  }

  .response-label {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .response-buttons {
    display: flex;
    gap: 0.5rem;
  }

  :global(.flex-1) { flex: 1; }
</style>
