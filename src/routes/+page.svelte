<script lang="ts">
	import Chart from 'chart.js/auto';
	import SensorGroup from '$lib/SensorGroup.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Create a writable store initialized as an empty object (to mimic a map)
	var mapData = [];

	// Function to add an item to the "map"
	// function updateItemInMap(key, value) {
	// 	mapData.set(key, value);
	// }

	function updateItemInMap(key, value) {
		//const existingItemIndex = mapData.findIndex((item) => item.id === newItem.id);
		// console.log(key);
		// console.log(value);
		// console.log('----');

		let index = -1;
		for (let i = 0; i < mapData.length; i++) {
			if (JSON.stringify(mapData[i].key) === JSON.stringify(key)) {
				index = i;
				break;
			}
		}
		// new or first entry
		if (index == -1) {
			if (mapData.length == 0) {
				index = 0;
				mapData[index] = {
					key: key,
					value: value
				};
			} else {
				index = mapData.length;

				mapData[index] = {
					key: key,
					value: value
				};
			}
			console.log('Added at index:  ' + index);
		} else {
			console.log('Found at index:  (START)' + index);
			console.log(mapData[index].value['TimeDomainYValues']);

			for (const key in value) {
				mapData[index].value[key] = JSON.parse(JSON.stringify(value[key]));
			}
			console.log(mapData[index].value['TimeDomainYValues']);
			console.log('Found at index:  (END)' + index);
		}
	}

	// Create the time domain chart and link mount it to the HTML canvas
	onMount(() => {
		const TimeWebSocket = new WebSocket('ws://localhost:10100/DataTypes/TimeChunk');

		// console.log(sensorGroup);
		TimeWebSocket.addEventListener('message', async (event) => {
			var timeParsedData = JSON.parse(event.data);
			let timeDatasets = [];

			// Check if we are tracking it in the mpa already
			// And if not then track it
			const newData = timeParsedData['TimeChunk']['Channels'];
			const numChannels = timeParsedData['TimeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				timeDatasets[channelIndex] = newData[channelIndex];
			}
			// console.log(newData);
			let a = {
				timeSampleRate: timeParsedData['TimeChunk']['SampleRate'],
				timeChunkSize: timeParsedData['TimeChunk']['ChunkSize'],
				sourceIdentifier: timeParsedData['TimeChunk']['SourceIdentifier'],
				TimeDomainYValues: timeDatasets,
				TimeDomainXValues: Array.from({ length: 512 }, (_, index) => index + 1),
				timeID: timeParsedData['TimeChunk']['SourceIdentifier'] + '-time'
			};
			updateItemInMap(timeParsedData['TimeChunk']['SourceIdentifier'], a);
		});

		const FreqWebSocket = new WebSocket('ws://localhost:10100/DataTypes/FFTMagnitudeChunk');
		let FreqParsedData = null;
		let freqDatasets = [];
		FreqWebSocket.addEventListener('message', async (event) => {
			const receivedMessage = event.data;
			FreqParsedData = JSON.parse(receivedMessage);

			// Check if we are tracking it in the mpa already
			// And if not then track it
			// const newData = FreqParsedData['FFTMagnitudeChunk']['Channels'];
			// const numChannels = FreqParsedData['FFTMagnitudeChunk']['NumChannels'];
			// for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
			// 	freqDatasets[channelIndex] = newData[channelIndex];
			// }
			// updateItemInMap(FreqParsedData['FFTMagnitudeChunk']['SourceIdentifier'], {
			// 	freqSampleRate: FreqParsedData['FFTMagnitudeChunk']['SampleRate'],
			// 	freqChunkSize: FreqParsedData['FFTMagnitudeChunk']['ChunkSize'],
			// 	sourceIdentifier: FreqParsedData['FFTMagnitudeChunk']['SourceIdentifier'],
			// 	FreqDomainYValues: freqDatasets,
			// 	FreqDomainXValues: Array.from({ length: 512 }, (_, index) => index + 1),
			// 	timeID: FreqParsedData['FFTMagnitudeChunk']['SourceIdentifier'] + '-time'
			// });
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
