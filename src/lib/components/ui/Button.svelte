<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    children, 
    variant = 'primary', 
    size = 'md',
    class: className = '',
    type = 'button',
    onclick
  }: { 
    children: Snippet, 
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
    size?: 'sm' | 'md' | 'lg',
    class?: string,
    type?: 'button' | 'submit' | 'reset',
    onclick?: (e: MouseEvent) => void
  } = $props();
</script>

<button {type} class="btn btn-{variant} btn-{size} {className}" {onclick}>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    outline: none;
  }

  /* Sizes */
  .btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
  .btn-md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  /* Variants */
  .btn-primary {
    background-color: var(--primary);
    color: white;
  }
  .btn-primary:hover {
    background-color: var(--primary-hover);
  }

  .btn-secondary {
    background-color: var(--bg-color);
    color: var(--text-main);
    border: 1px solid var(--border);
  }
  .btn-secondary:hover {
    background-color: var(--border);
  }

  .btn-outline {
    background-color: transparent;
    color: var(--primary);
    border: 1px solid var(--primary);
  }
  .btn-outline:hover {
    background-color: rgba(111, 177, 160, 0.1);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--text-main);
  }
  .btn-ghost:hover {
    background-color: var(--bg-color);
  }
  
  .btn-danger {
    background-color: var(--danger);
    color: white;
  }
  .btn-danger:hover {
    opacity: 0.9;
  }
</style>
