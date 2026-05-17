<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
  import { getLocalBayernSquad } from '$lib/stores/footballStore.svelte.ts';
  import { Download, Calendar, UserCheck, ShieldAlert, Award, FileText } from 'lucide-svelte';

  // Sort by attendance (descending)
  let sortedMembers = $derived([...getLocalBayernSquad()].sort((a, b) => b.attendance - a.attendance));
  
  let averageAttendance = $derived(
    getLocalBayernSquad().length > 0 
      ? Math.round(getLocalBayernSquad().reduce((acc, m) => acc + m.attendance, 0) / getLocalBayernSquad().length)
      : 0
  );

  let selectedMember = $state<any>(null);

  function openAttendanceDetails(member: any) {
    const totalSessions = 24;
    const attended = Math.round(totalSessions * (member.attendance / 100));
    const excused = Math.max(0, Math.floor((totalSessions - attended) * 0.7));
    const unexcused = Math.max(0, totalSessions - attended - excused);

    // List of simulated sessions
    const sessions = [
      { name: 'UCL Matchday Preparation', type: 'Match Prep', date: '2026-05-14', status: attended > 22 ? 'Attended' : 'Excused' },
      { name: 'Tactical Board & Corner Routines', type: 'Tactical', date: '2026-05-12', status: 'Attended' },
      { name: 'Strength & Aerobic Recovery', type: 'Fitness', date: '2026-05-10', status: attended > 18 ? 'Attended' : 'Excused' },
      { name: 'Small-Sided Positioning Game', type: 'Tactical', date: '2026-05-08', status: attended > 15 ? 'Attended' : 'Late (Excused)' },
      { name: 'Bundesliga Pre-Match Warmup', type: 'Match Prep', date: '2026-05-05', status: 'Attended' },
      { name: 'Agility & High-Speed Pressing', type: 'Fitness', date: '2026-05-02', status: unexcused > 0 ? 'Missed (No Notice)' : 'Attended' }
    ];

    selectedMember = {
      ...member,
      totalSessions,
      attended,
      excused,
      unexcused,
      sessions
    };
  }
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
      <div role="button" tabindex="0" onclick={() => openAttendanceDetails(member)} class="attendance-item hover-row clickable-attendance-row">
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

