<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import { userProfile } from '$lib/stores/mockData.svelte';
  import { User, Bell, Shield, LogOut, Trophy, Activity, Award, Settings as SettingsIcon } from 'lucide-svelte';
  import { base } from '$app/paths';
  import { page } from '$app/stores';

  let activeTab = $state('profile');

  // React to search parameters to switch tab on load
  $effect(() => {
    const tabParam = $page.url.searchParams.get('tab');
    if (tabParam) {
      activeTab = tabParam;
    }
  });

  let notificationsEnabled = $state(true);
  let emailAlerts = $state(false);

  // Edit profile states
  let profileName = $state(userProfile.name);
  let profileEmail = $state(userProfile.email);
  let saveSuccess = $state(false);

  function handleSaveProfile() {
    userProfile.name = profileName;
    userProfile.email = profileEmail;
    saveSuccess = true;
    setTimeout(() => {
      saveSuccess = false;
    }, 3000);
  }
</script>

<div class="page-header">
  <div class="header-title-row">
    <SettingsIcon size={24} class="text-primary" />
    <h2>Settings & Coach Hub</h2>
  </div>
  <p class="text-sm text-muted">Manage your credentials, preferences, and view head coach statistics.</p>
</div>

<div class="settings-layout">
  <!-- Sidebar Navigation within Settings -->
  <div class="settings-nav">
    <button 
      class="settings-tab" 
      class:active={activeTab === 'profile'}
      onclick={() => activeTab = 'profile'}
    >
      <User size={18} /> Profile Settings
    </button>
    
    <button 
      class="settings-tab" 
      class:active={activeTab === 'coach'}
      onclick={() => activeTab = 'coach'}
    >
      <Award size={18} /> Coach Hub
    </button>
    
    <button 
      class="settings-tab" 
      class:active={activeTab === 'notifications'}
      onclick={() => activeTab = 'notifications'}
    >
      <Bell size={18} /> Notification Panel
    </button>
    
    <button 
      class="settings-tab" 
      class:active={activeTab === 'security'}
      onclick={() => activeTab = 'security'}
    >
      <Shield size={18} /> Security & System
    </button>
  </div>

  <!-- Main Settings Content -->
  <div class="settings-content">
    {#if activeTab === 'profile'}
      <Card title="Profile Settings">
        <div class="profile-section">
          <div class="avatar-edit">
            <Avatar src={userProfile.avatar} alt={userProfile.name} size="xl" />
            <div class="avatar-details">
              <h4 class="font-black text-lg">{userProfile.name}</h4>
              <p class="text-xs text-muted mt-1">Role: {userProfile.role} • FC Bayern Munich</p>
              <Button variant="outline" size="sm" class="mt-2">Change Photo</Button>
            </div>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" bind:value={profileName} class="form-input" />
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" bind:value={profileEmail} class="form-input" />
            </div>
            <div class="form-group">
              <label for="role">Team Role</label>
              <input type="text" id="role" value={userProfile.role} disabled class="form-input disabled" />
              <span class="help-text">Only admins can modify system roles.</span>
            </div>
          </div>

          {#if saveSuccess}
            <div class="save-success-msg">
              ✓ Profile saved successfully!
            </div>
          {/if}

          <div class="form-actions">
            <Button variant="primary" onclick={handleSaveProfile}>Save Changes</Button>
          </div>
        </div>
      </Card>
    {/if}

    {#if activeTab === 'coach'}
      <!-- Coach Stats and License Page -->
      <Card noPadding class="coach-dashboard-card animate-in">
        <div class="coach-hero-banner">
          <div class="coach-hero-overlay"></div>
          <img src="{base}/images/Trainer/Vincent Kompany.png" alt="Vincent Kompany" class="coach-banner-img" />
          <div class="coach-hero-content">
            <div class="badge-role">Head Coach</div>
            <h2>Vincent Kompany</h2>
            <p>FC Bayern Munich First Team Manager</p>
          </div>
        </div>

        <div class="coach-dashboard-body">
          <!-- Quick Info Cards -->
          <div class="coach-details-grid">
            <div class="coach-detail-item">
              <span class="label">Nationality</span>
              <span class="value">Belgian 🇧🇪</span>
            </div>
            <div class="coach-detail-item">
              <span class="label">UEFA License</span>
              <span class="value text-primary font-bold">UEFA Pro License 🎓</span>
            </div>
            <div class="coach-detail-item">
              <span class="label">Preferred Formation</span>
              <span class="value">4-2-3-1 / 4-3-3 Attack ⚔️</span>
            </div>
            <div class="coach-detail-item">
              <span class="label">Appointed</span>
              <span class="value">July 1, 2024</span>
            </div>
          </div>

          <!-- Coach Philosophy -->
          <div class="philosophy-section mt-6">
            <h3>Coaching Philosophy</h3>
            <p>“Fluid possession, strict positioning, high aggressive counter-pressing (Gegenpressing), and rapid transitions. Dominating the pitch from the Allianz Arena locker rooms to the pitch lines.”</p>
          </div>

          <!-- Statistics Counters -->
          <h3 class="mt-6 font-extrabold text-base tracking-tight text-main border-bottom pb-2 mb-4">Coaching Statistics — FY 2026/27</h3>
          <div class="stats-counters-grid">
            <div class="stat-counter-card">
              <span class="count text-main">38</span>
              <span class="label">Matches</span>
            </div>
            <div class="stat-counter-card green">
              <span class="count text-success">29</span>
              <span class="label">Wins</span>
            </div>
            <div class="stat-counter-card yellow">
              <span class="count text-warning">5</span>
              <span class="label">Draws</span>
            </div>
            <div class="stat-counter-card red">
              <span class="count text-danger">4</span>
              <span class="label">Losses</span>
            </div>
            <div class="stat-counter-card highlight">
              <span class="count text-primary">76.3%</span>
              <span class="label">Win Rate</span>
            </div>
          </div>

          <!-- Goal Stats -->
          <div class="goal-stats-grid mt-4">
            <div class="goal-stat-box">
              <div class="stat-row">
                <span>Goals Scored</span>
                <span class="font-bold text-success">104</span>
              </div>
              <div class="stat-progress-bar bg-success" style="width: 100%"></div>
            </div>
            <div class="goal-stat-box">
              <div class="stat-row">
                <span>Goals Conceded</span>
                <span class="font-bold text-danger">32</span>
              </div>
              <div class="stat-progress-bar bg-danger" style="width: 30%"></div>
            </div>
          </div>

          <!-- Trophies & Achievements -->
          <h3 class="mt-6 font-extrabold text-base tracking-tight text-main border-bottom pb-2 mb-4">Honours & Trophies</h3>
          <div class="trophies-list-horizontal">
            <div class="trophy-badge-card">
              <Trophy class="text-warning" size={24} />
              <div class="trophy-details">
                <span class="title">Bundesliga Champions</span>
                <span class="season">2024/25 • Current Leader</span>
              </div>
            </div>
            <div class="trophy-badge-card">
              <Trophy class="text-warning" size={24} />
              <div class="trophy-details">
                <span class="title">DFB Pokal</span>
                <span class="season">2024/25 Champions</span>
              </div>
            </div>
            <div class="trophy-badge-card">
              <Activity class="text-primary" size={24} />
              <div class="trophy-details">
                <span class="title">UEFA Champions League</span>
                <span class="season">Active (Semifinals 2026)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    {/if}

    {#if activeTab === 'notifications'}
      <Card title="Notification Preferences">
        <div class="toggle-group">
          <div class="toggle-info">
            <h4>Push Notifications</h4>
            <p>Receive notifications on your device for events and messages.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" bind:checked={notificationsEnabled} />
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-group border-top">
          <div class="toggle-info">
            <h4>Email Alerts</h4>
            <p>Receive weekly summaries and important updates via email.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" bind:checked={emailAlerts} />
            <span class="slider"></span>
          </label>
        </div>
      </Card>
    {/if}

    {#if activeTab === 'security'}
      <Card title="Security & System Controls">
        <div class="toggle-group">
          <div class="toggle-info">
            <h4>Biometric Vault Access</h4>
            <p>Require face/fingerprint authentication for personal squad ledger access.</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" checked />
            <span class="slider"></span>
          </label>
        </div>
      </Card>

      <Card class="mt-6 border-danger">
        <div class="danger-zone">
          <div class="danger-info">
            <h4>Account Actions</h4>
            <p>Log out of your current coaching session or archive data.</p>
          </div>
          <Button variant="danger" class="gap-2"><LogOut size={18} /> Log Out</Button>
        </div>
      </Card>
    {/if}
  </div>
</div>

<style>
  .page-header {
    margin-bottom: 2rem;
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
  }

  .header-title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.375rem;
  }

  .page-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 850;
    color: var(--text-main);
  }

  .settings-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .settings-layout {
      grid-template-columns: 260px 1fr;
    }
  }

  .settings-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .settings-tab {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1.125rem;
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-muted);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: var(--shadow-sm);
  }

  .settings-tab:hover {
    background: var(--bg-color);
    color: var(--text-main);
    border-color: rgba(220, 38, 38, 0.15);
  }

  .settings-tab.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
  }

  .settings-content {
    display: flex;
    flex-direction: column;
  }

  .profile-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .avatar-edit {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: #fafafa;
    padding: 1.25rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
  }

  .avatar-details {
    display: flex;
    flex-direction: column;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .form-input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 0.9375rem;
    outline: none;
    font-weight: 600;
    color: var(--text-main);
    background: white;
    transition: all 0.2s;
  }

  .form-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
  }

  .form-input.disabled {
    background-color: var(--bg-color);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  .help-text {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .save-success-msg {
    background: rgba(5, 150, 105, 0.08);
    color: #059669;
    font-size: 0.875rem;
    font-weight: 700;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid rgba(5, 150, 105, 0.2);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  /* Coach Hub styling (football-style presentation) */
  .coach-dashboard-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .coach-hero-banner {
    height: 180px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    display: flex;
    align-items: center;
    padding: 2rem;
  }

  .coach-hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at right, rgba(220, 38, 38, 0.2) 0%, transparent 60%);
    z-index: 1;
  }

  .coach-banner-img {
    height: 130%;
    width: auto;
    object-fit: contain;
    position: absolute;
    right: 2rem;
    bottom: -15px;
    z-index: 2;
    filter: drop-shadow(0 4px 20px rgba(0,0,0,0.5));
  }

  .coach-hero-content {
    color: white;
    z-index: 3;
    position: relative;
  }

  .badge-role {
    display: inline-block;
    background: var(--primary);
    color: white;
    font-size: 0.6875rem;
    font-weight: 800;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .coach-hero-content h2 {
    font-size: 2rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.03em;
  }

  .coach-hero-content p {
    margin: 0.25rem 0 0;
    font-size: 0.9375rem;
    opacity: 0.8;
  }

  .coach-dashboard-body {
    padding: 2rem;
  }

  .coach-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1.25rem;
    background: #fafafa;
    border: 1px solid var(--border);
    padding: 1.25rem;
    border-radius: var(--radius-md);
  }

  .coach-detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .coach-detail-item .label {
    font-size: 0.6875rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .coach-detail-item .value {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .philosophy-section h3 {
    font-size: 1rem;
    font-weight: 850;
    color: var(--text-main);
    margin: 0 0 0.5rem 0;
  }

  .philosophy-section p {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--text-muted);
    font-style: italic;
    background: rgba(111, 177, 160, 0.04);
    border-left: 3px solid var(--primary);
    padding: 0.75rem 1rem;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    margin: 0;
  }

  .stats-counters-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 640px) {
    .stats-counters-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .stats-counters-grid .highlight {
      grid-column: span 2;
    }
  }

  .stat-counter-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.125rem 0.75rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: var(--shadow-sm);
  }

  .stat-counter-card .count {
    font-size: 1.625rem;
    font-weight: 900;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .stat-counter-card .label {
    font-size: 0.6875rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-counter-card.green { border-top: 3px solid var(--success); }
  .stat-counter-card.yellow { border-top: 3px solid var(--warning); }
  .stat-counter-card.red { border-top: 3px solid var(--danger); }
  .stat-counter-card.highlight { 
    border-top: 3px solid var(--primary);
    background: linear-gradient(180deg, rgba(220, 38, 38, 0.02) 0%, transparent 100%);
  }

  .goal-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 600px) {
    .goal-stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  .goal-stat-box {
    background: white;
    border: 1px solid var(--border);
    padding: 1rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }

  .goal-stat-box .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    font-weight: 750;
    color: var(--text-main);
    margin-bottom: 0.5rem;
  }

  .stat-progress-bar {
    height: 8px;
    border-radius: 4px;
  }

  .trophies-list-horizontal {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .trophy-badge-card {
    background: white;
    border: 1px solid var(--border);
    padding: 1rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: var(--shadow-sm);
  }

  .trophy-details {
    display: flex;
    flex-direction: column;
  }

  .trophy-details .title {
    font-size: 0.8125rem;
    font-weight: 850;
    color: var(--text-main);
  }

  .trophy-details .season {
    font-size: 0.6875rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  /* Toggles */
  .toggle-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 0;
  }

  .toggle-group.border-top {
    border-top: 1px solid var(--border);
  }

  .toggle-info h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9375rem;
    font-weight: 800;
    color: var(--text-main);
  }

  .toggle-info p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border);
    transition: .3s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--primary);
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }

  /* Danger Zone */
  :global(.border-danger) {
    border: 1px solid rgba(239, 68, 68, 0.3) !important;
  }

  .danger-zone {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .danger-info h4 {
    margin: 0 0 0.25rem 0;
    color: var(--danger);
    font-weight: 800;
  }

  .danger-info p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .border-bottom {
    border-bottom: 1px solid var(--border);
  }

  .pb-2 { padding-bottom: 0.5rem; }
  .mb-4 { margin-bottom: 1rem; }
  .bg-success { background-color: var(--success); }
  .bg-danger { background-color: var(--danger); }
  .text-success { color: var(--success) !important; }
  .text-warning { color: var(--warning) !important; }
  .text-danger { color: var(--danger) !important; }
  :global(.mt-6) { margin-top: 1.5rem; }
  :global(.gap-2) { gap: 0.5rem; }
</style>
