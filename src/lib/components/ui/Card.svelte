<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    children, 
    class: className = '',
    title = '',
    noPadding = false
  }: { 
    children: Snippet, 
    class?: string,
    title?: string,
    noPadding?: boolean
  } = $props();
</script>

<div class="card {className}" class:no-padding={noPadding}>
  {#if title}
    <div class="card-header">
      <h3 class="card-title">{title}</h3>
    </div>
  {/if}
  <div class="card-body" class:p-0={noPadding}>
    {@render children()}
  </div>
</div>

<style>
  .card {
    background: var(--surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .card-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-main);
  }

  .card-body {
    padding: 1.5rem;
    flex: 1;
  }
  
  .card-body.p-0 {
    padding: 0;
  }
  
  .no-padding .card-body {
    padding: 0;
  }
</style>
