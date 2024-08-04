<script>
	import { WebglPlot, WebglPolar , ColorRGBA } from 'webgl-plot';

	let bInitialised = false;

	export let anAngles_deg;
	export let strChartID;

	let Chart = undefined;
	let ChartLines = undefined;
	let WebGLPlot = undefined;
	let LineColor = undefined;

	function InitCanvas() {
		// Ensure HMTL is loaded in
		if (!document.getElementById(strChartID)) {
			return;
		}
		// Ensure we processed some data (therefore var set)
		if (!anAngles_deg.length) {
			return;
		}
		// Create the "class" wise context only once
		if (!WebGLPlot) {
			ChartLines = [];
			Chart = document.getElementById(strChartID);
			WebGLPlot = new WebglPlot(Chart);
		}

		bInitialised = true;
	}

	$: {
		if (!bInitialised) {
			InitCanvas();
		}

        if (WebGLPlot && ChartLines) {
            
            WebGLPlot.removeDataLines()
            
            for (let i = 0; i < anAngles_deg.length; i++) {

                LineColor = new ColorRGBA(0, 0, 0, 1);
                let line = new WebglPolar(LineColor, 10);

                line.setRtheta(0, 0, 0);
                line.setRtheta(1, anAngles_deg[i], 10)
    
                WebGLPlot.addLine(line);
            }
            WebGLPlot.update();
        }
    }

    

  </script>
  
  <canvas class="canvas" id={strChartID} bind:this={Chart} />
