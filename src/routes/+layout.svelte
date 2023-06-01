<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });
</script>

<main>
	<header>
		<nav>
			<a href="/">Home</a>
			<a href="/about">About</a>
		</nav>
	</header>
	<!-- +page.svelte is rendered in this <slot> -->
	<slot />
</main>

<style>
	header {
		display: flex;
		height: 10vh;
		width: 100%;
		align-items: center;
	}

	a {
		margin-left: 1rem;
	}
</style>
