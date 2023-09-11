import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/confi';
import { type ViteDevServer, defineConfig } from 'vite'
import { Server } from 'socket.io'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	define: {
		'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID)
	}
});
