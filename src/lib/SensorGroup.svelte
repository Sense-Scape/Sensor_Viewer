<script lang="ts" defer>
	import { onMount } from 'svelte';
	import { Badge } from '@svelteuidev/core';
	import { WebglPlot, WebglLine, ColorRGBA } from 'webgl-plot';

	// Define the props expected by SensorGroup
	export let timeSampleRate = -1;
	export let timeChunkSize = -1;
	export let freqSampleRate = -1;
	export let freqChunkSize = -1;
	export let sourceIdentifier = '-';

	let TimeDomainChart;
	export let TimeDomainYValues: number[][] = [];
	export let timeID: string;

	let FreqDomainChart;
	export let FreqDomainYValues: number[][] = [];

	$: TimeMounted = false;
	$: FreqMounted = false;

	export let freqID: string;

	let timeNumX;
	let timeColor;
	let timeLines = [];
	let timeWglp;

	let freqNumX;
	let freqColor;
	let freqLines = [];
	let freqWglp;
	onMount(() => {
		initTimeCanvas();
		initFreqCanvas();
	});

	function initTimeCanvas() {
		if (!document.getElementById(timeID)) {
			return;
		}

		if (!TimeDomainYValues.length) {
			return;
		}

		TimeDomainChart = document.getElementById(timeID);
		const devicePixelRatio = window.devicePixelRatio || 2;
		TimeDomainChart.width = TimeDomainChart.clientWidth * devicePixelRatio;
		TimeDomainChart.height = TimeDomainChart.clientHeight * devicePixelRatio;

		timeNumX = timeChunkSize;
		timeWglp = new WebglPlot(TimeDomainChart);

		const numChannels = TimeDomainYValues.length;

		for (let i = 0; i < numChannels; i++) {
			timeColor = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
			let line = new WebglLine(timeColor, timeNumX);
			line.arrangeX();
			timeWglp.addLine(line);
			timeLines.push(line);
		}
		TimeMounted = true;
	}

	function initFreqCanvas() {
		if (!document.getElementById(timeID)) {
			return;
		}

		if (!FreqDomainYValues.length) {
			return;
		}

		FreqDomainChart = document.getElementById(freqID);
		const devicePixelRatio = window.devicePixelRatio || 2;
		FreqDomainChart.width = FreqDomainChart.clientWidth * devicePixelRatio;
		FreqDomainChart.height = FreqDomainChart.clientHeight * devicePixelRatio;

		freqNumX = freqChunkSize;

		freqWglp = new WebglPlot(FreqDomainChart);

		const freqNumChannels = FreqDomainYValues.length;

		for (let i = 0; i < freqNumChannels; i++) {
			freqColor = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
			let line = new WebglLine(freqColor, freqNumX);
			line.arrangeX();
			freqWglp.addLine(line);
			freqLines.push(line);
		}

		console.log(freqLines);
		FreqMounted = true;
	}

	$: {
		if (TimeMounted) {
			let timeNumChannels = TimeDomainYValues.length;
			for (let i = 0; i < timeNumChannels; i++) {
				for (let j = 0; j < timeChunkSize; j++) {
					timeLines[i].setY(j, TimeDomainYValues[i][j] / 32768);
				}
			}
			timeWglp.update();
		} else {
			initTimeCanvas();
		}

		if (FreqMounted) {
			let freqNumChannels = FreqDomainYValues.length;
			for (let i = 0; i < freqNumChannels; i++) {
				for (let j = 0; j < timeChunkSize; j++) {
					freqLines[i].setY(j, FreqDomainYValues[i][j] / 32768 / 512);
				}
			}
			freqWglp.update();
		} else {
			initFreqCanvas();
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
</style>
