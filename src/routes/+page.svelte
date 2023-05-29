<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->
<div class="container">
	<div class="time block">
		<div class="card">
			<p>time</p>
		</div>
	</div>
	<div class="freq block">
		<div class="card">
			<p>freq</p>
		</div>
	</div>
	<div class="rate block">
		<div class="card">
			<p>rate</p>
		</div>
	</div>
	<div class="samples block">
		<div class="card">
			<p>samples</p>
		</div>
	</div>
	<div class="resolution block">
		<div class="card">
			<p>resolution</p>
		</div>
	</div>
</div>

<style>
	p {
		height: 100%;
		margin: 0;
	}

	.card {
		border-radius: 0.2rem;
		text-shadow: 4rem;
		background-color: #d9d9d9;
		height: 100%;
		width: 100%;
	}

	.block {
		padding: 0.8rem;
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
	}

	.freq {
		grid-area: freq;
	}

	.rate {
		grid-area: rate;
	}

	.samples {
		grid-area: samples;
	}

	.resolution {
		grid-area: resolution;
	}
</style>
