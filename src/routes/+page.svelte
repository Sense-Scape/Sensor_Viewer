<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	// Setting up of time domain plot
	let TimeDomainChart;
	let TimeDomainYValues = [0];
	let TimeDomainXValues = [0];
	let ctxTime;

	export let timeSampleRate = 'X';
	export let timeChunkSize = 'X';

	let FreqDomainChart;
	let FreqDomainYValues = [0];
	let FreqDomainXValues = [0];
	let ctxFreq;

	export let freqSampleRate = 'X';
	export let freqChunkSize = 'X';

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
		TimeWebSocket.addEventListener('message', async (event) => {
			// Check if parsed data exists, otherwise parse it once
			if (!parsedData) {
				const receivedMessage = event.data;
				parsedData = JSON.parse(receivedMessage);

				// Create datasets array
				const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
				for (
					let channelIndex = 0;
					channelIndex < parsedData['TimeChunk']['NumChannels'];
					channelIndex++
				) {
					const dataset = {
						labels: undefined,
						data: [],
						borderColor: colors[channelIndex],
						fill: false
					};
					datasets.push(dataset);
				}
			}

			const newData = JSON.parse(event.data)['TimeChunk']['Channels'];
			const numChannels = JSON.parse(event.data)['TimeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				datasets[channelIndex].data = newData[channelIndex];
			}

			// Update chart data efficiently
			TimeDomainChart.data.datasets = datasets;
			TimeDomainChart.data.labels = Array.from({ length: 512 }, (_, index) => index + 1);
			TimeDomainChart.update();

			if (timeSampleRate !== JSON.parse(event.data)['TimeChunk']['SampleRate']) {
				timeSampleRate = JSON.parse(event.data)['TimeChunk']['SampleRate'];
			}
			if (timeChunkSize !== JSON.parse(event.data)['TimeChunk']['ChunkSize']) {
				timeChunkSize = JSON.parse(event.data)['TimeChunk']['ChunkSize'];
			}
		});

		ctxTime = document.getElementById('TimeDomainChart');
		TimeDomainChart = new Chart(ctxTime, {
			type: 'line',
			data: {
				labels: TimeDomainXValues,
				datasets: [
					{
						data: TimeDomainYValues,
						borderColor: 'red',
						fill: false
					}
				]
			},
			options: {
				legend: { display: false },
				animation: {
					// Disable animations
					duration: 1 // Set the duration to 0 for all animations
				}
			}
		});

		const FreqWebSocket = new WebSocket('ws://localhost:10100/DataTypes/FFTMagnitudeChunk');
		let FreqParsedData = null;
		let freqDatasets = [];

		FreqWebSocket.addEventListener('message', async (event) => {
			// Check if parsed data exists, otherwise parse it once
			if (!FreqParsedData) {
				const receivedMessage = event.data;
				FreqParsedData = JSON.parse(receivedMessage);

				// Create datasets array
				const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
				for (
					let channelIndex = 0;
					channelIndex < FreqParsedData['FFTMagnitudeChunk']['NumChannels'];
					channelIndex++
				) {
					const dataset = {
						labels: undefined,
						data: [],
						borderColor: colors[channelIndex],
						fill: false
					};
					freqDatasets.push(dataset);
				}
			}

			// Update datasets with new data
			const newData = JSON.parse(event.data)['FFTMagnitudeChunk']['Channels'];
			const numChannels = JSON.parse(event.data)['FFTMagnitudeChunk']['NumChannels'];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				freqDatasets[channelIndex].data = newData[channelIndex];
			}

			// Update chart data efficiently
			FreqDomainChart.data.datasets = freqDatasets;
			FreqDomainChart.data.labels = Array.from({ length: 512 }, (_, index) => index + 1);
			FreqDomainChart.update();

			if (freqSampleRate !== JSON.parse(event.data)['FFTMagnitudeChunk']['SampleRate']) {
				freqSampleRate = JSON.parse(event.data)['FFTMagnitudeChunk']['SampleRate'];
			}
			if (freqChunkSize !== JSON.parse(event.data)['FFTMagnitudeChunk']['ChunkSize']) {
				freqChunkSize = JSON.parse(event.data)['FFTMagnitudeChunk']['ChunkSize'];
			}
		});

		ctxFreq = document.getElementById('FreqDomainChart');
		FreqDomainChart = new Chart(ctxFreq, {
			type: 'line',
			data: {
				labels: FreqDomainXValues,
				datasets: [
					{
						data: FreqDomainYValues,
						borderColor: 'red',
						fill: false
					}
				]
			},
			options: {
				legend: { display: false },
				animation: {
					// Disable animations
					duration: 1 // Set the duration to 0 for all animations
				}
			}
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
	<!-- <div class="pageContainer"> -->
	<div class="graphContainer">
		<div class="graphGroup">
			<div class="parameterContainer">
				<p class="parameter">Sample Rate: {timeSampleRate}</p>
				<p class="parameter">Chunk Size: {timeChunkSize}</p>
			</div>
			<div>
				<canvas class="canvas" bind:this={TimeDomainChart} id="TimeDomainChart" />
			</div>
		</div>
		<div class="graphGroup">
			<div class="parameterContainer">
				<p class="parameter">Sample Rate: {freqSampleRate}</p>
				<p class="parameter">Chunk Size: {freqChunkSize}</p>
			</div>
			<div>
				<canvas class="canvas" bind:this={FreqDomainChart} id="FreqDomainChart" />
			</div>
		</div>
	</div>
	<!-- </div> -->
</div>

<style>
	.graphContainer {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.graphGroup {
		width: 50%;
		padding: 10px;
	}
	.canvas {
		max-width: 100%; /* Set desired width for each canvas */
		max-height: 100%;
		width: 100%;
	}

	.parameterContainer {
		display: flex;
		/* justify-content: space-between; */
		flex-direction: row;
		width: 100%;
	}
	.parameter {
		max-width: 100%; /* Set desired width for each canvas */
		max-height: 100%;
		width: 100%;
	}
</style>
