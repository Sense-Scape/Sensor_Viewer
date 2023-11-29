<script lang="ts">
	import Chart from 'chart.js/auto';
	import SensorGroup from '$lib/SensorGroup.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Create a writable store initialized as an empty object (to mimic a map)
	let mapData = [];

	// Function to add an item to the "map"
	// function updateItemInMap(key, value) {
	// 	mapData.set(key, value);
	// }

	function updateItemInMap(key, value) {
		//const existingItemIndex = mapData.findIndex((item) => item.id === newItem.id);
		let index = -1;
		for (let i = 0; i < mapData.length; i++) {
			if (JSON.stringify(mapData[i].key) === JSON.stringify(key)) {
				index = i;
				break;
			}
		}
		console.log('VV');
		console.log(key);
		console.log(index);
		if (index !== -1) {
			// Update the existing item
			let a = Object.assign(mapData[index].value, value);
			mapData[index].value = a;
		} else {
			// Add the new item if it doesn't exist
			let newItem = { key: key, value: value }; // Assuming key represents the 'id' of the item
			mapData.push(newItem);
		}

		console.log();
	}

	// Create the time domain chart and link mount it to the HTML canvas
	onMount(() => {
		const TimeWebSocket = new WebSocket('ws://localhost:10100/DataTypes/TimeChunk');
		let timeParsedData = null;
		let timeDatasets = [];

		// console.log(sensorGroup);
		TimeWebSocket.addEventListener('message', async (event) => {
			const receivedMessage = event.data;
			timeParsedData = JSON.parse(receivedMessage);

			// Check if we are tracking it in the mpa already
			// And if not then track it
			const newData = JSON.parse(event.data)['TimeChunk']['Channels'];
			const numChannels = JSON.parse(event.data)['TimeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				timeDatasets[channelIndex] = newData[channelIndex];
			}

			updateItemInMap(JSON.parse(event.data)['TimeChunk']['SourceIdentifier'], {
				timeSampleRate: JSON.parse(event.data)['TimeChunk']['SampleRate'],
				timeChunkSize: JSON.parse(event.data)['TimeChunk']['ChunkSize'],
				sourceIdentifier: JSON.parse(event.data)['TimeChunk']['SourceIdentifier'],
				TimeDomainYValues: timeDatasets,
				TimeDomainXValues: Array.from({ length: 512 }, (_, index) => index + 1),
				timeID: JSON.stringify(JSON.parse(event.data)['TimeChunk']['SourceIdentifier']) + '-time'
			});
		});

		const FreqWebSocket = new WebSocket('ws://localhost:10100/DataTypes/FFTMagnitudeChunk');
		let FreqParsedData = null;
		let freqDatasets = [];
		FreqWebSocket.addEventListener('message', async (event) => {
			const receivedMessage = event.data;
			FreqParsedData = JSON.parse(receivedMessage);

			// Check if we are tracking it in the mpa already
			// And if not then track it
			const newData = JSON.parse(event.data)['FFTMagnitudeChunk']['Channels'];
			const numChannels = JSON.parse(event.data)['FFTMagnitudeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				freqDatasets[channelIndex] = newData[channelIndex];
			}
			console.log('---');
			console.log(JSON.parse(event.data));
			updateItemInMap(JSON.parse(event.data)['FFTMagnitudeChunk']['SourceIdentifier'], {
				freqSampleRate: JSON.parse(event.data)['FFTMagnitudeChunk']['SampleRate'],
				freqChunkSize: JSON.parse(event.data)['FFTMagnitudeChunk']['ChunkSize'],
				sourceIdentifier: JSON.parse(event.data)['FFTMagnitudeChunk']['SourceIdentifier'],
				FreqDomainYValues: freqDatasets,
				FreqDomainXValues: Array.from({ length: 512 }, (_, index) => index + 1),
				freqID:
					JSON.stringify(JSON.parse(event.data)['FFTMagnitudeChunk']['SourceIdentifier']) + '-freq'
			});
		});
	});
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
		{#each mapData as data}
			<SensorGroup {...data.value} />
		{/each}
	</div>
</div>

<style>
</style>
