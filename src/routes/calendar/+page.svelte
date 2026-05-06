<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import dayjs from 'dayjs';
  import { events } from '$lib/stores/mockData.svelte';

  let currentDate = $state(dayjs('2026-05-01')); // Mocking May 2026 for data

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
    return events.filter(e => e.date === dateStr);
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
              <div class="event-block {event.type}">
                <span class="time">{event.startTime}</span>
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
    margin-bottom: 1.5rem;
  }

  .calendar-header h2 {
    margin: 0;
  }

  .month-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .month-selector h3 {
    margin: 0;
    min-width: 150px;
    text-align: center;
  }

  .icon-btn {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-btn:hover {
    background: var(--bg-color);
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-left: 1px solid var(--border);
    border-top: 1px solid var(--border);
  }

  .weekday {
    padding: 0.75rem;
    text-align: center;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-muted);
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background-color: var(--bg-color);
  }

  .day-cell {
    min-height: 120px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 0.5rem;
    background: white;
  }

  .day-cell.empty {
    background-color: #fafafa;
  }

  .day-number {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--text-main);
  }

  .day-events {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .event-block {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    display: flex;
    gap: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .event-block .time {
    font-weight: 600;
    opacity: 0.8;
  }

  .event-block.training { background-color: #e0f2fe; color: #0369a1; }
  .event-block.match { background-color: #fef3c7; color: #b45309; }
  .event-block.meeting { background-color: #f3e8ff; color: #7e22ce; }

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
