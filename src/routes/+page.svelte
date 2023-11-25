<script lang="ts">
	import Chart from 'chart.js/auto';
	import SensorGroup from '$lib/SensorGroup.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	// Setting up of time domain plot
	// let TimeDomainChart;
	// let TimeDomainYValues = [0];
	// let TimeDomainXValues = [0];
	// let ctxTime;

	// export let timeSampleRate = 'X';
	// export let timeChunkSize = 'X';

	// let FreqDomainChart;
	// let FreqDomainYValues = [0];
	// let FreqDomainXValues = [0];
	// let ctxFreq;

	// export let freqSampleRate = 'X';
	// export let freqChunkSize = 'X';

	// $: sensorGroup = [];

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

	// Function to return data map
	function getItemFromMap(key) {
		let value;
		sensorGroup.subscribe((map) => {
			value = map[key];
		})();
		return value;
	}

	// Function to convert the writable map content into an array of objects
	function mapToArrayOfObjects() {
		let result = [];
		sensorGroup.subscribe((map) => {
			result = Object.entries(map).map(([key, value]) => ({ key, value }));
		})();
		return result;
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
		console.log('here');

		TimeWebSocket.addEventListener('message', async (event) => {
			// Check if parsed data exists, otherwise parse it once
			console.log('here1');

			// if (!parsedData) {
			const receivedMessage = event.data;

			// 	// Create datasets array
			// 	const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
			// 	for (
			// 		let channelIndex = 0;
			// 		channelIndex < parsedData['TimeChunk']['NumChannels'];
			// 		channelIndex++
			// 	) {
			// 		const dataset = {
			// 			labels: undefined,
			// 			data: [],
			// 			borderColor: colors[channelIndex],
			// 			fill: false
			// 		};
			// 		datasets.push(dataset);
			// 	}

			// 	console.log(parsedData['TimeChunk']['SourceIndentifier']);
			// }
			parsedData = JSON.parse(receivedMessage);
			console.log('here');

			// Lets try get the source identifier key
			let sourceIdentifierKey = JSON.parse(event.data)['TimeChunk']['SourceIndentifier'];
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
				TimeDomainYValues: datasets
			});
		});
		// 	const FreqWebSocket = new WebSocket('ws://localhost:10100/DataTypes/FFTMagnitudeChunk');
		// 	let FreqParsedData = null;
		// 	let freqDatasets = [];
		// 	FreqWebSocket.addEventListener('message', async (event) => {
		// 		// Check if parsed data exists, otherwise parse it once
		// 		if (!FreqParsedData) {
		// 			const receivedMessage = event.data;
		// 			FreqParsedData = JSON.parse(receivedMessage);
		// 			// Create datasets array
		// 			const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
		// 			for (
		// 				let channelIndex = 0;
		// 				channelIndex < FreqParsedData['FFTMagnitudeChunk']['NumChannels'];
		// 				channelIndex++
		// 			) {
		// 				const dataset = {
		// 					labels: undefined,
		// 					data: [],
		// 					borderColor: colors[channelIndex],
		// 					fill: false
		// 				};
		// 				freqDatasets.push(dataset);
		// 			}
		// 		}
		// 		// Update datasets with new data
		// 		const newData = JSON.parse(event.data)['FFTMagnitudeChunk']['Channels'];
		// 		const numChannels = JSON.parse(event.data)['FFTMagnitudeChunk']['NumChannels'];
		// 		for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
		// 			freqDatasets[channelIndex].data = newData[channelIndex];
		// 		}
		// 		// Update chart data efficiently
		// 		FreqDomainChart.data.datasets = freqDatasets;
		// 		FreqDomainChart.data.labels = Array.from({ length: 512 }, (_, index) => index + 1);
		// 		FreqDomainChart.update();
		// 		if (freqSampleRate !== JSON.parse(event.data)['FFTMagnitudeChunk']['SampleRate']) {
		// 			freqSampleRate = JSON.parse(event.data)['FFTMagnitudeChunk']['SampleRate'];
		// 		}
		// 		if (freqChunkSize !== JSON.parse(event.data)['FFTMagnitudeChunk']['ChunkSize']) {
		// 			freqChunkSize = JSON.parse(event.data)['FFTMagnitudeChunk']['ChunkSize'];
		// 		}
		//});
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
