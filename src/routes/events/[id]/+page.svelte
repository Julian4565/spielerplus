<script lang="ts">
  import { page } from '$app/stores';
  import { getLocalBayernSquad } from '$lib/stores/footballStore.svelte.ts';
  import { events } from '$lib/stores/mockData.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { ArrowLeft, MapPin, Clock, Check, X, Calendar as CalIcon } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let eventId = $derived($page.params.id);
  
  // Create a realistic detail view mock
  let eventDetail = $derived.by(() => {
    const localPlayers = getLocalBayernSquad();
    const yesPlayers = localPlayers.slice(0, Math.floor(localPlayers.length * 0.7));
    const noPlayers = localPlayers.slice(Math.floor(localPlayers.length * 0.7), Math.floor(localPlayers.length * 0.85));
    const pendingPlayers = localPlayers.slice(Math.floor(localPlayers.length * 0.85));

    // Try to find if it's a known mock event
    const known = events.find(e => e.id === eventId);
    
    return {
      id: eventId,
      title: known?.title || 'FC Bayern Matchday',
      type: known?.type || 'match',
      date: known?.date || new Date().toISOString().split('T')[0],
      startTime: known?.startTime || '20:45',
      endTime: known?.endTime || '22:30',
      location: known?.location || 'Allianz Arena',
      competition: 'Champions League',
      attending: yesPlayers,
      declined: noPlayers,
      pending: pendingPlayers,
      userResponse: 'pending'
    };
  });
</script>

<div class="page-header">
  <Button variant="ghost" class="back-btn" onclick={() => goto('/events')}>
    <ArrowLeft size={20} class="mr-2" /> Back to Events
  </Button>
</div>

<div class="event-detail-layout">
  <div class="main-content">
    <Card noPadding class="event-hero-card">
      <div class="hero-bg {eventDetail.type}">
        <div class="hero-content">
          <span class="event-tag">{eventDetail.type}</span>
          <h1 class="event-title">{eventDetail.title}</h1>
        </div>
      </div>
      
      <div class="hero-details">
        <div class="detail-chunk">
          <CalIcon size={20} class="text-primary" />
          <div>
            <span class="lbl">Date</span>
            <span class="val">{new Date(eventDetail.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <div class="detail-chunk">
          <Clock size={20} class="text-primary" />
          <div>
            <span class="lbl">Time</span>
            <span class="val">{eventDetail.startTime} - {eventDetail.endTime || 'End'}</span>
          </div>
        </div>
        <div class="detail-chunk">
          <MapPin size={20} class="text-primary" />
          <div>
            <span class="lbl">Location</span>
            <span class="val">{eventDetail.location}</span>
          </div>
        </div>
      </div>
    </Card>

    <Card title="Response Status" class="mt-6">
      <div class="participation-stats">
        <div class="p-stat">
          <div class="p-val text-success">{eventDetail.attending.length}</div>
          <div class="p-lbl">Attending</div>
        </div>
        <div class="p-stat">
          <div class="p-val text-danger">{eventDetail.declined.length}</div>
          <div class="p-lbl">Declined</div>
        </div>
        <div class="p-stat">
          <div class="p-val text-slate-400">{eventDetail.pending.length}</div>
          <div class="p-lbl">Pending</div>
        </div>
      </div>
    </Card>
  </div>

  <div class="sidebar">
    <Card title="Your Response" class="response-card">
      <p class="text-sm text-slate-500 mb-4 text-center">Please confirm your participation for this event.</p>
      <div class="action-buttons flex gap-3">
        <Button variant="primary" class="flex-1 rounded-btn"><Check size={18} class="mr-2"/> Accept</Button>
        <Button variant="danger" class="flex-1 rounded-btn"><X size={18} class="mr-2"/> Decline</Button>
      </div>
    </Card>

    <Card title="Participants" class="mt-6">
      <div class="participants-list">
        {#each eventDetail.attending as player}
          <div class="participant-row">
            <img src={player.avatar} alt={player.name} class="p-avatar" />
            <span class="p-name">{player.name}</span>
            <Check size={16} class="text-success ml-auto" />
          </div>
        {/each}
        {#each eventDetail.declined as player}
          <div class="participant-row opacity-50">
            <img src={player.avatar} alt={player.name} class="p-avatar" />
            <span class="p-name">{player.name}</span>
            <X size={16} class="text-danger ml-auto" />
          </div>
        {/each}
      </div>
    </Card>
  </div>
</div>

<style>
  .page-header { margin-bottom: 2rem; }
  
  .event-detail-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .event-detail-layout {
      grid-template-columns: 1fr 350px;
    }
  }

  .event-hero-card { overflow: hidden; }

  .hero-bg {
    padding: 3rem 2rem;
    background: linear-gradient(135deg, var(--primary), #881337);
    color: white;
  }

  .hero-bg.training { background: linear-gradient(135deg, #1e293b, #0f172a); }
  .hero-bg.meeting { background: linear-gradient(135deg, #b45309, #78350f); }

  .event-tag {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .event-title {
    font-size: 2.5rem;
    font-weight: 900;
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .hero-details {
    display: flex;
    padding: 1.5rem 2rem;
    gap: 3rem;
    background: var(--surface);
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .detail-chunk {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .detail-chunk .lbl {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .detail-chunk .val {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .participation-stats {
    display: flex;
    justify-content: space-around;
    padding: 1rem 0;
  }

  .p-stat { text-align: center; }
  .p-val { font-size: 2.5rem; font-weight: 900; line-height: 1; }
  .p-lbl { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 0.5rem; }

  .participants-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .participant-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }
  
  .participant-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .p-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .p-name {
    font-weight: 600;
    color: var(--text-main);
  }
</style>
