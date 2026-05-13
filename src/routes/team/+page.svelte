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
  <h2>Professional Roster</h2>
  <div class="header-actions">
    <div class="search-box">
      <Search size={18} class="text-muted" />
      <input type="text" placeholder="Search elite players..." bind:value={searchQuery} />
    </div>
    <Button variant="outline" class="rounded-btn"><Filter size={18} /> Filters</Button>
    <Button variant="primary" class="rounded-btn">Add Prospect</Button>
  </div>
</div>

<div class="team-grid">
  {#each filteredMembers as member}
    <Card noPadding class="member-card hover-scale">
      <div class="member-visual">
        <div class="member-photo-container">
          <img 
            src={member.avatar} 
            alt={member.name} 
            class="member-photo" 
            loading="eager"
            onerror={(e) => { 
              const target = e.currentTarget as HTMLImageElement;
              const placeholder = '/images/players/placeholder.svg';
              if (target.src !== window.location.origin + placeholder && !target.src.endsWith(placeholder)) {
                target.src = placeholder;
              }
            }} 
          />
          <div class="jersey-number">{member.jerseyNumber || '—'}</div>
        </div>
        <div class="availability-indicator {member.availability}" title={member.availability}></div>
      </div>
      
      <div class="member-info">
        <div class="role-tag">{member.role}</div>
        <h3>{member.name}</h3>
        <p class="position">{member.position}</p>
        
        <div class="member-stats">
          <div class="stat">
            <span class="label">AGE</span>
            <span class="value">{new Date().getFullYear() - new Date(member.birthdate).getFullYear()}</span>
          </div>
          <div class="stat">
            <span class="label">CONTRACT</span>
            <span class="value">2027</span>
          </div>
        </div>
      </div>

      <div class="member-footer">
        <button class="interactive-icon contact-btn" title="Call"><Phone size={18} /></button>
        <button class="interactive-icon contact-btn" title="Email"><Mail size={18} /></button>
        <Button variant="outline" size="sm" class="flex-1 rounded-btn">Profile</Button>
      </div>
    </Card>
  {/each}
</div>

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .page-header h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    min-width: 300px;
  }

  .search-box input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.9375rem;
    font-weight: 500;
    width: 100%;
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  :global(.member-card) {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .member-visual {
    position: relative;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 2rem 0 0;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  .member-photo-container {
    position: relative;
    width: 180px;
    height: 180px;
  }

  .member-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
    transition: var(--transition);
  }

  .member-card:hover .member-photo {
    transform: scale(1.05);
  }

  .jersey-number {
    position: absolute;
    top: 0;
    left: -1rem;
    font-size: 4rem;
    font-weight: 900;
    color: rgba(0,0,0,0.05);
    line-height: 1;
    z-index: 0;
  }

  .availability-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
  }

  .availability-indicator.available { background-color: var(--success); }
  .availability-indicator.sick { background-color: var(--danger); }
  .availability-indicator.vacation { background-color: var(--warning); }

  .member-info {
    padding: 1.5rem;
    text-align: center;
    flex: 1;
  }

  .role-tag {
    font-size: 0.625rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .member-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .position {
    color: var(--primary);
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .member-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    border-top: 1px solid var(--border);
    padding-top: 1.25rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat .label {
    font-size: 0.625rem;
    font-weight: 700;
    color: var(--text-muted);
  }

  .stat .value {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .member-footer {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1.5rem;
    background: #fcfcfc;
    border-top: 1px solid var(--border);
  }

  .contact-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    background: white;
    border: 1px solid var(--border);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .contact-btn:hover {
    color: var(--primary);
    border-color: var(--primary);
    background: rgba(220, 38, 38, 0.02);
  }

  :global(.rounded-btn) { border-radius: var(--radius-md) !important; }
</style>

