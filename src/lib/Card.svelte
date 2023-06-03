<!-- Card.svelte -->
<script lang="ts">
</script>

<div>
	<slot>Card should wrap some content</slot>
</div>

<style>
	div {
		border-radius: 0.2rem;
		text-shadow: 4rem;
		background-color: var(--secondary-color);
		height: 100%;
		width: 100%;
		padding: 0.2rem;
	}
</style>
