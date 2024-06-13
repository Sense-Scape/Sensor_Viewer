<script lang="ts" defer>
	import { onMount } from 'svelte';
	import { WebglPlot, WebglLine, ColorRGBA } from 'webgl-plot'

	let Chart;
    $: bChartMounted = false;

	export let aanYValues: number[][] = [];
	export let strChartID: string;

	let ChartColor;
	let ChartLines = [];
	let WebGLPlot;
	
	onMount(() => {
		initCanvas();
	});

	function initTimeCanvas() {

		// Ensure HMTL is loaded in
		if (!document.getElementById(strChartID)) {
			return;
		}

		// Ensure we processed some data (therefore var set)
		if (!aanYValues.length) {
			return;
		}

		// Create the "class" wise context only once
		if (!WebGLPlot) {
			WebGLPlot = new WebglPlot(Chart);
			bChartMounted = true;
			// Now lets set up the display area
			Chart = document.getElementById(strTimeID);
			const devicePixelRatio = window.devicePixelRatio || 2;
			Chart.width = Chart.clientWidth * devicePixelRatio;
			Chart.height = Chart.clientHeight * devicePixelRatio;
		}

		// Iterate and add all channels to add lines
		for (let i = 0; i < aanYValues.length; i++) {
			// Generate the new line of data to add to the plot
			timeColor = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
			let line = new WebglLine(timeColor, timeChunkSize);
			line.arrangeX();
			// Add it to the plot
			WebGLPlot.addLine(line);
			ChartLines.push(line);
		}
	}
	
</script>

<canvas class="canvas" id={strChartID} bind:this={Chart} />


<style>
</style>
