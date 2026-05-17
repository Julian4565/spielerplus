<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
  import { events, teamMembers, polls, appState } from '$lib/stores/mockData.svelte';
  import { footballData } from '$lib/stores/footballStore.svelte.ts';
  import { Calendar, Cake, Megaphone, CheckCircle2, MapPin, ShoppingBag, CreditCard } from 'lucide-svelte';
  import { getLocalBayernSquad } from '$lib/stores/footballStore.svelte.ts';
  import { base } from '$app/paths';

  let upcomingEvents = $derived(footballData.fixtures.slice(0, 3));

  let birthdays = $derived((() => {
    return getLocalBayernSquad().slice(0, 2);
  })());

  function getMonth(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-US', { month: 'short' }).toUpperCase();
  }

  function getDay(dateStr: string) {
    return new Date(dateStr).getDate();
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
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
        <Card noPadding class="event-card hover-scale">
          <div class="event-date">
            <span class="day">{getDay(event.utcDate)}</span>
            <span class="month">{getMonth(event.utcDate)}</span>
          </div>
          <div class="event-details">
            <div class="event-meta">
              <img src={event.competition.emblem} alt="" class="comp-mini-logo" />
              <span class="competition-badge">{event.competition.name}</span>
            </div>
            <div class="fixture-teams">
              <img src={event.homeTeam.crest} alt="" class="opponent-mini-logo" />
              <h4>{event.homeTeam.shortName || event.homeTeam.name} vs {event.awayTeam.shortName || event.awayTeam.name}</h4>
              <img src={event.awayTeam.crest} alt="" class="opponent-mini-logo" />
            </div>
            <p>{formatTime(event.utcDate)} | {event.venue || 'TBA'}</p>
          </div>
          <div class="event-action">
            <div class="match-status-badge">Scheduled</div>
          </div>
        </Card>
      {/each}
      {#if upcomingEvents.length === 0 && !footballData.loading}
        <div class="empty-events">
          <p>No upcoming fixtures found.</p>
        </div>
      {/if}
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
            <img 
              src={person.avatar} 
              alt={person.name} 
              class="bday-avatar" 
              loading="eager"
              onerror={(e) => { 
                const target = e.currentTarget as HTMLImageElement;
                const placeholder = '/images/players/placeholder.svg';
                if (target.src !== window.location.origin + placeholder && !target.src.endsWith(placeholder)) {
                  target.src = placeholder;
                }
              }} 
            />
            <div class="bday-info">
              <p class="name">{person.name}</p>
              <p class="date">Celebrating birthday soon!</p>
            </div>
          </div>
        {/each}
      </div>
    </Card>
    
    <!-- FC Bayern Official Megastore -->
    <a href="{base}/shop" class="no-underline">
      <Card title="FC Bayern Megastore 🛒" class="mt-4 hover-scale shop-card cursor-pointer">
        <div class="promo-content">
          <div class="shop-banner-img-wrapper">
            <img src="{base}/images/Titels/Fan Shop.png" alt="FC Bayern Shop" class="shop-banner-img" />
          </div>
          <p class="mt-3 text-sm text-muted">Shop official jerseys, training gear, accessories, boots, and matchday essentials.</p>
          <Button variant="secondary" size="sm" class="mt-3 w-full justify-center gap-2 rounded-btn">
            <ShoppingBag size={16} /> Enter Megastore
          </Button>
        </div>
      </Card>
    </a>
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

  .comp-mini-logo {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }

  .fixture-teams {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .fixture-teams h4 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
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
    white-space: nowrap;
  }

  .empty-events {
    padding: 3rem;
    text-align: center;
    background: var(--surface);
    border-radius: var(--radius-lg);
    color: var(--text-muted);
    border: 2px dashed var(--border);
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

  /* Megastore Sidebar Card */
  .shop-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .clickable-shop-item {
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .clickable-shop-item:hover {
    transform: translateY(-2px) scale(1.02);
    border-color: rgba(220, 38, 38, 0.25) !important;
    box-shadow: var(--shadow-sm);
    background-color: rgba(220, 38, 38, 0.01);
  }

  .shop-item {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: white;
  }

  .shop-img-wrapper {
    position: relative;
    width: 64px;
    height: 64px;
    background: #fafafa;
    border-radius: var(--radius-sm);
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(15, 23, 42, 0.03);
  }

  .shop-img {
    width: 90%;
    height: 90%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .clickable-shop-item:hover .shop-img {
    transform: scale(1.08);
  }

  .shop-badge {
    position: absolute;
    top: 2px;
    left: 2px;
    background: rgba(15, 23, 42, 0.8);
    color: white;
    font-size: 0.55rem;
    font-weight: 800;
    padding: 1px 4px;
    border-radius: 2px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .shop-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .product-name {
    font-size: 0.8125rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 0.5rem;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .product-price {
    font-size: 0.875rem;
    font-weight: 900;
    color: var(--text-main);
  }

  .quick-buy-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background-color: rgba(220, 38, 38, 0.08);
    color: var(--primary);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
    max-width: 620px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    position: relative;
    overflow: hidden;
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

  /* Success View Screen */
  .checkout-success-view {
    padding: 4rem 2rem;
    text-align: center;
    background: linear-gradient(180deg, rgba(5, 150, 105, 0.04) 0%, transparent 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .success-icon-badge {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: rgba(5, 150, 105, 0.1);
    color: #059669;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    border: 3px solid #059669;
    box-shadow: 0 4px 15px rgba(5, 150, 105, 0.2);
    animation: successScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  @keyframes successScale {
    from { transform: scale(0.6); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .checkout-success-view h2 {
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--text-main);
    margin: 0 0 0.75rem;
    letter-spacing: -0.02em;
  }

  .checkout-success-view p {
    font-size: 0.9375rem;
    color: var(--text-muted);
    max-width: 440px;
    line-height: 1.5;
    margin: 0 0 1.5rem;
  }

  .success-footer-note {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #059669;
    background: rgba(5, 150, 105, 0.08);
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
  }

  /* Checkout Main UI */
  .checkout-header-banner {
    padding: 2.5rem 2rem 1.5rem;
    background: linear-gradient(180deg, rgba(220, 38, 38, 0.03) 0%, transparent 100%);
    border-bottom: 1px solid var(--border);
  }

  .comp-badge-shop {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(15, 23, 42, 0.05);
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .checkout-header-banner h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 0.25rem;
    letter-spacing: -0.02em;
  }

  .checkout-header-banner p {
    font-size: 0.8125rem;
    color: var(--text-muted);
    margin: 0;
    font-weight: 500;
  }

  .checkout-body-grid {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 2rem;
    padding: 2rem;
    background: #fafafa;
  }

  @media (max-width: 600px) {
    .checkout-body-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .checkout-product-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    text-align: center;
    box-shadow: var(--shadow-sm);
  }

  .checkout-img-wrapper {
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(15, 23, 42, 0.02);
  }

  .checkout-img {
    width: 90%;
    height: 90%;
    object-fit: contain;
  }

  .preview-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 0.5rem;
    line-height: 1.4;
  }

  .preview-price {
    font-size: 1.125rem;
    font-weight: 900;
    color: var(--primary);
  }

  /* Checkout Form Options */
  .checkout-form-options {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .size-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .size-btn {
    flex: 1;
    background: white;
    border: 1px solid var(--border);
    padding: 0.5rem 0;
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--text-main);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
  }

  .size-btn:hover {
    border-color: var(--primary);
    background: rgba(220, 38, 38, 0.02);
  }

  .size-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 4px 10px rgba(220, 38, 38, 0.25);
  }

  .premium-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;
    color: var(--text-main);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .premium-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
  }

  .qty-counter {
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    width: fit-content;
    overflow: hidden;
  }

  .qty-btn {
    border: none;
    background: none;
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-main);
    cursor: pointer;
    transition: var(--transition);
  }

  .qty-btn:hover {
    background: #f1f5f9;
  }

  .qty-value {
    width: 44px;
    text-align: center;
    font-weight: 800;
    color: var(--text-main);
    font-size: 0.9375rem;
  }

  /* Checkout Receipt Summary */
  .checkout-summary-receipt {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.125rem 1.25rem;
    box-shadow: var(--shadow-sm);
    margin-top: 0.5rem;
  }

  .receipt-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .receipt-line.total {
    border-top: 1px dashed var(--border);
    padding-top: 0.625rem;
    margin-top: 0.625rem;
    margin-bottom: 0;
    font-size: 0.9375rem;
    font-weight: 850;
    color: var(--text-main);
  }

  .checkout-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.875rem;
    font-size: 0.9375rem;
    font-weight: 800;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
  }

  .checkout-submit-btn:hover {
    background: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
  }

  .checkout-submit-btn:active {
    transform: translateY(0);
  }

  /* Animations */
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
      transform: scale(0.96) translateY(12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>

