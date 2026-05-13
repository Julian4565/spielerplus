<script lang="ts">
  import { 
    Home, 
    Calendar, 
    Users, 
    CheckSquare, 
    Car, 
    Wallet, 
    Settings,
    Trophy,
    Activity,
    BarChart3
  } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  let currentPath = $derived($page.url.pathname);

  const navItems = [
    { name: 'Home', href: `${base}/`, icon: Home },
    { name: 'Football Center', href: `${base}/football-center`, icon: Activity },
    { name: 'Standings', href: `${base}/standings`, icon: BarChart3 },
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
    <div class="logo interactive-icon" onclick={() => window.location.href = '/'}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg" alt="Bayern Logo" class="logo-img" />
      <span class="logo-text">SpielerPlus</span>
    </div>
  </div>

  <nav class="sidebar-nav">
    {#each navItems as item}
      <a 
        href={item.href} 
        class="nav-item" 
        class:active={currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))}
      >
        <item.icon size={22} class="nav-icon" />
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
    box-shadow: var(--shadow-sm);
  }

  .sidebar-header {
    padding: 2rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.02em;
    padding: 0.5rem;
    border-radius: var(--radius-md);
  }

  .logo-img {
    width: 40px;
    height: 40px;
  }

  .sidebar-nav {
    padding: 1.5rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: var(--radius-md);
    color: var(--text-muted);
    font-weight: 600;
    transition: var(--transition);
  }

  .nav-item:hover {
    background-color: var(--bg-color);
    color: var(--primary);
    transform: translateX(4px);
  }

  .nav-item.active {
    background-color: var(--primary);
    color: white;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
  }

  .nav-item.active .nav-icon {
    color: white;
  }

  @media (max-width: 768px) {
    .sidebar {
      top: auto;
      bottom: 0;
      width: 100%;
      height: 70px;
      border-right: none;
      border-top: 1px solid var(--border);
      flex-direction: row;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
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
      gap: 0;
    }

    .nav-item {
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem;
      border-radius: 0;
      flex: 1;
      font-size: 0.65rem;
    }

    .nav-item:hover {
      transform: none;
      background: transparent;
    }

    .nav-item.active {
      background-color: transparent;
      color: var(--primary);
      box-shadow: none;
      border-top: 3px solid var(--primary);
    }
  }
</style>

