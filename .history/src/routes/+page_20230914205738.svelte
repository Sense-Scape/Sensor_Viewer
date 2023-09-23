<script lang="ts">
	import { onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js/auto';

	// components
	import AudioStream from '../AudioStream.svelte';
	import Card from '../Card.svelte';

	// stores
	import { sampleRateStore } from '../stores';

	let sampleRate: number | null = null;

	const unsubscribe = sampleRateStore.subscribe((value) => {
		sampleRate = value;
	});

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

	let chartData = [20, 100, 50, 12, 20, 130, 45];
	let Labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	let ctx;
	let chartCanvas;

	onMount(async (promise) => {
		ctx = chartCanvas.getContext('2d');
		var chart = new chartjs(ctx, {
			type: 'bar',
			data: {
				labels: Labels,
				datasets: [
					{
						label: 'Unit Sales',
						data: chartData
					}
				]
			}
		});
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
