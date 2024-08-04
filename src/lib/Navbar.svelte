<script lang="ts">
	import StatusText from '$lib/StatusText.svelte';
</script>

<div>
	<section>
		<nav>
			<a href="/">Home</a>
			<a href="/map">Map</a>
		</nav>
		
	</section>
</div>

<style>
	section {
		display: flex;
		height: 10vh;
		width: 100%;
		align-items: center;
		background-color: var(--secondary-background-color);
	}

	a {
		color: var(--dark-text-color);
		margin-left: 0.5rem;
		margin-right: 0.5rem;
	}
</style>
