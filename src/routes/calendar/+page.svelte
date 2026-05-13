<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import dayjs from 'dayjs';
  import { events } from '$lib/stores/mockData.svelte';
  import { footballData } from '$lib/stores/footballStore.svelte.ts';

  let currentDate = $state(dayjs());

  function nextMonth() {
    currentDate = currentDate.add(1, 'month');
  }

  function prevMonth() {
    currentDate = currentDate.subtract(1, 'month');
  }

  let daysInMonth = $derived(currentDate.daysInMonth());
  let firstDayOfMonth = $derived(currentDate.startOf('month').day()); // 0 = Sun
  
  // Create calendar grid (empty slots + days)
  let calendarDays = $derived(() => {
    const days = [];
    // Adjust for Monday start (1)
    let startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  });

  function getEventsForDay(day: number | null) {
    if (!day) return [];
    const dateStr = currentDate.date(day).format('YYYY-MM-DD');
    
    // Combine mock events (training, etc.) with real fixtures
    const mockEvents = events.filter(e => e.date === dateStr);
    const realFixtures = footballData.fixtures
      .filter(f => f.utcDate.startsWith(dateStr))
      .map(f => ({
        id: f.id,
        title: `${f.homeTeam.shortName} vs ${f.awayTeam.shortName}`,
        type: 'match',
        competition: f.competition.name,
        isUCL: f.competition.code === 'CL'
      }));
      
    return [...mockEvents, ...realFixtures];
  }
</script>

<div class="calendar-header">
  <h2>Calendar</h2>
  <div class="month-selector">
    <button class="icon-btn" onclick={prevMonth}><ChevronLeft size={20}/></button>
    <h3>{currentDate.format('MMMM YYYY')}</h3>
    <button class="icon-btn" onclick={nextMonth}><ChevronRight size={20}/></button>
  </div>
</div>

<Card noPadding>
  <div class="calendar-grid">
    <!-- Weekday Headers -->
    <div class="weekday">Mon</div>
    <div class="weekday">Tue</div>
    <div class="weekday">Wed</div>
    <div class="weekday">Thu</div>
    <div class="weekday">Fri</div>
    <div class="weekday">Sat</div>
    <div class="weekday">Sun</div>

    <!-- Calendar Days -->
    {#each calendarDays() as day}
      <div class="day-cell" class:empty={!day}>
        {#if day}
          <div class="day-number">{day}</div>
          <div class="day-events">
            {#each getEventsForDay(day) as event}
              <div class="event-block {event.type}" class:ucl-block={event.isUCL}>
                <span class="comp">{event.competition?.slice(0, 3) || 'EV'}</span>
                <span class="title">{event.title}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</Card>

<style>
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .calendar-header h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .month-selector {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: var(--surface);
    padding: 0.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .month-selector h3 {
    margin: 0;
    min-width: 180px;
    text-align: center;
    font-weight: 700;
    font-size: 1.125rem;
  }

  .icon-btn {
    background: var(--bg-color);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }

  .icon-btn:hover {
    background: var(--border);
    color: var(--primary);
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background-color: var(--border);
    gap: 1px;
    border: 1px solid var(--border);
  }

  .weekday {
    padding: 1rem;
    text-align: center;
    font-weight: 700;
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background-color: var(--bg-color);
  }

  .day-cell {
    min-height: 140px;
    padding: 0.75rem;
    background: var(--surface);
    transition: var(--transition);
    cursor: pointer;
  }

  .day-cell:hover:not(.empty) {
    background: #fffafa;
    transform: scale(1.01);
    z-index: 10;
    box-shadow: var(--shadow-md);
  }

  .day-cell.empty {
    background-color: var(--bg-color);
    opacity: 0.5;
  }

  .day-number {
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--text-main);
    font-size: 1rem;
  }

  .day-events {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .event-block {
    font-size: 0.7rem;
    padding: 0.35rem 0.6rem;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    transition: var(--transition);
  }

  .event-block:hover {
    filter: brightness(0.95);
    transform: translateX(2px);
  }

  .event-block .comp {
    font-weight: 800;
    opacity: 0.7;
    font-size: 0.6rem;
    background: rgba(0,0,0,0.1);
    padding: 1px 3px;
    border-radius: 2px;
  }

  .event-block.training { background-color: #f1f5f9; color: #475569; }
  .event-block.match { background-color: var(--primary); color: white; }
  .event-block.meeting { background-color: #fef3c7; color: #b45309; }

  .ucl-block {
    background: linear-gradient(135deg, #1e293b, #334155) !important;
    color: white !important;
    border: 1px solid rgba(255,255,255,0.1);
  }

  @media (max-width: 768px) {
    .calendar-grid {
      display: flex;
      flex-direction: column;
      border: none;
    }
    
    .weekday {
      display: none;
    }

    .day-cell {
      min-height: auto;
      border: 1px solid var(--border);
      margin-bottom: 0.5rem;
      border-radius: var(--radius-sm);
    }
    
    .day-cell.empty {
      display: none;
    }
  }
</style>
