<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
  import { teamMembers } from '$lib/stores/mockData.svelte';
  import { Download } from 'lucide-svelte';

  // Sort by attendance (descending)
  let sortedMembers = $derived([...teamMembers].sort((a, b) => b.attendance - a.attendance));
  
  let averageAttendance = $derived(
    Math.round(teamMembers.reduce((acc, m) => acc + m.attendance, 0) / teamMembers.length)
  );
</script>

<div class="page-header">
  <h2>Attendance Statistics</h2>
  <div class="header-actions">
    <select class="period-select">
      <option>Last 30 Days</option>
      <option>Last 90 Days</option>
      <option>This Season</option>
    </select>
    <Button variant="outline"><Download size={18} /> Export</Button>
  </div>
</div>

<div class="stats-overview">
  <Card class="stat-card">
    <div class="stat-content">
      <div class="stat-value">{averageAttendance}%</div>
      <div class="stat-label">Average Team Attendance</div>
    </div>
    <ProgressBar value={averageAttendance} max={100} color={averageAttendance > 80 ? 'success' : 'warning'} />
  </Card>
</div>

<Card title="Player Attendance">
  <div class="attendance-list">
    {#each sortedMembers as member}
      <div class="attendance-item">
        <div class="member-col">
          <Avatar src={member.avatar} alt={member.name} size="md" />
          <div class="member-details">
            <span class="name">{member.name}</span>
            <span class="role">{member.role}</span>
          </div>
        </div>
        
        <div class="progress-col">
          <ProgressBar 
            value={member.attendance} 
            max={100} 
            showLabel 
            color={member.attendance >= 80 ? 'success' : (member.attendance >= 60 ? 'warning' : 'danger')} 
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
    margin-bottom: 1.5rem;
  }

  .page-header h2 {
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .period-select {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;
    font-size: 0.875rem;
    outline: none;
  }

  .stats-overview {
    margin-bottom: 1.5rem;
  }

  .stat-content {
    margin-bottom: 1rem;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
  }

  .stat-label {
    color: var(--text-muted);
    font-weight: 500;
  }

  .attendance-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .attendance-item {
    display: grid;
    grid-template-columns: 200px 1fr;
    align-items: center;
    gap: 2rem;
  }

  .member-col {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .member-details {
    display: flex;
    flex-direction: column;
  }

  .member-details .name {
    font-weight: 600;
  }

  .member-details .role {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .progress-col {
    flex: 1;
  }

  @media (max-width: 768px) {
    .attendance-item {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
