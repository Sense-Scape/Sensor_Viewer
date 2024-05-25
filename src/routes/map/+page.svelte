<script lang="ts">
	import type { LatLngExpression } from 'leaflet';
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';
	import { onMount } from 'svelte';

	const initialView: LatLngExpression = [-33.918861, 18.4233];
	$: currentMarkerLocations = [];

	var mapData = [];

	/**
	 * Function to find the index of a given sourceIdentifier in the mapData array.
	 * @param {Object} sourceIdentifier - The source identifier to search for in mapData.
	 * @returns {number} - The index of the sourceIdentifier in mapData, or -1 if not found.
	 */
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

	/**
	 * Function to update the mapData array with new chunkData for a given sourceIdentifier.
	 * If the dataIndex is -1, a new entry is added. Otherwise, the existing entry at dataIndex is updated.
	 * @param {number} dataIndex - The index where the sourceIdentifier is found, or -1 if not found.
	 * @param {Object} sourceIdentifier - The source identifier to be updated or added.
	 * @param {Object} chunkData - The data to be associated with the sourceIdentifier.
	 */
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

	/**
	 * Function to update the current marker locations on a Leaflet map based on mapData.
	 * The function processes mapData to create a new array of marker locations.
	 */
	function UpdateLeafletMarkers() {
		// Initialize an empty array to hold the new marker locations
		var newMarkerLocations: Array<LatLngExpression> = [];

		// Loop through each element in the mapData array
		for (let i = 0; i < mapData.length; i++) {
			// Extract longitude and latitude from the mapData and convert them to numbers
			var longitude = Number(mapData[i].value.Longitude);
			var latitude = Number(mapData[i].value.Latitude);

			// If IsNorth is 0, the latitude should be negative (southern hemisphere)
			if (Number(mapData[i].value.IsNorth) === 0) {
				latitude = latitude * -1;
			}

			// If IsWest is not 0, the longitude should be negative (western hemisphere)
			if (Number(mapData[i].value.IsWest) !== 0) {
				longitude = longitude * -1;
			}

			// Create a new marker as a tuple [latitude, longitude]
			var newMarker: [number, number] = [latitude, longitude];
			// Add the new marker to the newMarkerLocations array
			newMarkerLocations = [...newMarkerLocations, newMarker];
		}

		// Update the global/current marker locations with the new array of marker locations
		currentMarkerLocations = newMarkerLocations;
	}

	/**
	 * Function to update an item in the mapData array and refresh the Leaflet markers.
	 * @param {Object} sourceIdentifier - The source identifier to be updated or added.
	 * @param {Object} chunkData - The data to be associated with the sourceIdentifier.
	 */
	function updateItemInMap(sourceIdentifier, chunkData) {
		// Start by checking if we have seen this source identifier before
		let dataIndex = GetIdentifierIndex(sourceIdentifier);

		// Update the mapData array with the new or updated data
		UpdateMapData(dataIndex, sourceIdentifier, chunkData);

		// Refresh the Leaflet markers based on the updated mapData
		UpdateLeafletMarkers();
	}

	onMount(() => {
		const connectWebSocket = () => {
			const GPSWebSocket = new WebSocket('ws://localhost:10100/DataTypes/GPSChunk');

			GPSWebSocket.addEventListener('open', () => {
				console.log('WebSocket connected');
			});

			GPSWebSocket.addEventListener('close', (event) => {
				console.log('WebSocket closed', event);
				setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 1 second
			});

			GPSWebSocket.addEventListener('error', (error) => {
				console.log('WebSocket error', error);
				GPSWebSocket.close();
			});

			GPSWebSocket.addEventListener('message', async (event) => {
				var GPSParsedData = JSON.parse(event.data);

				updateItemInMap(GPSParsedData['GPSChunk']['SourceIdentifier'], {
					Longitude: GPSParsedData['GPSChunk']['Longitude'],
					Latitude: GPSParsedData['GPSChunk']['Latitude'],
					IsNorth: GPSParsedData['GPSChunk']['IsNorth'],
					IsWest: GPSParsedData['GPSChunk']['IsWest']
				});
			});
		};

		connectWebSocket(); // Initial connection
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

			<Popup>{latLng}</Popup>
		</Marker>
	{/each}
</Leaflet>
