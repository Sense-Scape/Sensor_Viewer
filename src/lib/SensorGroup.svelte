<script lang="ts" defer>
	import { Badge } from '@svelteuidev/core';
	import LineChart from '$lib/LineChart.svelte';

	// Define the props expected by SensorGroup
	export let timeSampleRate = -1;
	export let timeChunkSize = -1;
	export let freqSampleRate = -1;
	export let freqChunkSize = -1;
	export let sourceIdentifier = '-';

	export let aanTimeYValues: number[][] = [];
	export let aanFreqYValues: number[][] = [];
</script>

<div class-="sensorGroup">
	<Badge color="gray" radius="md" size="xl">Sensor ID: {sourceIdentifier}</Badge>
	<div class="graphSuperGroup">
		<div class="graphGroup">
			<div class="parameterContainer">
				<Badge color="gray">Sample Rate: {timeSampleRate}</Badge>
				<Badge color="gray">Chunk Size: {timeChunkSize}</Badge>
			</div>
			<div class="canvas">
				<LineChart
					strChartID={sourceIdentifier + '-time'}
					aanYValues={aanTimeYValues}
					YScale={0.000025}
				/>
			</div>
		</div>
		<div class="graphGroup">
			<div class="parameterContainer">
				<Badge color="gray">Sample Rate: {freqSampleRate}</Badge>
				<Badge color="gray">Chunk Size: {freqChunkSize}</Badge>
			</div>
			<div class="canvas">
				<LineChart
					strChartID={sourceIdentifier + '-freq'}
					aanYValues={aanFreqYValues}
					YScale={0.00025}
				/>
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
		height: 100%;
		width: 50%;
		padding: 10px;
	}
	.canvas {
		height: 5%;
		width: 100%;
	}

	.parameterContainer {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 20%;
	}
</style>
