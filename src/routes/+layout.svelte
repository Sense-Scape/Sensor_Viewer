<script>
	import { dev, browser } from '$app/environment';
	import { inject } from '@vercel/analytics';

	// util
	import { webVitals } from '$lib/vitals';

	// components
	import Navbar from '$lib/Navbar.svelte';

	//store
	import { page } from '$app/stores';

	inject({ mode: dev ? 'development' : 'production' });

	let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;

	$: if (browser && analyticsId) {
		console.log(
			`%c[Web Vitals]%c`,
			'color: rgb(120, 120, 120)',
			'color: inherit',
			'Updating vitals'
		);
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId: analyticsId,
			debug: dev
		});
	} else if (browser) {
		console.log(
			`%c[Web Vitals]%c`,
			'color: rgb(120, 120, 120)',
			'color: inherit',
			'Skipping vitals - no analyticsId'
		);
	}
</script>

<main>
	<Navbar />
	<!-- +page.svelte is rendered in this <slot> -->
	<slot />
</main>
