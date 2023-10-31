<script lang="ts">
	import { onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	// components
	import AudioStream from '../AudioStream.svelte';
	import Card from '../Card.svelte';

	// stores
	import { sampleRateStore } from '../stores';

	let sampleRate: number | null = null;

	const unsubscribe = sampleRateStore.subscribe((value) => {
		sampleRate = value;
	});

	// Setting up of time domain plot
	let TimeDomainChart;
	let TimeDomainYValues = [0];
	let TimeDomainXValues = [0];
	let ctxTime;

	let FreqDomainChart;
	let FreqDomainYValues = [0];
	let FreqDomainXValues = [0];
	let ctxFreq;

	// Callback function used to connect to the websocket, retrieve data
	// and update the time domain plot
	$: {
		if (typeof window !== 'undefined') {
			if (true) {
				// First we try connect to the websocket and listen
				// To the TimeChunk topic and start listening
			}
		}
	}

	// Create the time domain chart and link mount it to the HTML canvas
	onMount(() => {
		const TimeWebSocket = new WebSocket('ws://localhost:10100/DataTypes/TimeChunk');
		TimeWebSocket.addEventListener('message', async (event) => {
			// Lets get the JSON document from the websocket and extract the data
			const receivedMessage = event.data;
			const jsonObject = JSON.parse(receivedMessage);
			// Then try update the plot with the data
			try {
				TimeDomainChart.data.datasets[0].data = jsonObject['TimeChunk']['Channels']['0'];
				TimeDomainChart.data.labels = Array.from({ length: 512 }, (_, index) => index + 1);
				TimeDomainChart.update();
			} catch (error) {
				console.error('Error processing WebSocket message:', error);
			} // Re-render the chart with updated data
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
					duration: 0 // Set the duration to 0 for all animations
				}
			}
		});

		const FreqWebSocket = new WebSocket('ws://localhost:10100/DataTypes/FFTMagnitudeChunk');
		FreqWebSocket.addEventListener('message', async (event) => {
			// Lets get the JSON document from the websocket and extract the data
			const receivedMessage = event.data;
			const jsonObject = JSON.parse(receivedMessage);
			// Then try update the plot with the data
			try {
				FreqDomainChart.data.datasets[0].data = jsonObject['FFTMagnitudeChunk']['Channels']['0'];
				FreqDomainChart.data.labels = Array.from({ length: 512 }, (_, index) => index + 1);
				FreqDomainChart.update();
			} catch (error) {
				console.error('Error processing WebSocket message:', error);
			} // Re-render the chart with updated data
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
					duration: 0 // Set the duration to 0 for all animations
				}
			}
		});
	});
</script>

<svelte:head>
	<title>Sense-Scape | Overview</title>
</svelte:head>

<div class="pageContainer">
	<div class="graphContainer">
		<canvas class="timePlot" bind:this={TimeDomainChart} id="TimeDomainChart" />
		<canvas class="freqPlot" bind:this={FreqDomainChart} id="FreqDomainChart" />
	</div>
</div>

<style>
	.graphContainer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 50vh; /* Reduced height from 100vh */
	}

	.timePlot,
	.freqPlot {
		width: 250px;
		height: 100px;
	}

	@media screen and (max-width: 600px) {
		.timePlot,
		.freqPlot {
			height: 200px;
		}
	}
</style>
