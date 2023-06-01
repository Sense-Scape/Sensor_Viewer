<script>
	import { dev, browser } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { page } from '$app/stores';
	import { webVitals } from '../lib/vitals';
	inject({ mode: dev ? 'development' : 'production' });

	let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

	$: if (browser && analyticsId) {
        console.log('[Web Vitals]', 'startings vitals');
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId: analyticsId,
			debug: dev
		});
	} else {
		console.log('[Web Vitals]', 'skipping vitals', browser ? 'running in a browser': 'not running in a browser', 'analyticsId:', analyticsId);
	}
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
