import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csp: {
			directives: {
				'script-src': [
					'self',
					'data:',
					'va.vercel-scripts.com',
					'vercel.live',
					// @ts-expect-error csp directives are inferred as strings https://github.com/sveltejs/kit/issues/11906
					'ws://localhost:10100/',
					'ws://localhost:10101/'
				],
				'connect-src': [
					'self',
					'vitals.vercel-insights.com',
					'vitals.vercel-analytics.com',
					// @ts-expect-error csp directives are inferred as strings https://github.com/sveltejs/kit/issues/11906
					'ws://localhost:10100/',
					'ws://localhost:10101/'
				]
			}
		}
	}
};

export default config;
