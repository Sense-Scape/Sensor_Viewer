<script lang="ts">
	import Chart from 'chart.js/auto';
	import SensorGroup from '$lib/SensorGroup.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Create a writable store initialized as an empty object (to mimic a map)
	const sensorGroup = writable({});
	let items = [];
	// Subscribe to changes in the writable map and update the items array
	sensorGroup.subscribe((map) => {
		items = Object.entries(map).map(([key, value]) => ({ key, value }));
	});

	// Function to add an item to the "map"
	function updateItemInMap(key, value) {
		sensorGroup.update((map) => {
			return { ...map, [key]: value };
		});
	}

	// Callback function used to connect to the websocket, retrieve data
	// and update the time domain plot
	$: {
		if (typeof window !== 'undefined') {
			// if (true) {
			// First we try connect to the websocket and listen
			// To the TimeChunk topic and start listening
			// }
		}
	}

	// Create the time domain chart and link mount it to the HTML canvas
	onMount(() => {
		const TimeWebSocket = new WebSocket('ws://localhost:10100/DataTypes/TimeChunk');
		let parsedData = null;
		let datasets = [];

		// console.log(sensorGroup);
		TimeWebSocket.addEventListener('message', async (event) => {
			const receivedMessage = event.data;
			parsedData = JSON.parse(receivedMessage);

			// Check if we are tracking it in the mpa already
			// And if not then track it
			const newData = JSON.parse(event.data)['TimeChunk']['Channels'];
			const numChannels = JSON.parse(event.data)['TimeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				datasets[channelIndex] = newData[channelIndex];
			}

			updateItemInMap(JSON.parse(event.data)['TimeChunk']['SourceIndentifier'], {
				timeSampleRate: JSON.parse(event.data)['TimeChunk']['SampleRate'],
				timeChunkSize: JSON.parse(event.data)['TimeChunk']['ChunkSize'],
				sourceIdentifier: JSON.parse(event.data)['TimeChunk']['SourceIndentifier'],
				TimeDomainYValues: datasets,
				TimeDomainXValues: Array.from({ length: 512 }, (_, index) => index + 1)
			});
		});

		const FreqWebSocket = new WebSocket('ws://localhost:10100/DataTypes/FFTMagnitudeChunk');
		let FreqParsedData = null;
		let freqDatasets = [];
		FreqWebSocket.addEventListener('message', async (event) => {
			const receivedMessage = event.data;
			parsedData = JSON.parse(receivedMessage);

			// Check if we are tracking it in the mpa already
			// And if not then track it
			const newData = JSON.parse(event.data)['FFTMagnitudeChunk']['Channels'];
			const numChannels = JSON.parse(event.data)['FFTMagnitudeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				datasets[channelIndex] = newData[channelIndex];
			}

			updateItemInMap(JSON.parse(event.data)['FFTMagnitudeChunk']['SourceIndentifier'], {
				timeSampleRate: JSON.parse(event.data)['FFTMagnitudeChunk']['SampleRate'],
				timeChunkSize: JSON.parse(event.data)['FFTMagnitudeChunk']['ChunkSize'],
				sourceIdentifier: JSON.parse(event.data)['FFTMagnitudeChunk']['SourceIndentifier'],
				TimeDomainYValues: datasets,
				TimeDomainXValues: Array.from({ length: 512 }, (_, index) => index + 1)
			});
		});
	});

	// function UpdateGraphGroup(numChannel, channelData, sampleRate, chunkSize) {}
</script>

<svelte:head>
	<title>Sense-Scape | Overview</title>
	<meta name="description" content="Some sweet description words" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="Sense-Scape | Overview" />
	<meta property="og:site_name" content="Sense Scape Site" />
	<!-- TODO make this dynamic -->
	<meta property="og:url" content="https://svelte-website-inky.vercel.app/" />
	<meta property="og:description" content="Some sweet description words for Open Graph" />
	<meta property="og:type" content="website" />
	<!-- <meta property="og:image" content="" /> -->

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="svelte-website-inky.vercel.app" />
	<!-- TODO make this dynamic -->
	<meta property="twitter:url" content="https://svelte-website-inky.vercel.app/" />
	<meta name="twitter:title" content="Sense-Scape | Overview" />
	<meta name="twitter:description" content="Some sweet description words for twitter" />
	<!-- <meta name="twitter:image" content=""> -->
</svelte:head>

<div>
	<div id="sensors">
		{#each items as { key, value }}
			<SensorGroup {...value} />
		{/each}
	</div>
</div>

<style>
</style>