{#if selectedMember}
  <div class="modal-overlay animate-fade" onclick={() => selectedMember = null}>
    <div class="modal-content animate-in" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => selectedMember = null}>&times;</button>

      <div class="modal-header-banner">
        <div class="member-avatar-large-wrapper">
          <img 
            src={selectedMember.avatar} 
            alt={selectedMember.name} 
            class="modal-avatar-large"
            onerror={(e) => { 
              const target = e.currentTarget as HTMLImageElement;
              target.src = '/images/players/placeholder.svg';
            }} 
          />
          {#if selectedMember.jerseyNumber}
            <span class="modal-jersey-large">{selectedMember.jerseyNumber}</span>
          {/if}
        </div>
        <h2 class="modal-member-name">{selectedMember.name}</h2>
        <span class="modal-member-role">{selectedMember.role}</span>
      </div>

      <div class="modal-body-container">
        <div class="attendance-summary-grid">
          <div class="summary-box success">
            <span class="box-val">{selectedMember.attended} / {selectedMember.totalSessions}</span>
            <span class="box-lbl">Attended</span>
          </div>
          
          <div class="summary-box warning">
            <span class="box-val">{selectedMember.excused}</span>
            <span class="box-lbl">Excused</span>
          </div>

          <div class="summary-box danger">
            <span class="box-val">{selectedMember.unexcused}</span>
            <span class="box-lbl">Unexcused</span>
          </div>
        </div>

        <div class="sessions-log-card">
          <h4>📋 Recent Session Ledger</h4>
          <div class="sessions-list-scroll">
            {#each selectedMember.sessions as session}
              <div class="session-log-row">
                <div class="session-info">
                  <span class="s-name">{session.name}</span>
                  <span class="s-meta">{session.date} • {session.type}</span>
                </div>
                <div class="session-status-badge {session.status.toLowerCase().replace(' ', '-').replace(/[()]/g, '')}">
                  {session.status}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div class="professional-standing-bar">
          <div class="bar-meta">
            <span>Overall Standings Benchmark</span>
            <span class="bar-score">{selectedMember.attendance}%</span>
          </div>
          <ProgressBar value={selectedMember.attendance} max={100} height="10px" color={selectedMember.attendance >= 90 ? 'success' : (selectedMember.attendance >= 70 ? 'warning' : 'danger')} />
        </div>
      </div>
    </div>
  </div>
{/if}

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

  /* Clickable attendance item */
  .clickable-attendance-row {
    cursor: pointer;
    transition: all 0.25s ease !important;
  }

  .clickable-attendance-row:hover {
    transform: translateY(-2px);
    background: rgba(220, 38, 38, 0.02) !important;
    border-color: rgba(220, 38, 38, 0.15) !important;
  }

  /* Interactive Premium Modal Styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 1.5rem;
  }

  .modal-content {
    background: var(--surface);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 580px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    position: relative;
    color: var(--text-main);
    border: 1px solid var(--border);
  }

  .close-btn {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: rgba(15, 23, 42, 0.05);
    border: none;
    font-size: 1.75rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .close-btn:hover {
    background: rgba(220, 38, 38, 0.1);
    color: var(--primary);
  }

  .modal-header-banner {
    padding: 3rem 2rem 2rem;
    background: linear-gradient(180deg, rgba(220, 38, 38, 0.04) 0%, transparent 100%);
    text-align: center;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .member-avatar-large-wrapper {
    position: relative;
    width: 90px;
    height: 90px;
    margin-bottom: 1rem;
  }

  .modal-avatar-large {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .modal-jersey-large {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--primary);
    color: white;
    font-size: 0.8125rem;
    font-weight: 800;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: var(--shadow-sm);
  }

  .modal-member-name {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0;
    letter-spacing: -0.02em;
  }

  .modal-member-role {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  .modal-body-container {
    padding: 2rem;
  }

  /* Summary Grid */
  .attendance-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .summary-box {
    border-radius: var(--radius-md);
    padding: 1.25rem 1rem;
    text-align: center;
    border: 1px solid var(--border);
    background: white;
    box-shadow: var(--shadow-sm);
  }

  .summary-box .box-val {
    display: block;
    font-size: 1.625rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .summary-box .box-lbl {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .summary-box.success .box-val { color: #059669; }
  .summary-box.warning .box-val { color: #d97706; }
  .summary-box.danger .box-val { color: var(--primary); }

  /* Sessions Ledger */
  .sessions-log-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    margin-bottom: 2rem;
  }

  .sessions-log-card h4 {
    margin: 0 0 1.25rem;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-main);
    border-bottom: 2px solid rgba(15, 23, 42, 0.05);
    padding-bottom: 0.5rem;
  }

  .sessions-list-scroll {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    max-height: 240px;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  .session-log-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(15, 23, 42, 0.03);
  }

  .session-log-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .session-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .session-info .s-name {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--text-main);
  }

  .session-info .s-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* Status Badges */
  .session-status-badge {
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .session-status-badge.attended {
    background-color: rgba(5, 150, 105, 0.1);
    color: #059669;
  }

  .session-status-badge.excused {
    background-color: rgba(217, 119, 6, 0.1);
    color: #d97706;
  }

  .session-status-badge.late-excused {
    background-color: rgba(245, 158, 11, 0.15);
    color: #b45309;
  }

  .session-status-badge.missed-no-notice {
    background-color: rgba(220, 38, 38, 0.1);
    color: var(--primary);
  }

  /* Professional benchmark bar */
  .professional-standing-bar {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.25rem 1.5rem;
    box-shadow: var(--shadow-sm);
  }

  .professional-standing-bar .bar-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 0.625rem;
  }

  .professional-standing-bar .bar-score {
    color: var(--text-main);
    font-weight: 800;
    font-size: 0.9375rem;
  }

  /* Animation effects */
  .animate-fade {
    animation: overlayFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-in {
    animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes overlayFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @media (max-width: 900px) {
    .attendance-item {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>

