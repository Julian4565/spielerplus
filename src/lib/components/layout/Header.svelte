<script lang="ts">
  import { Bell, ChevronDown } from 'lucide-svelte';
  import { appState, clubs, userProfile } from '$lib/stores/mockData.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import { page } from '$app/stores';

  let showClubDropdown = $state(false);

  function toggleDropdown() {
    showClubDropdown = !showClubDropdown;
  }

  function selectClub(id: string) {
    appState.setActiveClub(id);
    showClubDropdown = false;
  }

  // Generate page title from route
  let pageTitle = $derived(() => {
    const path = $page.url.pathname;
    if (path === '/') return 'Home';
    const segment = path.split('/')[1];
    return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Home';
  });
</script>

<header class="header">
  <div class="header-left">
    <div class="club-switcher">
      <button class="club-btn" onclick={toggleDropdown}>
        <span class="club-logo">{appState.activeClub.logo}</span>
        <span class="club-name">{appState.activeClub.name}</span>
        <ChevronDown size={16} class="text-muted" />
      </button>

      {#if showClubDropdown}
        <div class="club-dropdown">
          {#each clubs as club}
            <button 
              class="dropdown-item" 
              class:active={club.id === appState.activeClubId}
              onclick={() => selectClub(club.id)}
            >
              <span class="club-logo">{club.logo}</span>
              {club.name}
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
    <button class="notification-btn">
      <Bell size={20} />
      <span class="badge">3</span>
    </button>
    <div class="user-profile">
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
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 90;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
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
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-main);
  }

  /* Club Switcher */
  .club-switcher {
    position: relative;
  }

  .club-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid var(--border);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 600;
    color: var(--text-main);
    transition: all 0.2s;
  }

  .club-btn:hover {
    background: var(--bg-color);
  }

  .club-dropdown {
    position: absolute;
    top: 110%;
    left: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    width: 200px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-main);
  }

  .dropdown-item:hover {
    background: var(--bg-color);
  }

  .dropdown-item.active {
    color: var(--primary);
    background: rgba(111, 177, 160, 0.1);
  }

  /* Notifications */
  .notification-btn {
    position: relative;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .notification-btn:hover {
    background: var(--bg-color);
    color: var(--text-main);
  }

  .badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: var(--danger);
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
  }

  .user-profile {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .header-center {
      display: none;
    }
    .club-name {
      display: none;
    }
  }
</style>
