<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
  import { events, teamMembers, polls, appState } from '$lib/stores/mockData.svelte';
  import { Calendar, Cake, Megaphone, CheckCircle2 } from 'lucide-svelte';

  let upcomingEvents = $derived(events.filter(e => e.status === 'upcoming').slice(0, 3));
  let birthdays = $derived(teamMembers.slice(0, 2)); // Mock birthdays
</script>

<div class="dashboard-grid">
  <!-- Main Content -->
  <div class="main-column">
    <div class="welcome-banner">
      <h2>Welcome back, Julian!</h2>
      <p>Here's what's happening in {appState.activeClub.name} today.</p>
    </div>

    <!-- Upcoming Events -->
    <div class="section-header">
      <h3>Upcoming Events</h3>
      <Button variant="ghost" size="sm">View All</Button>
    </div>
    
    <div class="events-list">
      {#each upcomingEvents as event}
        <Card noPadding class="event-card">
          <div class="event-date">
            <span class="day">{event.date.split('-')[2]}</span>
            <span class="month">MAY</span>
          </div>
          <div class="event-details">
            <h4>{event.title}</h4>
            <p>{event.startTime} - {event.endTime} | {event.location}</p>
          </div>
          <div class="event-action">
            <Button variant={event.userResponse === 'yes' ? 'primary' : 'outline'} size="sm">
              {event.userResponse === 'yes' ? 'Accepted' : 'Accept'}
            </Button>
          </div>
        </Card>
      {/each}
    </div>

    <!-- Polls -->
    <div class="section-header">
      <h3>Active Polls</h3>
    </div>
    
    {#each polls as poll}
      <Card title={poll.question}>
        <div class="poll-options">
          {#each poll.options as option}
            <div class="poll-option">
              <div class="option-header">
                <span>{option.text}</span>
                <span>{Math.round((option.votes / poll.totalVotes) * 100)}%</span>
              </div>
              <ProgressBar value={option.votes} max={poll.totalVotes} />
            </div>
          {/each}
        </div>
      </Card>
    {/each}
  </div>

  <!-- Sidebar Content -->
  <div class="side-column">
    <!-- Quick Actions -->
    <Card title="Quick Actions">
      <div class="quick-actions">
        <Button variant="outline" class="w-full justify-start gap-2">
          <Calendar size={18} /> New Event
        </Button>
        <Button variant="outline" class="w-full justify-start gap-2">
          <Megaphone size={18} /> Announcement
        </Button>
      </div>
    </Card>

    <!-- Birthdays -->
    <Card title="Birthdays 🎂" class="mt-4">
      <div class="birthdays-list">
        {#each birthdays as person}
          <div class="birthday-item">
            <img src={person.avatar} alt={person.name} class="bday-avatar" />
            <div class="bday-info">
              <p class="name">{person.name}</p>
              <p class="date">Turns 30 today!</p>
            </div>
          </div>
        {/each}
      </div>
    </Card>
    
    <!-- Promo Banner -->
    <Card class="promo-banner mt-4">
      <div class="promo-content">
        <h3>Get 20% off Team Gear!</h3>
        <p>Use code TEAM20 at our partner store.</p>
        <Button variant="secondary" size="sm" class="mt-2">Shop Now</Button>
      </div>
    </Card>
  </div>
</div>

<style>
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    .dashboard-grid {
      grid-template-columns: 2fr 1fr;
    }
  }

  .welcome-banner {
    background: linear-gradient(135deg, var(--primary), #4a8f7c);
    color: white;
    padding: 2rem;
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow-md);
  }

  .welcome-banner h2 {
    margin: 0 0 0.5rem 0;
  }
  
  .welcome-banner p {
    margin: 0;
    opacity: 0.9;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1.5rem 0 1rem;
  }

  .section-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-main);
  }

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  :global(.event-card .card-body) {
    display: flex;
    align-items: center;
  }

  .event-date {
    background-color: rgba(111, 177, 160, 0.1);
    color: var(--primary);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    border-right: 1px solid var(--border);
  }

  .event-date .day {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .event-date .month {
    font-size: 0.75rem;
    font-weight: 600;
  }

  .event-details {
    padding: 1rem;
    flex: 1;
  }

  .event-details h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
  }

  .event-details p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .event-action {
    padding: 1rem;
  }

  .poll-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .poll-option {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .option-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :global(.w-full) { width: 100%; }
  :global(.justify-start) { justify-content: flex-start !important; }
  :global(.gap-2) { gap: 0.5rem; }
  :global(.mt-4) { margin-top: 1rem; }
  :global(.mt-2) { margin-top: 0.5rem; }

  .birthdays-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .birthday-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .bday-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .bday-info p {
    margin: 0;
  }

  .bday-info .name {
    font-weight: 600;
    font-size: 0.875rem;
  }

  .bday-info .date {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  :global(.promo-banner) {
    background-color: var(--primary);
    color: white;
  }

  .promo-content h3 {
    margin: 0 0 0.5rem 0;
  }
  
  .promo-content p {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.9;
  }
</style>
