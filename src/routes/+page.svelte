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
        <Card noPadding class="event-card hover-scale" class:ucl-card={event.isUCL}>
          <div class="event-date">
            <span class="day">{event.date.split('-')[2]}</span>
            <span class="month">MAY</span>
          </div>
          <div class="event-details">
            <div class="event-meta">
              {#if event.opponentLogo}
                <img src={event.opponentLogo} alt="Opponent" class="opponent-mini-logo" />
              {/if}
              <span class="competition-badge">{event.competition || 'Event'}</span>
            </div>
            <h4>{event.title}</h4>
            <p>{event.startTime} - {event.endTime} | {event.location}</p>
          </div>
          <div class="event-action">
            <Button variant={event.userResponse === 'yes' ? 'primary' : 'outline'} size="sm" class="rounded-btn">
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
      <Card title={poll.question} class="hover-scale">
        <div class="poll-options">
          {#each poll.options as option}
            <div class="poll-option">
              <div class="option-header">
                <span>{option.text}</span>
                <span class="text-primary font-bold">{Math.round((option.votes / poll.totalVotes) * 100)}%</span>
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
        <Button variant="outline" class="w-full justify-start gap-3 rounded-btn">
          <Calendar size={20} class="text-primary" /> New Event
        </Button>
        <Button variant="outline" class="w-full justify-start gap-3 rounded-btn">
          <Megaphone size={20} class="text-primary" /> Announcement
        </Button>
      </div>
    </Card>

    <!-- Birthdays -->
    <Card title="Birthdays 🎂" class="mt-4 hover-scale">
      <div class="birthdays-list">
        {#each birthdays as person}
          <div class="birthday-item">
            <img src={person.avatar} alt={person.name} class="bday-avatar" />
            <div class="bday-info">
              <p class="name">{person.name}</p>
              <p class="date">Celebrating birthday soon!</p>
            </div>
          </div>
        {/each}
      </div>
    </Card>
    
    <!-- Promo Banner -->
    <Card class="promo-banner mt-4 hover-scale">
      <div class="promo-content">
        <div class="ucl-logo-mini">🏆</div>
        <h3>Shop Official UCL Gear</h3>
        <p>Get the authentic match jerseys and training kits.</p>
        <Button variant="secondary" size="sm" class="mt-4 rounded-btn">Visit Store</Button>
      </div>
    </Card>
  </div>
</div>

<style>
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .dashboard-grid {
      grid-template-columns: 1fr 380px;
    }
  }

  .welcome-banner {
    background: linear-gradient(135deg, var(--primary), #881337);
    color: white;
    padding: 2.5rem;
    border-radius: var(--radius-lg);
    margin-bottom: 2rem;
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
  }

  .welcome-banner::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(100px, -100px);
  }

  .welcome-banner h2 {
    margin: 0 0 0.75rem 0;
    font-size: 2rem;
    font-weight: 800;
  }
  
  .welcome-banner p {
    margin: 0;
    font-size: 1.125rem;
    opacity: 0.9;
    font-weight: 500;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0 1.25rem;
  }

  .section-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  :global(.event-card .card-body) {
    display: flex;
    align-items: center;
    padding: 0;
  }

  .ucl-card {
    border: 1px solid rgba(30, 41, 59, 0.2);
    background: linear-gradient(to right, #ffffff, #f1f5f9);
    position: relative;
  }

  .ucl-card::before {
    content: 'UCL';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.65rem;
    font-weight: 800;
    color: #1e293b;
    opacity: 0.2;
  }

  .event-date {
    background-color: rgba(220, 38, 38, 0.05);
    color: var(--primary);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    border-right: 1px solid var(--border);
  }

  .event-date .day {
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1;
  }

  .event-date .month {
    font-size: 0.875rem;
    font-weight: 700;
    margin-top: 0.25rem;
  }

  .event-details {
    padding: 1.25rem 1.5rem;
    flex: 1;
  }

  .event-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .opponent-mini-logo {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .competition-badge {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .event-details h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 700;
  }

  .event-details p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .event-action {
    padding: 1.5rem;
  }

  .poll-options {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .poll-option {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .option-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;
    font-weight: 600;
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  :global(.rounded-btn) {
    border-radius: var(--radius-md) !important;
  }

  .birthdays-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .birthday-item {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .bday-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    object-fit: cover;
    box-shadow: var(--shadow-sm);
  }

  .bday-info .name {
    font-weight: 700;
    font-size: 1rem;
    margin: 0;
  }

  .bday-info .date {
    font-size: 0.8125rem;
    color: var(--text-muted);
    margin: 0.25rem 0 0;
  }

  :global(.promo-banner) {
    background-color: var(--accent);
    color: white;
    background-image: radial-gradient(circle at top right, rgba(220, 38, 38, 0.2), transparent);
  }

  .ucl-logo-mini {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .promo-content h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
    font-weight: 800;
  }
  
  .promo-content p {
    margin: 0;
    font-size: 0.9375rem;
    opacity: 0.8;
    line-height: 1.5;
  }
</style>

