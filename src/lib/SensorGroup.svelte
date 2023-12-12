<script lang="ts" defer>
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Badge } from '@svelteuidev/core';
	import { WebglPlot, WebglLine, ColorRGBA } from 'webgl-plot';

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

	let numX;
	let color;
	let line;
	let wglp;

	function initTimeCanvas() {
		// console.log(timeID + '-time');
		if (!document.getElementById(timeID)) {
			return;
		}
		// ctxTime = document.getElementById(timeID).getContext('2d');
		// TimeDomainChart = new Chart(ctxTime, {
		// 	type: 'line',
		// 	data: {
		// 		labels: TimeDomainXValues,
		// 		datasets: [
		// 			{
		// 				pointRadius: 0,
		// 				data: TimeDomainYValues
		// 			}
		// 		]
		// 	},
		// 	options: {
		// 		animation: false,
		// 		plugins: {
		// 			legend: {
		// 				display: false
		// 			}
		// 		}
		// 	}
		// });
		// TimeDomainChart.update();
		TimeDomainChart = document.getElementById(timeID);
		const devicePixelRatio = window.devicePixelRatio || 2;
		TimeDomainChart.width = TimeDomainChart.clientWidth * devicePixelRatio;
		TimeDomainChart.height = TimeDomainChart.clientHeight * devicePixelRatio;

		numX = 512;
		color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
		line = new WebglLine(color, numX);
		wglp = new WebglPlot(TimeDomainChart);

		line.arrangeX();
		wglp.addLine(line);
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
				animation: false,
				plugins: {
					legend: {
						display: false
					}
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
			// let timeDatasets = [];
			const numChannels = TimeDomainYValues.length;

			for (let i = 0; i < timeChunkSize; i++) {
				// const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
				// const yNoise = Math.random() - 0.5;
				line.setY(i, TimeDomainYValues[0][i] / 32768);
			}

			wglp.update();

			// for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
			// 	timeDatasets.push({
			// 		pointRadius: 0,
			// 		data: TimeDomainYValues[channelIndex]
			// 	});
			// }

			// TimeDomainChart.data.datasets = timeDatasets;
			// TimeDomainChart.data.labels = TimeDomainXValues;
			// TimeDomainChart.update();
			let freqDatasets = [];
			for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
				freqDatasets.push({
					pointRadius: 0,
					data: FreqDomainYValues[channelIndex]
				});
			}

			FreqDomainChart.data.datasets = freqDatasets;
			FreqDomainChart.data.labels = FreqDomainXValues;
			FreqDomainChart.update();
		}
	}
</script>

<div class-="sensorGroup">
	<Badge color="gray" radius="md" size="xl">Sensor ID: {sourceIdentifier}</Badge>
	<div class="graphSuperGroup">
		<div class="graphGroup">
			<div class="parameterContainer">
				<Badge color="gray">Sample Rate: {timeSampleRate}</Badge>
				<Badge color="gray">Chunk Size: {timeChunkSize}</Badge>
			</div>
			<div>
				<!-- <canvas style="width: 100%;" id="my_canvas" /> -->
				<canvas class="canvas" id={timeID} bind:this={TimeDomainChart} />
			</div>
		</div>
		<div class="graphGroup">
			<div class="parameterContainer">
				<Badge color="gray">Sample Rate: {freqSampleRate}</Badge>
				<Badge color="gray">Chunk Size: {freqChunkSize}</Badge>
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
