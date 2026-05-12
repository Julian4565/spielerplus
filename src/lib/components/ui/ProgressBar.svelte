<script lang="ts">
  let { 
    value = 0, 
    max = 100, 
    color = 'primary',
    showLabel = false,
    label = '',
    height = '8px'
  }: { 
    value?: number, 
    max?: number,
    color?: 'primary' | 'success' | 'warning' | 'danger',
    showLabel?: boolean,
    label?: string,
    height?: string
  } = $props();

  let percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div class="progress-container">
  {#if showLabel || label}
    <div class="progress-label">
      <span>{label}</span>
      <span class="pct">{Math.round(percentage)}%</span>
    </div>
  {/if}
  <div class="progress-track" style="height: {height}">
    <div 
      class="progress-fill color-{color}" 
      style="width: {percentage}%;"
    >
      <div class="glow"></div>
    </div>
  </div>
</div>

<style>
  .progress-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .progress-label .pct {
    color: var(--text-main);
  }

  .progress-track {
    width: 100%;
    background-color: var(--bg-color);
    border-radius: var(--radius-full);
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .progress-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }

  .glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: flow 2s infinite linear;
  }

  @keyframes flow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .color-primary { background: linear-gradient(90deg, var(--primary), #ef4444); }
  .color-success { background: linear-gradient(90deg, var(--success), #34d399); }
  .color-warning { background: linear-gradient(90deg, var(--warning), #fbbf24); }
  .color-danger { background: linear-gradient(90deg, var(--danger), #f87171); }
</style>

