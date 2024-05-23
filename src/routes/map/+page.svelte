<script lang="ts">
	import type { LatLngExpression } from 'leaflet';
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';
	import { onMount } from 'svelte';

	const initialView: LatLngExpression = [-33.918861, 18.4233];
	$: currentMarkerLocations = [];

	var mapData = [];

	function GetIdentifierIndex(sourceIdentifier) {
		let index = -1;
		for (let i = 0; i < mapData.length; i++) {
			if (JSON.stringify(mapData[i].sourceIdentifier) === JSON.stringify(sourceIdentifier)) {
				index = i;
				break;
			}
		}

		return index;
	}

	function UpdateMapData(dataIndex, sourceIdentifier, chunkData) {
		if (dataIndex == -1) {
			if (mapData.length == 0) {
				dataIndex = 0;
				mapData[dataIndex] = {
					sourceIdentifier: sourceIdentifier,
					value: chunkData
				};
			} else {
				dataIndex = mapData.length;
				mapData[dataIndex] = {
					sourceIdentifier: sourceIdentifier,
					value: chunkData
				};
			}
		} else {
			mapData[dataIndex].value = chunkData;
		}
	}

	function UpdateLeafletMarkers() {
		var newMarkerLocations: Array<LatLngExpression> = [];
		for (let i = 0; i < mapData.length; i++) {
			var longitude = Number(mapData[i].value.Longitude);
			var latitude = Number(mapData[i].value.Latitude);

			if (Number(mapData[i].value.IsNorth) === 0) {
				latitude = latitude * -1;
			}

			if (Number(mapData[i].value.IsWest) !== 0) {
				longitude = longitude * -1;
			}

			var newMarker: [number, number] = [latitude / 100, longitude / 100];
			newMarkerLocations = [...newMarkerLocations, newMarker];
		}

		currentMarkerLocations = newMarkerLocations;
	}
	function updateItemInMap(sourceIdentifier, chunkData) {
		// Start by checking if we have seen this source identifier before

		let dataIndex = GetIdentifierIndex(sourceIdentifier);
		UpdateMapData(dataIndex, sourceIdentifier, chunkData);
		UpdateLeafletMarkers();
	}

	onMount(() => {
		const GPSWebSocket = new WebSocket('ws://localhost:10100/DataTypes/GPSChunk');

		GPSWebSocket.addEventListener('message', async (event) => {
			var GPSParsedData = JSON.parse(event.data);

			updateItemInMap(GPSParsedData['GPSChunk']['SourceIdentifier'], {
				Longitude: GPSParsedData['GPSChunk']['Longitude'],
				Latitude: GPSParsedData['GPSChunk']['Latitude'],
				IsNorth: GPSParsedData['GPSChunk']['IsNorth'],
				IsWest: GPSParsedData['GPSChunk']['IsWest']
			});
		});
	});
</script>

<Leaflet view={initialView} zoom={14}>
	{#each currentMarkerLocations as latLng}
		<Marker {latLng} width={25} height={25}>
			<!-- ShipBit Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xml:space="preserve"
				style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"
				viewBox="0 0 45 40"
			>
				<path
					d="m23.046 25.449 9.601 16.885H13.253l9.793-16.885ZM45 23.965H25.702l9.575 16.84L45 23.965ZM44.963 20.923 35.339 4.254l-9.668 16.669h19.292ZM32.771 2.618h-4.17L8.522 37.237l2.08 3.603L32.771 2.618ZM25.084 2.618H11.465L0 22.476l6.768 11.722 18.316-31.58Z"
					style="fill:#e9204f;fill-rule:nonzero"
					transform="translate(0 -2.618)"
				/>
			</svg>

			<Popup
				>Like & Subscribe! This is a very loooooooooooong title and it has many characters.</Popup
			>
		</Marker>
	{/each}
</Leaflet>
