<script lang="ts">
  let { 
    value = 0, 
    max = 100, 
    color = 'primary',
    showLabel = false,
    label = ''
  }: { 
    value?: number, 
    max?: number,
    color?: 'primary' | 'success' | 'warning' | 'danger',
    showLabel?: boolean,
    label?: string
  } = $props();

  let percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div class="progress-container">
  {#if showLabel || label}
    <div class="progress-label">
      <span>{label}</span>
      <span>{Math.round(percentage)}%</span>
    </div>
  {/if}
  <div class="progress-track">
    <div 
      class="progress-fill color-{color}" 
      style="width: {percentage}%;"
    ></div>
  </div>
</div>

<style>
  .progress-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-main);
  }

  .progress-track {
    width: 100%;
    height: 8px;
    background-color: var(--border);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.5s ease-out;
  }

  .color-primary { background-color: var(--primary); }
  .color-success { background-color: var(--success); }
  .color-warning { background-color: var(--warning); }
  .color-danger { background-color: var(--danger); }
</style>
