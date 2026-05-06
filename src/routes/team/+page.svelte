<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import { teamMembers } from '$lib/stores/mockData.svelte';
  import { Search, Filter, Phone, Mail } from 'lucide-svelte';

  let searchQuery = $state('');
  
  let filteredMembers = $derived(
    teamMembers.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
</script>

<div class="page-header">
  <h2>Team Roster</h2>
  <div class="header-actions">
    <div class="search-box">
      <Search size={18} class="text-muted" />
      <input type="text" placeholder="Search team..." bind:value={searchQuery} />
    </div>
    <Button variant="outline"><Filter size={18} /> Filter</Button>
    <Button variant="primary">Add Member</Button>
  </div>
</div>

<div class="team-grid">
  {#each filteredMembers as member}
    <Card class="member-card">
      <div class="member-header">
        <Avatar src={member.avatar} alt={member.name} size="xl" />
        <div class="availability-badge {member.availability}">
          {member.availability.charAt(0).toUpperCase() + member.availability.slice(1)}
        </div>
      </div>
      
      <div class="member-info">
        <h3>{member.name}</h3>
        <p class="role">{member.role} • {member.position}</p>
        
        <div class="details">
          <div class="detail-item">
            <span class="label">Born:</span>
            <span class="value">{member.birthdate}</span>
          </div>
        </div>
      </div>

      <div class="member-actions">
        <button class="action-btn"><Phone size={18} /></button>
        <button class="action-btn"><Mail size={18} /></button>
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
    flex-wrap: wrap;
    gap: 1rem;
  }

  .page-header h2 {
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    border: 1px solid var(--border);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
  }

  .search-box input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.875rem;
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  :global(.member-card .card-body) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem 1.5rem;
  }

  .member-header {
    position: relative;
    margin-bottom: 1rem;
  }

  .availability-badge {
    position: absolute;
    bottom: -5px;
    right: -10px;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-full);
    border: 2px solid white;
  }

  .availability-badge.available { background-color: var(--success); color: white; }
  .availability-badge.sick { background-color: var(--danger); color: white; }
  .availability-badge.vacation { background-color: var(--warning); color: white; }

  .member-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
  }

  .role {
    color: var(--text-muted);
    font-size: 0.875rem;
    margin: 0 0 1rem 0;
  }

  .details {
    width: 100%;
    border-top: 1px solid var(--border);
    padding-top: 1rem;
    margin-bottom: 1.5rem;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }

  .detail-item .label {
    color: var(--text-muted);
  }

  .detail-item .value {
    font-weight: 500;
  }

  .member-actions {
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: center;
  }

  .action-btn {
    background: var(--bg-color);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: var(--primary);
    color: white;
  }
</style>
