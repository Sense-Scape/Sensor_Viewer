<script>
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    inject({ mode: dev ? 'development' : 'production' });
</script>

<main>
    <!-- +page.svelte is rendered in this <slot> -->
    <slot />
</main>