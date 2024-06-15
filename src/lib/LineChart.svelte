<script lang="ts" defer>
	import { onMount } from 'svelte';
	import { WebglPlot, WebglLine, ColorRGBA } from 'webgl-plot';

	let bInitialised = false;

	export let aanYValues: number[][] = [];
	export let strChartID: string;
	export let YScale: number = 1;

	let Chart = undefined;
	let ChartColor = undefined;
	let ChartLines = undefined;
	let WebGLPlot = undefined;
	let LineColor = undefined;

	function InitCanvas() {
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
			ChartLines = [];
			Chart = document.getElementById(strChartID);
			WebGLPlot = new WebglPlot(Chart);
			WebGLPlot.gScaleY = YScale;
		}

		// Iterate and add all channels to add lines
		for (let i = 0; i < aanYValues.length; i++) {
			// Generate the new line of data to add to the plot
			LineColor = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
			let line = new WebglLine(LineColor, aanYValues[i].length);
			line.arrangeX();
			// Add it to the plot
			WebGLPlot.addLine(line);
			ChartLines.push(line);
		}

		bInitialised = true;
	}

	$: {
		if (!bInitialised) {
			InitCanvas();
		}

		if (WebGLPlot && ChartLines) {
			for (let i = 0; i < aanYValues.length; i++) {
				for (let j = 0; j < aanYValues[i].length; j++) {
					ChartLines[i].setY(j, aanYValues[i][j]);
				}
			}
			WebGLPlot.update();
		}
	}
</script>

<canvas class="canvas" id={strChartID} bind:this={Chart} />
