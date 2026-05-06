<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import { userProfile } from '$lib/stores/mockData.svelte';
  import { User, Bell, Shield, LogOut } from 'lucide-svelte';

  let notificationsEnabled = $state(true);
  let emailAlerts = $state(false);
</script>

<div class="page-header">
  <h2>Settings</h2>
</div>

<div class="settings-layout">
  <!-- Sidebar Navigation within Settings -->
  <div class="settings-nav">
    <button class="settings-tab active"><User size={18} /> Profile</button>
    <button class="settings-tab"><Bell size={18} /> Notifications</button>
    <button class="settings-tab"><Shield size={18} /> Security & Roles</button>
  </div>

  <!-- Main Settings Content -->
  <div class="settings-content">
    <Card title="Profile Settings">
      <div class="profile-section">
        <div class="avatar-edit">
          <Avatar src={userProfile.avatar} alt={userProfile.name} size="xl" />
          <Button variant="outline" size="sm">Change Photo</Button>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" value={userProfile.name} class="form-input" />
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" value={userProfile.email} class="form-input" />
          </div>
          <div class="form-group">
            <label for="role">Team Role</label>
            <input type="text" id="role" value={userProfile.role} disabled class="form-input disabled" />
            <span class="help-text">Only admins can change roles.</span>
          </div>
        </div>

        <div class="form-actions">
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>
    </Card>

    <Card title="Notification Preferences" class="mt-6">
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

    <Card class="mt-6 border-danger">
      <div class="danger-zone">
        <div class="danger-info">
          <h4>Account Actions</h4>
          <p>Log out of your current session or manage your account data.</p>
        </div>
        <Button variant="danger" class="gap-2"><LogOut size={18} /> Log Out</Button>
      </div>
    </Card>
  </div>
</div>

<style>
  .page-header {
    margin-bottom: 1.5rem;
  }

  .page-header h2 {
    margin: 0;
  }

  .settings-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .settings-layout {
      grid-template-columns: 250px 1fr;
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
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    transition: all 0.2s;
  }

  .settings-tab:hover {
    background: var(--bg-color);
    color: var(--text-main);
  }

  .settings-tab.active {
    background: rgba(111, 177, 160, 0.1);
    color: var(--primary);
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
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-main);
  }

  .form-input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .form-input:focus {
    border-color: var(--primary);
  }

  .form-input.disabled {
    background-color: var(--bg-color);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  .help-text {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  /* Toggles */
  .toggle-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }

  .toggle-group.border-top {
    border-top: 1px solid var(--border);
  }

  .toggle-info h4 {
    margin: 0 0 0.25rem 0;
  }

  .toggle-info p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
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
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
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
  }

  .danger-info p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  :global(.mt-6) { margin-top: 1.5rem; }
  :global(.gap-2) { gap: 0.5rem; }
</style>
