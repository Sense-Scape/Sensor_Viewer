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
		console.log(timeID + '-time');
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
						pointRadius: 0,
						data: TimeDomainYValues
					}
				]
			},
			options: {
				animation: {
					duration: 20
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
						pointRadius: 0,
						data: FreqDomainYValues
					}
				]
			},
			options: {
				animation: {
					duration: 20
				}
			}
		});

		FreqDomainChart.update();
	}

	onMount(() => {
		initTimeCanvas();
		initFreqCanvas();
		mounted = true;
	});

	$: {
		if (mounted) {
			let timeDatasets = [];
			const numChannels = TimeDomainYValues.length;

			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				timeDatasets.push({
					pointRadius: 0,
					data: TimeDomainYValues[channelIndex]
				});
			}

			TimeDomainChart.data.datasets = timeDatasets;
			TimeDomainChart.data.labels = TimeDomainXValues;

			let freqDatasets = [];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				freqDatasets.push({
					pointRadius: 0,
					data: FreqDomainYValues[channelIndex]
				});
			}

			FreqDomainChart.data.datasets = freqDatasets;
			FreqDomainChart.data.labels = FreqDomainXValues;

			TimeDomainChart.update();
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
