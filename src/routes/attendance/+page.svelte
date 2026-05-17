<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
  import { localBayernSquad } from '$lib/stores/footballStore.svelte.ts';
  import { Download } from 'lucide-svelte';

  // Sort by attendance (descending)
  let sortedMembers = $derived([...localBayernSquad].sort((a, b) => b.attendance - a.attendance));
  
  let averageAttendance = $derived(
    localBayernSquad.length > 0 
      ? Math.round(localBayernSquad.reduce((acc, m) => acc + m.attendance, 0) / localBayernSquad.length)
      : 0
  );
</script>

<div class="page-header">
  <h2>Elite Performance: Attendance</h2>
  <div class="header-actions">
    <select class="period-select premium-select">
      <option>Season 2026/27</option>
      <option>Last 30 Days</option>
      <option>UCL Matches Only</option>
    </select>
    <Button variant="outline" class="rounded-btn"><Download size={18} /> Export Analytics</Button>
  </div>
</div>

<div class="stats-overview">
  <Card class="stat-card hover-scale">
    <div class="stat-container">
      <div class="stat-info">
        <div class="stat-label">Squad Training Readiness</div>
        <div class="stat-value">{averageAttendance}%</div>
        <p class="stat-desc">Maintaining elite levels of preparation across all departments.</p>
      </div>
      <div class="stat-visual">
        <ProgressBar value={averageAttendance} max={100} height="12px" color={averageAttendance > 90 ? 'success' : 'warning'} />
      </div>
    </div>
  </Card>
</div>

<Card title="Individual Professional Standing" class="hover-scale">
  <div class="attendance-list">
    {#each sortedMembers as member}
      <div class="attendance-item hover-row">
        <div class="member-col">
          <div class="avatar-wrapper">
            <img 
              src={member.avatar} 
              alt={member.name} 
              class="attendance-avatar" 
              loading="lazy"
              onerror={(e) => { 
                const target = e.currentTarget as HTMLImageElement;
                const placeholder = '/images/players/placeholder.svg';
                if (target.src !== window.location.origin + placeholder && !target.src.endsWith(placeholder)) {
                  target.src = placeholder;
                }
              }} 
            />
            {#if member.jerseyNumber}
              <span class="jersey-sm">{member.jerseyNumber}</span>
            {/if}
          </div>
          <div class="member-details">
            <span class="name">{member.name}</span>
            <span class="role-badge">{member.role}</span>
          </div>
        </div>
        
        <div class="progress-col">
          <div class="progress-meta">
            <span class="progress-label">Attendance Score</span>
            <span class="progress-value" class:text-success={member.attendance >= 90} class:text-warning={member.attendance >= 70 && member.attendance < 90} class:text-danger={member.attendance < 70}>
              {member.attendance}%
            </span>
          </div>
          <ProgressBar 
            value={member.attendance} 
            max={100} 
            height="8px"
            color={member.attendance >= 90 ? 'success' : (member.attendance >= 70 ? 'warning' : 'danger')} 
          />
        </div>
      </div>
    {/each}
  </div>
</Card>

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .page-header h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-main);
  }

  .header-actions {
    display: flex;
    gap: 1.25rem;
    align-items: center;
  }

  .premium-select {
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 0.875rem;
    font-weight: 600;
    outline: none;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
  }

  .premium-select:hover {
    border-color: var(--primary);
  }

  .stats-overview {
    margin-bottom: 2.5rem;
  }

  .stat-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0.5rem;
  }

  .stat-label {
    color: var(--text-muted);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 3.5rem;
    font-weight: 800;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 0.75rem;
    letter-spacing: -0.03em;
  }

  .stat-desc {
    margin: 0;
    color: var(--text-muted);
    font-weight: 500;
    max-width: 400px;
  }

  .attendance-list {
    display: flex;
    flex-direction: column;
  }

  .attendance-item {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: center;
    gap: 3rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--border);
    transition: var(--transition);
  }

  .attendance-item:last-child {
    border-bottom: none;
  }

  .hover-row:hover {
    background: rgba(0,0,0,0.01);
    padding-left: 1rem;
    padding-right: 1rem;
    margin-left: -1rem;
    margin-right: -1rem;
    border-radius: var(--radius-md);
  }

  .member-col {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .avatar-wrapper {
    position: relative;
    width: 48px;
    height: 48px;
  }

  .attendance-avatar {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-sm);
    object-fit: cover;
    background: var(--bg-color);
  }

  .jersey-sm {
    position: absolute;
    bottom: -4px;
    right: -4px;
    background: var(--primary);
    color: white;
    font-size: 0.625rem;
    font-weight: 800;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 2px solid white;
  }

  .member-details {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .member-details .name {
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-main);
  }

  .role-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .progress-col {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .progress-meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .progress-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
  }

  .progress-value {
    font-size: 1rem;
    font-weight: 800;
  }

  :global(.rounded-btn) { border-radius: var(--radius-md) !important; }

  @media (max-width: 900px) {
    .attendance-item {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>

