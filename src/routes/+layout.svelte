<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import { refreshFootballData } from '$lib/stores/footballStore.svelte.ts';
	
	let { children } = $props();

	onMount(() => {
		refreshFootballData();
	});
</script>

<div class="app-container">
	<Sidebar />
	<div class="main-content">
		<Header />
		<main class="page-content">
			{@render children()}
		</main>
	</div>
</div>
