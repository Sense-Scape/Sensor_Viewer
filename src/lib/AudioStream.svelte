<!-- AudioStream.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { sampleRateStore } from './stores';

	let audioContext: AudioContext | null = null;
	let dummySource: AudioBufferSourceNode | null = null;

	async function startStream() {
		try {
			audioContext = new AudioContext({ sampleRate: 44100 });
			dummySource = createDummyAudioSource(audioContext, 10); // 10 seconds duration
			const sampleRate = dummySource.buffer?.sampleRate ?? null; // Get the sample rate
			sampleRateStore.set(sampleRate); // Set the sample rate in the store
			dummySource.connect(audioContext.destination);
			dummySource.start();
		} catch (error) {
			console.error('Error creating audio context:', error);
		}
	}

	function stopStream() {
		if (dummySource) {
			dummySource.stop();
			dummySource.disconnect();
			dummySource = null;
		}
		if (audioContext) {
			audioContext.close();
			audioContext = null;
			sampleRateStore.set(null);
		}
	}

	let cleanup: () => void = () => {
		// Initialize as empty function
	};
	onMount(() => {
		cleanup = () => {
			if (dummySource) {
				dummySource.stop();
				dummySource.disconnect();
				dummySource = null;
			}
			if (audioContext) {
				audioContext.close();
				audioContext = null;
			}
		};
	});

	onDestroy(() => cleanup());

	function createDummyAudioSource(
		audioContext: AudioContext,
		duration: number
	): AudioBufferSourceNode {
		const sampleRate = audioContext.sampleRate;
		const frameCount = duration * sampleRate;
		const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
		const channelData = buffer.getChannelData(0);

		for (let i = 0; i < frameCount; i++) {
			channelData[i] = Math.random() * 2 - 1; // Generate random audio samples between -1 and 1
		}

		const source = audioContext.createBufferSource();
		source.buffer = buffer;

		return source;
	}
</script>

<main>
	<h1>Audio Stream Component</h1>
	{#if dummySource}
		<button on:click={stopStream}>Stop Stream</button>
	{:else}
		<button on:click={startStream}>Start Stream</button>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>
