<script>
	import '../app.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	
	let { children } = $props();
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
