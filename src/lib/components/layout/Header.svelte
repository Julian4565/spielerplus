<script lang="ts">
  import { Bell, ChevronDown, Activity, CheckCircle2 } from 'lucide-svelte';
  import { appState, teams, userProfile } from '$lib/stores/mockData.svelte';
  import { footballData, refreshFootballData } from '$lib/stores/footballStore.svelte.ts';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import { page } from '$app/stores';

  let showTeamDropdown = $state(false);

  function toggleDropdown() {
    showTeamDropdown = !showTeamDropdown;
  }

  function selectTeam(id: string) {
    appState.setActiveTeam(id);
    showTeamDropdown = false;
  }

  // Generate page title from route
  let pageTitle = $derived(() => {
    const path = $page.url.pathname;
    if (path === '/') return 'Home';
    const segment = path.split('/')[1];
    return segment ? segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ') : 'Home';
  });
</script>

<header class="header">
  <div class="header-left">
    <div class="club-switcher">
      <button class="club-btn" onclick={toggleDropdown}>
        <span class="club-logo">{appState.activeTeam.logo}</span>
        <span class="club-name">{appState.activeClub.name} - {appState.activeTeam.name}</span>
        <ChevronDown size={16} class="text-muted" />
      </button>

      {#if showTeamDropdown}
        <div class="club-dropdown">
          {#each teams as team}
            <button 
              class="dropdown-item" 
              class:active={team.id === appState.activeTeamId}
              onclick={() => selectTeam(team.id)}
            >
              <span class="club-logo">{team.logo}</span>
              {appState.activeClub.name} - {team.name}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="header-center">
    <h1 class="page-title">{pageTitle()}</h1>
  </div>

  <div class="header-right">
    <div class="sync-status" class:syncing={footballData.loading}>
      {#if footballData.loading}
        <Activity size={16} class="spin" />
        <span class="sync-text">Syncing...</span>
      {:else if footballData.error}
        <button class="sync-error-btn" onclick={() => refreshFootballData()} title={footballData.error}>
          <Activity size={16} />
          <span>Error</span>
        </button>
      {:else}
        <button class="sync-success-btn" onclick={() => refreshFootballData()} title="Data up to date">
          <CheckCircle2 size={16} />
          <span>Live</span>
        </button>
      {/if}
    </div>

    <button class="interactive-icon notification-btn" onclick={() => alert('Notifications coming soon!')}>
      <Bell size={20} />
      <span class="badge">3</span>
    </button>
    <div class="user-profile interactive-icon" onclick={() => alert('Profile settings coming soon!')}>
      <Avatar src={userProfile.avatar} alt={userProfile.name} size="sm" />
    </div>
  </div>
</header>

<style>
  .header {
    height: 70px;
    background-color: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    position: sticky;
    top: 0;
    z-index: 90;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex: 1;
  }

  .header-right {
    justify-content: flex-end;
  }

  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-main);
    letter-spacing: -0.02em;
  }

  /* Club Switcher */
  .club-switcher {
    position: relative;
  }

  .club-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--bg-color);
    border: 1px solid var(--border);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 600;
    color: var(--text-main);
    transition: var(--transition);
  }

  .club-btn:hover {
    background: var(--border);
    border-color: var(--primary);
  }

  .club-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  :global(.club-logo img) {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .club-dropdown {
    position: absolute;
    top: 120%;
    left: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    width: 260px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    font-weight: 500;
    border-radius: var(--radius-md);
    color: var(--text-main);
    transition: var(--transition);
  }

  .dropdown-item:hover {
    background: var(--bg-color);
    color: var(--primary);
  }

  .dropdown-item.active {
    color: var(--primary);
    background: rgba(220, 38, 38, 0.05);
  }

  /* Notifications */
  .notification-btn {
    position: relative;
    color: var(--text-muted);
  }

  .badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: var(--primary);
    color: white;
    font-size: 0.65rem;
    font-weight: bold;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid var(--surface);
  }

  .user-profile {
    padding: 4px;
  }

  /* Sync Status */
  .sync-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 700;
    transition: var(--transition);
  }

  .syncing {
    color: var(--primary);
    background: rgba(220, 38, 38, 0.05);
  }

  .sync-text {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  .sync-success-btn, .sync-error-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid transparent;
    padding: 0;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.75rem;
    transition: var(--transition);
  }

  .sync-success-btn {
    color: #10b981;
  }

  .sync-success-btn:hover {
    color: #059669;
  }

  .sync-error-btn {
    color: #ef4444;
  }

  .sync-error-btn:hover {
    color: #dc2626;
  }

  .spin {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .header {
      padding: 0 1rem;
    }
    .header-center {
      display: none;
    }
    .club-name {
      display: none;
    }
  }
</style>

