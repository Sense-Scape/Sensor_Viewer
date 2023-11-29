<script lang="ts" defer>
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Define the props expected by SensorGroup
	export let timeSampleRate: number = -1;
	export let timeChunkSize: number = -1;
	export let freqSampleRate: number = -1;
	export let freqChunkSize: number = -1;
	export let sourceIdentifier: string = '-';

	let ctxTime: HTMLElement;
	let TimeDomainChart;
	export let TimeDomainYValues: number[][] = [];
	export let TimeDomainXValues: number[] = [];
	export let timeID: string;

	let ctxFreq: HTMLElement;
	let FreqDomainChart;
	export let FreqDomainYValues: number[][] = [];
	export let FreqDomainXValues: number[] = [];

	$: mounted = false;

	export let freqID: string;

	function initTimeCanvas() {
		console.log(timeID + '-freq');
		if (!document.getElementById(timeID)) {
			return;
		}
		ctxTime = document.getElementById(timeID).getContext('2d');
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
		TimeDomainChart.update();
	}

	function initFreqCanvas() {
		console.log(freqID + '-freq');
		if (!document.getElementById(freqID)) {
			return;
		}
		ctxFreq = document.getElementById(freqID).getContext('2d');

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
					duration: 1
				}
			}
		});

		FreqDomainChart.update();
	}

	onMount(() => {
		console.log('mounting');
		initTimeCanvas();
		initFreqCanvas();
		console.log('mounted');
		mounted = true;
	});

	$: {
		const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

		if (mounted) {
			let timeDatasets = [];
			const numChannels = TimeDomainYValues.length;
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				timeDatasets.push({
					data: TimeDomainYValues[channelIndex],
					borderColor: colors[channelIndex],
					fill: false
				});
			}
			console.log(TimeDomainChart);
			TimeDomainChart.data.datasets = timeDatasets;
			TimeDomainChart.data.labels = TimeDomainXValues;
			TimeDomainChart.update();
		}

		if (mounted) {
			let freqDatasets = [];
			const numChannels = FreqDomainYValues.length;
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				freqDatasets.push({
					data: FreqDomainYValues[channelIndex],
					borderColor: colors[channelIndex],
					fill: false
				});
			}
			console.log(FreqDomainChart);
			FreqDomainChart.data.datasets = freqDatasets;
			FreqDomainChart.data.labels = FreqDomainXValues;
			FreqDomainChart.update();
		}
	}
</script>

<div class-="sensorGroup">
	<div class="sensorGroupTitle">Sensor ID: {sourceIdentifier}</div>
	<div class="graphSuperGroup">
		<div class="graphGroup">
			<div class="parameterContainer">
				<p class="parameter">Sample Rate: {timeSampleRate}</p>
				<p class="parameter">Chunk Size: {timeChunkSize}</p>
			</div>
			<div>
				<canvas class="canvas" id={timeID} bind:this={TimeDomainChart} />
			</div>
		</div>
		<div class="graphGroup">
			<div class="parameterContainer">
				<p class="parameter">Sample Rate: {freqSampleRate}</p>
				<p class="parameter">Chunk Size: {freqChunkSize}</p>
			</div>
			<div>
				<canvas class="canvas" id={freqID} bind:this={FreqDomainChart} />
			</div>
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
