<script lang="ts">
	import Chart from 'chart.js/auto';

	// Define the props expected by SensorGroup
	export let timeSampleRate: number = -1;
	export let timeChunkSize: number = -1;
	export let freqSampleRate: number = -1;
	export let freqChunkSize: number = -1;

	// export let TimeDomainChart;
	// export let TimeDomainYValues = [0];
	// export let TimeDomainXValues = [0];
	// export let ctxTime;

	// export let FreqDomainChart;
	// export let FreqDomainYValues = [0];
	// export let FreqDomainXValues = [0];
	// export let ctxFreq;

	// export function InitialiseTimeGraph() {
	// 	return (TimeDomainChart = new Chart(ctxTime, {
	// 		type: 'line',
	// 		data: {
	// 			labels: TimeDomainXValues,
	// 			datasets: [
	// 				{
	// 					data: TimeDomainYValues,
	// 					borderColor: 'red',
	// 					fill: false
	// 				}
	// 			]
	// 		},
	// 		options: {
	// 			legend: { display: false },
	// 			animation: {
	// 				// Disable animations
	// 				duration: 1 // Set the duration to 0 for all animations
	// 			}
	// 		}
	// 	}));
	// }
	// export function InitialiseFreqGraph() {
	// 	return (FreqDomainChart = new Chart(ctxFreq, {
	// 		type: 'line',
	// 		data: {
	// 			labels: FreqDomainXValues,
	// 			datasets: [
	// 				{
	// 					data: FreqDomainYValues,
	// 					borderColor: 'red',
	// 					fill: false
	// 				}
	// 			]
	// 		},
	// 		options: {
	// 			legend: { display: false },
	// 			animation: {
	// 				duration: 1
	// 			}
	// 		}
	// 	}));
	// }
</script>

<div class-="sensorGroup">
	<div class="sensorGroupTitle">Test</div>
	<div class="graphSuperGroup">
		<div class="graphGroup">
			<div class="parameterContainer">
				<p class="parameter">Sample Rate: {timeSampleRate}</p>
				<p class="parameter">Chunk Size: {timeChunkSize}</p>
			</div>
			<!-- <div>
				<canvas class="canvas" bind:this={TimeDomainChart} id="TimeDomainChart" />
			</div> -->
		</div>
		<div class="graphGroup">
			<div class="parameterContainer">
				<p class="parameter">Sample Rate: {freqSampleRate}</p>
				<p class="parameter">Chunk Size: {freqChunkSize}</p>
			</div>
			<!-- <div>
				<canvas class="canvas" bind:this={FreqDomainChart} id="FreqDomainChart" />
			</div> -->
		</div>
	</div>
</div>

<style>
	.sensorGroup {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.sensorGroupTitle {
		text-align: center;
		width: 100%;
		height: 10%;
	}
	.graphSuperGroup {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 90%;
	}

	.graphGroup {
		width: 50%;
		padding: 10px;
	}
	.canvas {
		max-width: 100%;
		max-height: 100%;
		width: 100%;
	}

	.parameterContainer {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	.parameter {
		text-align: center;
		max-width: 100%;
		max-height: 100%;
		width: 100%;
	}
</style>
