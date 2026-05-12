<script lang="ts">
  import { 
    Home, 
    Calendar, 
    Users, 
    CheckSquare, 
    Car, 
    Wallet, 
    Settings,
    Trophy
  } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  let currentPath = $derived($page.url.pathname);

  const navItems = [
    { name: 'Home', href: `${base}/`, icon: Home },
    { name: 'Events', href: `${base}/events`, icon: Trophy },
    { name: 'Calendar', href: `${base}/calendar`, icon: Calendar },
    { name: 'Team', href: `${base}/team`, icon: Users },
    { name: 'Attendance', href: `${base}/attendance`, icon: CheckSquare },
    { name: 'Carpooling', href: `${base}/carpooling`, icon: Car },
    { name: 'Finances', href: `${base}/finances`, icon: Wallet },
    { name: 'Settings', href: `${base}/settings`, icon: Settings },
  ];
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <div class="logo">
      <span class="logo-icon">🏅</span>
      <span class="logo-text">TeamApp</span>
    </div>
  </div>

  <nav class="sidebar-nav">
    {#each navItems as item}
      <a 
        href={item.href} 
        class="nav-item" 
        class:active={currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))}
      >
        <item.icon size={20} class="nav-icon" />
        <span class="nav-text">{item.name}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    width: 250px;
    background-color: var(--surface);
    border-right: 1px solid var(--border);
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    z-index: 100;
  }

  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary);
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .sidebar-nav {
    padding: 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .nav-item:hover {
    background-color: rgba(111, 177, 160, 0.1);
    color: var(--primary);
  }

  .nav-item.active {
    background-color: var(--primary);
    color: white;
  }

  @media (max-width: 768px) {
    .sidebar {
      top: auto;
      bottom: 0;
      width: 100%;
      height: 60px;
      border-right: none;
      border-top: 1px solid var(--border);
      flex-direction: row;
    }

    .sidebar-header {
      display: none;
    }

    .sidebar-nav {
      flex-direction: row;
      justify-content: space-around;
      padding: 0;
      align-items: center;
      width: 100%;
    }

    .nav-item {
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem;
      border-radius: 0;
    }

    .nav-text {
      font-size: 0.65rem;
    }

    .nav-item.active {
      background-color: transparent;
      color: var(--primary);
      border-top: 2px solid var(--primary);
    }
  }
</style>
