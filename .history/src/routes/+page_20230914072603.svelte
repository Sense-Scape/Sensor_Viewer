<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Line } from 'svelte-chartjs';

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

	let chartData = {
		labels: ['January', 'February', 'March', 'April', 'May'],
		datasets: [
			{
				label: 'My Line Chart',
				data: [10, 25, 32, 45, 30],
				borderColor: 'rgba(75, 192, 192, 1)', // Line color
				borderWidth: 2, // Line width
				fill: false // Fill area under the line
			}
		]
	};
</script>

<svelte:head>
	<title>Sense-Scape | Overview</title>
</svelte:head>

<div class="container">
	<div class="time block">
		<Card>
			<p>time</p>
		</Card>
	</div>
	<div class="freq block">
		<Line {chartData} {options} />
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
