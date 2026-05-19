<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
  import { events, teamMembers, polls, appState } from '$lib/stores/mockData.svelte';
  import { footballData } from '$lib/stores/footballStore.svelte.ts';
  import { Calendar, Cake, Megaphone, CheckCircle2, MapPin, ShoppingBag, X, Image, Clock } from 'lucide-svelte';
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

  // ── New Event Modal ──────────────────────────────────────────
  let showNewEventModal = $state(false);
  let eventSaved = $state(false);
  let newEvent = $state({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'training',
    attendanceMode: 'required'
  });

  function saveNewEvent() {
    if (!newEvent.title || !newEvent.date) return;
    const id = 'custom_' + Date.now();
    events.push({
      id,
      teamId: appState.activeTeamId,
      clubId: 'bayern',
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime || '10:00',
      endTime: newEvent.endTime || '12:00',
      location: newEvent.location || 'TBA',
      type: newEvent.type,
      status: 'upcoming',
      responses: { yes: 0, no: 0, pending: 27 },
      userResponse: 'pending'
    });
    eventSaved = true;
    setTimeout(() => {
      showNewEventModal = false;
      eventSaved = false;
      newEvent = { title: '', date: '', startTime: '', endTime: '', location: '', type: 'training', attendanceMode: 'required' };
    }, 1800);
  }

  // ── Announcement Modal ───────────────────────────────────────
  let showAnnouncementModal = $state(false);
  let announcementSaved = $state(false);
  let announcements = $state<any[]>([
    {
      id: 'a1',
      title: 'UCL Semi-Final – Ticket Distribution',
      body: 'Player-family ticket allocations for the upcoming Champions League semi-final at Allianz Arena are now available. Each squad member receives 4 complimentary tickets. Please register via the club portal before Friday 17:00.',
      author: 'Max Eberl (General Director)',
      timestamp: 'Today • 09:15 AM',
      tag: 'Official'
    },
    {
      id: 'a2',
      title: 'Updated Training Schedule – Week 21',
      body: 'Please note the revised training times effective immediately. Tuesday session moved from 10:00 to 08:30 to accommodate media obligations. Attendance is mandatory. Contact the coaching staff for exemptions.',
      author: 'Vincent Kompany (Head Coach)',
      timestamp: 'Yesterday • 5:30 PM',
      tag: 'Training'
    }
  ]);
  let newAnnouncement = $state({ title: '', body: '', tag: 'Official' });
  let selectedAnnouncement = $state<any>(null);

  function saveAnnouncement() {
    if (!newAnnouncement.title || !newAnnouncement.body) return;
    announcements.unshift({
      id: 'a_' + Date.now(),
      title: newAnnouncement.title,
      body: newAnnouncement.body,
      tag: newAnnouncement.tag,
      author: 'Vincent Kompany (Head Coach)',
      timestamp: 'Just now'
    });
    announcementSaved = true;
    setTimeout(() => {
      showAnnouncementModal = false;
      announcementSaved = false;
      newAnnouncement = { title: '', body: '', tag: 'Official' };
    }, 1800);
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
        <Button variant="outline" class="w-full justify-start gap-3 rounded-btn" onclick={() => showNewEventModal = true}>
          <Calendar size={20} class="text-primary" /> New Event
        </Button>
        <Button variant="outline" class="w-full justify-start gap-3 rounded-btn" onclick={() => showAnnouncementModal = true}>
          <Megaphone size={20} class="text-primary" /> Announcement
        </Button>
      </div>
    </Card>

    <!-- Recent Announcements Widget -->
    {#if announcements.length > 0}
    <Card title="📢 Announcements" class="mt-4 hover-scale">
      <div class="announcement-list">
        {#each announcements.slice(0, 3) as ann}
          <div role="button" tabindex="0" class="ann-item" onclick={() => selectedAnnouncement = ann}>
            <span class="ann-tag {ann.tag === 'Official' ? 'tag-official' : ann.tag === 'Training' ? 'tag-training' : 'tag-default'}">{ann.tag}</span>
            <p class="ann-title">{ann.title}</p>
            <span class="ann-time">{ann.timestamp}</span>
          </div>
        {/each}
      </div>
    </Card>
    {/if}

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

<!-- ═══════════════════════════════════════
     NEW EVENT MODAL
═══════════════════════════════════════ -->
{#if showNewEventModal}
  <div class="modal-overlay animate-fade" role="dialog" aria-modal="true" onclick={() => showNewEventModal = false}>
    <div class="modal-panel animate-in" onclick={(e) => e.stopPropagation()} role="presentation">
      <div class="modal-header-strip">
        <div class="modal-header-icon">📅</div>
        <div>
          <h2 class="modal-h">Create New Event</h2>
          <p class="modal-sub">Schedule a training session, match, or team meeting</p>
        </div>
        <button class="modal-close-x" onclick={() => showNewEventModal = false}><X size={20} /></button>
      </div>

      {#if eventSaved}
        <div class="success-state">
          <div class="success-icon">✅</div>
          <h3>Event Created!</h3>
          <p>The event has been added to your Calendar and Events page.</p>
        </div>
      {:else}
        <div class="modal-form">
          <div class="form-group">
            <label for="ev-title">Event Title <span class="req">*</span></label>
            <input id="ev-title" type="text" bind:value={newEvent.title} placeholder="e.g. Tactical Training at Säbener Straße" class="form-input" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="ev-date">Date <span class="req">*</span></label>
              <input id="ev-date" type="date" bind:value={newEvent.date} class="form-input" />
            </div>
            <div class="form-group">
              <label for="ev-type">Event Type</label>
              <select id="ev-type" bind:value={newEvent.type} class="form-input">
                <option value="training">⚽ Training</option>
                <option value="match">🏟️ Match / Game</option>
                <option value="meeting">📋 Team Meeting</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="ev-start">Start Time</label>
              <input id="ev-start" type="time" bind:value={newEvent.startTime} class="form-input" />
            </div>
            <div class="form-group">
              <label for="ev-end">End Time</label>
              <input id="ev-end" type="time" bind:value={newEvent.endTime} class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label for="ev-location"><MapPin size={14} /> Location</label>
            <input id="ev-location" type="text" bind:value={newEvent.location} placeholder="e.g. Allianz Arena, Säbener Straße..." class="form-input" />
          </div>

          <div class="form-group">
            <label for="ev-attend">Attendance</label>
            <select id="ev-attend" bind:value={newEvent.attendanceMode} class="form-input">
              <option value="required">✅ Required – Full Squad</option>
              <option value="optional">🔵 Optional</option>
              <option value="first-team">🔴 First Team Only</option>
            </select>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" onclick={() => showNewEventModal = false}>Cancel</button>
            <button class="btn-save" onclick={saveNewEvent} disabled={!newEvent.title || !newEvent.date}>
              📅 Save Event
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- ═══════════════════════════════════════
     ANNOUNCEMENT MODAL
═══════════════════════════════════════ -->
{#if showAnnouncementModal}
  <div class="modal-overlay animate-fade" role="dialog" aria-modal="true" onclick={() => showAnnouncementModal = false}>
    <div class="modal-panel animate-in" onclick={(e) => e.stopPropagation()} role="presentation">
      <div class="modal-header-strip">
        <div class="modal-header-icon">📢</div>
        <div>
          <h2 class="modal-h">Post Announcement</h2>
          <p class="modal-sub">Publish a club news update to the squad</p>
        </div>
        <button class="modal-close-x" onclick={() => showAnnouncementModal = false}><X size={20} /></button>
      </div>

      {#if announcementSaved}
        <div class="success-state">
          <div class="success-icon">📣</div>
          <h3>Announcement Published!</h3>
          <p>Your message has been distributed to all squad members.</p>
        </div>
      {:else}
        <div class="modal-form">
          <div class="form-group">
            <label for="ann-title">Title <span class="req">*</span></label>
            <input id="ann-title" type="text" bind:value={newAnnouncement.title} placeholder="e.g. Match Day Protocol – vs. Dortmund" class="form-input" />
          </div>

          <div class="form-group">
            <label for="ann-body">Message Body <span class="req">*</span></label>
            <textarea id="ann-body" bind:value={newAnnouncement.body} rows="5" placeholder="Write your announcement details here..." class="form-input form-textarea"></textarea>
          </div>

          <div class="form-group">
            <label for="ann-tag">Category</label>
            <select id="ann-tag" bind:value={newAnnouncement.tag} class="form-input">
              <option value="Official">🔴 Official Club Notice</option>
              <option value="Training">⚽ Training Update</option>
              <option value="Match">🏆 Match Info</option>
              <option value="General">📌 General</option>
            </select>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" onclick={() => showAnnouncementModal = false}>Cancel</button>
            <button class="btn-save" onclick={saveAnnouncement} disabled={!newAnnouncement.title || !newAnnouncement.body}>
              📢 Publish Announcement
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Announcement Detail Viewer -->
{#if selectedAnnouncement}
  <div class="modal-overlay animate-fade" role="dialog" aria-modal="true" onclick={() => selectedAnnouncement = null}>
    <div class="modal-panel animate-in ann-detail-panel" onclick={(e) => e.stopPropagation()} role="presentation">
      <button class="modal-close-x" onclick={() => selectedAnnouncement = null}><X size={20} /></button>
      <div class="ann-detail-header">
        <span class="ann-tag tag-{selectedAnnouncement.tag === 'Official' ? 'official' : selectedAnnouncement.tag === 'Training' ? 'training' : 'default'}">{selectedAnnouncement.tag}</span>
        <h2>{selectedAnnouncement.title}</h2>
        <div class="ann-meta">
          <Clock size={14} /> {selectedAnnouncement.timestamp} &nbsp;•&nbsp; {selectedAnnouncement.author}
        </div>
      </div>
      <div class="ann-detail-body">
        <p>{selectedAnnouncement.body}</p>
      </div>
      <div class="ann-detail-footer">
        <span class="fc-badge">FC Bayern München – Official Internal Communication</span>
      </div>
    </div>
  </div>
{/if}

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

  /* ── New modal panel (event + announcement) ─────────────── */
  .modal-panel {
    background: var(--surface);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 560px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    overflow: hidden;
    color: var(--text-main);
    border: 1px solid var(--border);
    position: relative;
  }

  .ann-detail-panel {
    max-width: 640px;
    padding: 0;
  }

  .modal-header-strip {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1.75rem 1.75rem 1.25rem;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(220,38,38,0.03) 0%, transparent 100%);
  }

  .modal-header-icon {
    font-size: 2rem;
    line-height: 1;
    flex-shrink: 0;
  }

  .modal-h {
    margin: 0 0 0.25rem;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-main);
  }

  .modal-sub {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .modal-close-x {
    margin-left: auto;
    flex-shrink: 0;
    background: rgba(15,23,42,0.05);
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.2s ease;
  }
  .modal-close-x:hover {
    background: rgba(220,38,38,0.1);
    color: var(--primary);
  }

  .modal-form {
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .req {
    color: var(--primary);
  }

  .form-input {
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: white;
    color: var(--text-main);
    font-size: 0.9375rem;
    font-weight: 500;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    font-family: inherit;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
    margin-top: 0.25rem;
  }

  .btn-cancel {
    flex: 1;
    padding: 0.75rem;
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-weight: 700;
    font-size: 0.9375rem;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
  }
  .btn-cancel:hover { background: #f8fafc; color: var(--text-main); }

  .btn-save {
    flex: 2;
    padding: 0.75rem;
    background: var(--primary);
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 800;
    font-size: 0.9375rem;
    color: white;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 4px 14px rgba(220,38,38,0.25);
    font-family: inherit;
  }
  .btn-save:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
  .btn-save:disabled { opacity: 0.45; cursor: not-allowed; }

  .success-state {
    padding: 3rem 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .success-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    animation: successPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  @keyframes successPop {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .success-state h3 {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 0 0.5rem;
    color: var(--text-main);
  }
  .success-state p {
    color: var(--text-muted);
    font-size: 0.9375rem;
    margin: 0;
  }

  /* ── Announcement widget card ──────────────────────────── */
  .announcement-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ann-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.875rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background 0.15s ease;
    border: 1px solid transparent;
  }
  .ann-item:hover {
    background: rgba(220,38,38,0.03);
    border-color: rgba(220,38,38,0.1);
  }

  .ann-tag {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    width: fit-content;
    margin-bottom: 0.125rem;
  }
  .tag-official { background: rgba(220,38,38,0.1); color: var(--primary); }
  .tag-training { background: rgba(5,150,105,0.1); color: #059669; }
  .tag-default  { background: rgba(15,23,42,0.08); color: var(--text-muted); }

  .ann-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-main);
    margin: 0;
    line-height: 1.4;
  }

  .ann-time {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* ── Announcement detail panel ─────────────────────────── */
  .ann-detail-header {
    padding: 2.5rem 2rem 1.5rem;
    background: linear-gradient(180deg, rgba(15,23,42,0.02) 0%, transparent 100%);
    border-bottom: 1px dashed var(--border);
  }
  .ann-detail-header h2 {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0.5rem 0 0.75rem;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }
  .ann-meta {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .ann-detail-body {
    padding: 2rem;
  }
  .ann-detail-body p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--text-main);
    font-weight: 500;
    margin: 0;
  }

  .ann-detail-footer {
    padding: 1.25rem 2rem;
    border-top: 1px solid var(--border);
    background: rgba(15,23,42,0.01);
  }

  .fc-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    opacity: 0.7;
  }
</style>

