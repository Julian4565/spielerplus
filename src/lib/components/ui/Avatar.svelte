<script lang="ts">
  let { 
    src, 
    alt = 'Avatar', 
    size = 'md',
    class: className = ''
  }: { 
    src?: string, 
    alt?: string,
    size?: 'sm' | 'md' | 'lg' | 'xl',
    class?: string
  } = $props();

  let initials = $derived(alt.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());
</script>

<div class="avatar avatar-{size} {className}">
  {#if src}
    <img {src} {alt} class="avatar-img" />
  {:else}
    <span class="avatar-initials">{initials}</span>
  {/if}
</div>

<style>
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    overflow: hidden;
    background-color: var(--primary);
    color: white;
    font-weight: 600;
    flex-shrink: 0;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-initials {
    user-select: none;
  }

  /* Sizes */
  .avatar-sm {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }
  .avatar-md {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  .avatar-lg {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
  .avatar-xl {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }
</style>
