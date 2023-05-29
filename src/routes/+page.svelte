<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->
<div class="container">
	<div class="time"><p>time</p></div>
	<div class="freq"><p>freq</p></div>
	<div class="rate"><p>rate</p></div>
	<div class="samples"><p>samples</p></div>
	<div class="resolution"><p>resolution</p></div>
</div>

<style>

	p {
		height: 100%;
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
		height: 100vh;
	}

	.time {
		grid-area: time;
		background-color: chocolate;
	}

	.freq {
		grid-area: freq;
		background-color: aquamarine;
	}

	.rate {
		grid-area: rate;
		background-color: burlywood;
	}

	.samples {
		grid-area: samples;
		background-color: gray;
	}

	.resolution {
		grid-area: resolution;
		background-color: cadetblue;
	}
</style>
