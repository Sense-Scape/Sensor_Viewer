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
	let yValues = [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478];
	let xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
	let ctx;
	let chartCanvas;

	// Callback that will receive and print web socket dat
	$: {
		if (typeof window !== 'undefined') {
			// if (existingWebSocket) {
			//     existingWebSocket.close(); // Close the previous WebSocket instance
			// }
			if (true) {
				const newWebSocket = new WebSocket('ws://localhost:10010/DataTypes/TimeChunk');
				newWebSocket.addEventListener('message', async (event) => {
					const receivedMessage = event.data; // Access the received message from the event object
					//console.log('Received message:', receivedMessage);

					// const position = receivedMessage.length - 2; // Position at which you want to insert the character
					// const characterToInsert = ',';
					// const modifiedString =
					// 	receivedMessage.slice(0, position) +
					// 	characterToInsert +
					// 	receivedMessage.slice(position);

					console.log(receivedMessage);
					const jsonObject = JSON.parse(receivedMessage);
					// console.log(modifiedString);

					// Re-render the chart with updated data
					chart.data.datasets[0].data = jsonObject.TimeChunk.Channels;
					chart.data.labels = Array.from({ length: jsonObject.TimeChunk.Channels[0].length });
					chart.update();
				});
			}
		}
	}

	// Create the chart when the component is mounted
	onMount(() => {
		const ctx = document.getElementById('myChart');
		chart = new Chart('myChart', {
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
				legend: { display: false }
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
