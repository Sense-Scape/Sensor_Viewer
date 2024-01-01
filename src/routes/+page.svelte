<script lang="ts">
	import SensorGroup from '$lib/SensorGroup.svelte';
	import { onMount } from 'svelte';
	import { Button, Badge, Stack } from '@svelteuidev/core';

	// Create a writable store initialized as an empty object (to mimic a map)
	var mapData = [];

	function handleClick(i) {
		mapData[i].display = !mapData[i].display;
	}

	/**
	 * This function checks if a plot is active or not
	 * @param {key} key of the plot of interest.
	 * @returns {bool} Whether the plot is active or not.
	 */
	function IsPlotActive(sourceIdentifier) {
		// First we check if we have seen this source identifier before
		for (let i = 0; i < mapData.length; i++) {
			if (JSON.stringify(mapData[i].sourceIdentifier) === JSON.stringify(sourceIdentifier)) {
				return mapData[i].display;
			}
		}
		// Process in the case we have never seen this identifier before
		return true;
	}
	function updateItemInMap(ChunkSourceIdentifier, ChunkData) {
		// Start by checking if we have seen this source identifier before
		let index = -1;
		for (let i = 0; i < mapData.length; i++) {
			if (JSON.stringify(mapData[i].sourceIdentifier) === JSON.stringify(ChunkSourceIdentifier)) {
				index = i;
				break;
			}
		}

		// If not add it to our array
		if (index == -1) {
			if (mapData.length == 0) {
				index = 0;
				mapData[index] = {
					sourceIdentifier: ChunkSourceIdentifier,
					value: ChunkData,
					display: false
				};
			} else {
				index = mapData.length;
				mapData[index] = {
					sourceIdentifier: ChunkSourceIdentifier,
					value: ChunkData,
					display: false
				};
			}
		} else {
			// If we have seen it, update its values
			if (mapData[index].display) {
				console.log('updating' + JSON.stringify(index));
				console.log(JSON.parse(JSON.stringify(ChunkData)));
				for (const ChunkKey in ChunkData) {
					mapData[index].value[ChunkKey] = JSON.parse(JSON.stringify(ChunkData[ChunkKey]));
				}
			}
		}
	}

	// Create the time domain chart and link mount it to the HTML canvas
	onMount(() => {
		const TimeWebSocket = new WebSocket('ws://localhost:10100/DataTypes/TimeChunk');

		TimeWebSocket.addEventListener('message', async (event) => {
			var timeParsedData = JSON.parse(event.data);
			let timeDatasets = [];
			// If a plot is not active do not process its data to save time
			if (!IsPlotActive(timeParsedData['TimeChunk']['SourceIdentifier'])) {
				return;
			}
			// Convert data to array
			const newData = timeParsedData['TimeChunk']['Channels'];
			const numChannels = timeParsedData['TimeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				timeDatasets[channelIndex] = newData[channelIndex];
			}

			updateItemInMap(timeParsedData['TimeChunk']['SourceIdentifier'], {
				timeSampleRate: timeParsedData['TimeChunk']['SampleRate'],
				timeChunkSize: timeParsedData['TimeChunk']['ChunkSize'],
				sourceIdentifier: timeParsedData['TimeChunk']['SourceIdentifier'],
				TimeDomainYValues: timeDatasets,
				timeID: JSON.stringify(timeParsedData['TimeChunk']['SourceIdentifier']) + '-time',
				freqID: JSON.stringify(timeParsedData['TimeChunk']['SourceIdentifier']) + '-freq'
			});
		});

		const FreqWebSocket = new WebSocket('ws://localhost:10100/DataTypes/FFTMagnitudeChunk');
		let FreqParsedData = null;
		let freqDatasets = [];
		FreqWebSocket.addEventListener('message', async (event) => {
			FreqParsedData = JSON.parse(event.data);
			// If a plot is not active do not process its data to save time
			if (!IsPlotActive(FreqParsedData['FFTMagnitudeChunk']['SourceIdentifier'])) {
				return;
			}

			const newData = FreqParsedData['FFTMagnitudeChunk']['Channels'];
			const numChannels = FreqParsedData['FFTMagnitudeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				freqDatasets[channelIndex] = newData[channelIndex];
			}

			updateItemInMap(FreqParsedData['FFTMagnitudeChunk']['SourceIdentifier'], {
				freqSampleRate: FreqParsedData['FFTMagnitudeChunk']['SampleRate'],
				freqChunkSize: FreqParsedData['FFTMagnitudeChunk']['ChunkSize'],
				sourceIdentifier: FreqParsedData['FFTMagnitudeChunk']['SourceIdentifier'],
				FreqDomainYValues: freqDatasets,
				freqID: JSON.stringify(FreqParsedData['FFTMagnitudeChunk']['SourceIdentifier']) + '-freq',
				timeID: JSON.stringify(FreqParsedData['FFTMagnitudeChunk']['SourceIdentifier']) + '-time'
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
	<div class="container">
		<div class="spacer">
			<Stack align="center" spacing="xs">
				<Badge color="gray" size="xl" radius="lg">Device ID</Badge>
				{#each mapData as data, i}
					<div class="Button">
						<Button
							variant="light"
							color="gray"
							size="sm"
							ripple
							on:click={handleClick.bind(this, i)}>{data.sourceIdentifier}</Button
						>
					</div>
				{/each}
			</Stack>
		</div>
		<div class="list2" id="sensors">
			{#each mapData as data}
				{#if data.display}
					<SensorGroup {...data.value} />
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.Button {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spacer {
		flex-direction: row;
		width: 20%;
		height: 100%;
	}

	.list2 {
		flex-direction: row;
		width: 80%;
		height: 100%;
	}

	.container {
		display: flex;
		flex-direction: row;
	}
</style>
