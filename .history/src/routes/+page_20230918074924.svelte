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

	// Callback that will receive and print web socket data
	$: {
		if (typeof window !== 'undefined') {
			// if (existingWebSocket) {
			//     existingWebSocket.close(); // Close the previous WebSocket instance
			// }
			if (true) {
				const newWebSocket = new WebSocket('ws://localhost:10010/DataTypes/TimeChunk');
				newWebSocket.addEventListener('message', async (event) => {
					const receivedMessage = event.data; // Access the received message from the event object
					console.log('Received message:', receivedMessage);
				});
			}
		}
	}

	// Setting up of time domain plot
	let yValues = [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478];
	let xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
	let ctx;
	let chartCanvas;

	function UpdateChartData(chartData) {
		console.log(`Received value in callback: ${value}`);
		// Do something with the value
	}

	new Chart('myChart', {
		type: 'line',
		data: {
			labels: Labels,
			datasets: [
				{
					data: chartData,
					borderColor: 'red',
					fill: false
				}
			]
		},
		options: {
			legend: { display: false }
		}
	});
</script>

<svelte:head>
	<title>Sense-Scape | Overview</title>
</svelte:head>

<div class="container">
	<div class="time block">
		<canvas bind:this={chartCanvas} id="myChart" />
	</div>
	<div class="freq block">
		<Card>
			<p>freq</p>
		</Card>
	</div>
	<div class="rate block">
		<Card>
			<div>
				<p>rate</p>
				<p>Rate: {sampleRate}</p>
			</div>
		</Card>
	</div>
	<div class="samples block">
		<Card>
			<p>samples</p>
			<AudioStream />
			<p>don't press play, it's loud dummy data</p>
		</Card>
	</div>
	<div class="resolution block">
		<Card>
			<p>resolution</p>
		</Card>
	</div>
</div>

<style>
	p {
		margin: 0;
	}

	.block {
		padding: 0.8rem;
	}

	.container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 3fr 3fr;
		grid-template-areas:
			'rate samples resolution'
			'time time time'
			'freq freq freq';
		text-align: center;
		height: 90vh;
	}

	@media only screen and (max-width: 600px) {
		.container {
			display: block;
		}
	}

	.time {
		grid-area: time;
	}

	.freq {
		grid-area: freq;
	}

	.rate {
		grid-area: rate;
	}

	.samples {
		grid-area: samples;
	}

	.resolution {
		grid-area: resolution;
	}
</style>
