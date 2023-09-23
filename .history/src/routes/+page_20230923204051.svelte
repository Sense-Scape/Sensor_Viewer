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
	let chart;
	let yValues;
	let xValues;
	let ctx;

	// Callback that will receive and print web socket dat
	$: {
		if (typeof window !== 'undefined') {
			if (existingWebSocket) {
				existingWebSocket.close(); // Close the previous WebSocket instance
			}
			if (true) {
				const newWebSocket = new WebSocket('ws://localhost:10010/DataTypes/TimeChunk');
				newWebSocket.addEventListener('message', async (event) => {
					// Try receive and decode data in JSON document
					const receivedMessage = event.data; // Access the received message from the event object
					const jsonObject = JSON.parse(receivedMessage);
					// Then try extract the data and plot it
					try {
						chart.data.datasets[0].data = jsonObject['TimeChunk']['Channels']['0'];
						const x = (chart.data.labels = Array.from(
							{ length: chart.data.datasets[0].dat.len },
							(_, index) => index + 1
						));
						chart.update();
					} catch (error) {
						console.error('Error processing WebSocket message:', error);
					} // Re-render the chart with updated data
				});
			}
		}
	}

	// Create the chart when the component is mounted
	onMount(() => {
		ctx = document.getElementById('myChart');

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: xValues,
				datasets: [
					{
						data: yValues,
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

<div class="container">
	<div class="time block">
		<canvas bind:this={chart} id="myChart" />
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
