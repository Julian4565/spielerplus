<script lang="ts">
  import { page } from '$app/stores';
  import { getLocalBayernSquad } from '$lib/stores/footballStore.svelte.ts';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { ArrowLeft, MapPin, Calendar, Award, Target, Activity } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let playerId = $derived($page.params.id);
  
  let player = $derived(
    getLocalBayernSquad().find(p => p.id === playerId) || getLocalBayernSquad()[0]
  );
  
  // Calculate mock stats based on ID to remain deterministic
  let stats = $derived({
    appearances: 15 + (parseInt(playerId) % 15),
    goals: player?.position === 'Attacker' ? 5 + (parseInt(playerId) % 10) : player?.position === 'Midfielder' ? (parseInt(playerId) % 5) : 0,
    assists: player?.position === 'Attacker' || player?.position === 'Midfielder' ? 2 + (parseInt(playerId) % 8) : 1,
    minutesPlayed: 900 + (parseInt(playerId) % 1500)
  });
</script>

{#if player}
  <div class="page-header">
    <Button variant="ghost" class="back-btn" onclick={() => goto('/team')}>
      <ArrowLeft size={20} class="mr-2" /> Back to Team
    </Button>
  </div>

  <div class="profile-layout">
    <div class="sidebar">
      <Card noPadding class="profile-card">
        <div class="profile-header-bg">
          <div class="jersey-number">{player.jerseyNumber || '—'}</div>
        </div>
        <div class="profile-avatar-wrapper">
          <img 
            src={player.avatar} 
            alt={player.name} 
            class="profile-avatar" 
          />
          <div class="availability-badge {player.availability}"></div>
        </div>
        <div class="profile-info text-center p-6">
          <h1 class="text-2xl font-black mb-1">{player.name}</h1>
          <p class="text-primary font-bold uppercase tracking-wider mb-4">{player.position}</p>
          
          <div class="quick-stats flex justify-center gap-6 border-t border-slate-200 pt-4 mt-2">
            <div class="stat text-center">
              <span class="block text-xs font-bold text-slate-400 mb-1">AGE</span>
              <span class="block text-lg font-black">{new Date().getFullYear() - new Date(player.birthdate).getFullYear()}</span>
            </div>
            <div class="stat text-center">
              <span class="block text-xs font-bold text-slate-400 mb-1">CONTRACT</span>
              <span class="block text-lg font-black">2027</span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <div class="main-content">
      <Card title="Season Statistics 2026/27">
        <div class="stats-grid">
          <div class="stat-box">
            <Activity size={24} class="text-primary mb-2" />
            <div class="stat-val">{stats.appearances}</div>
            <div class="stat-lbl">Appearances</div>
          </div>
          <div class="stat-box">
            <Target size={24} class="text-primary mb-2" />
            <div class="stat-val">{stats.goals}</div>
            <div class="stat-lbl">Goals</div>
          </div>
          <div class="stat-box">
            <Award size={24} class="text-primary mb-2" />
            <div class="stat-val">{stats.assists}</div>
            <div class="stat-lbl">Assists</div>
          </div>
          <div class="stat-box">
            <Calendar size={24} class="text-primary mb-2" />
            <div class="stat-val">{stats.minutesPlayed}</div>
            <div class="stat-lbl">Minutes Played</div>
          </div>
        </div>
      </Card>
      
      <Card title="Player Details" class="mt-6">
        <div class="details-list">
          <div class="detail-item">
            <span class="label">Date of Birth</span>
            <span class="value">{new Date(player.birthdate).toLocaleDateString('en-GB')}</span>
          </div>
          <div class="detail-item">
            <span class="label">Nationality</span>
            <span class="value">Germany</span>
          </div>
          <div class="detail-item">
            <span class="label">Attendance Rate</span>
            <span class="value text-success font-bold">{player.attendance}%</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
{/if}

<style>
  .page-header {
    margin-bottom: 2rem;
  }
  
  .profile-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .profile-layout {
      grid-template-columns: 350px 1fr;
    }
  }

  .profile-card {
    overflow: hidden;
  }

  .profile-header-bg {
    height: 120px;
    background: linear-gradient(135deg, var(--primary), #881337);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .jersey-number {
    font-size: 5rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.15);
    line-height: 1;
  }

  .profile-avatar-wrapper {
    position: relative;
    width: 160px;
    height: 160px;
    margin: -80px auto 1rem;
    border-radius: 50%;
    border: 6px solid var(--surface);
    background: white;
    box-shadow: var(--shadow-md);
  }

  .profile-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .availability-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 4px solid var(--surface);
  }
  
  .availability-badge.available { background: var(--success); }
  .availability-badge.sick { background: var(--danger); }
  .availability-badge.vacation { background: var(--warning); }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
  }

  .stat-box {
    background: var(--bg-color);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .stat-val {
    font-size: 2rem;
    font-weight: 900;
    color: var(--text-main);
    line-height: 1.2;
  }

  .stat-lbl {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .details-list {
    display: flex;
    flex-direction: column;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border);
  }

  .detail-item:last-child {
    border-bottom: none;
  }

  .detail-item .label {
    font-weight: 600;
    color: var(--text-muted);
  }

  .detail-item .value {
    font-weight: 700;
    color: var(--text-main);
  }
</style>
