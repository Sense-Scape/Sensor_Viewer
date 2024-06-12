<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Accordion } from '@svelteuidev/core';

	var mapData = [];
	$: Text = '';

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

	function updateDisplaytext() {
		let tmp = '';

		for (let i = 0; i < mapData.length; i++) {
			tmp = tmp + '\n' + JSON.stringify(mapData[i].value.SystemInfo);
		}

		Text = tmp;
	}

	function updateItemInMap(StatusParsedData) {
		// Start by checking if we have seen this source identifier before
		let dataIndex = GetIdentifierIndex(StatusParsedData['SystemInfo']['StatName']);
		UpdateMapData(dataIndex, StatusParsedData['SystemInfo']['StatName'], StatusParsedData);
		console.log(mapData)
	}

	let StatWebSocket = null;
	function connectWebSocket() {
		StatWebSocket = new WebSocket('ws://localhost:10101/DataTypes/SystemInfo');

		StatWebSocket.addEventListener('open', () => {
			console.log('Stat WebSocket connected');
		});

		StatWebSocket.addEventListener('close', (event) => {
			console.log('Stat WebSocket closed', event);
			//setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 1 second
		});

		StatWebSocket.addEventListener('error', (error) => {
			console.log('Stat WebSocket error', error);
			StatWebSocket.close();
		});

		StatWebSocket.addEventListener('message', async (event) => {
			var StatusParsedData = JSON.parse(event.data);
			updateItemInMap(StatusParsedData);
			updateDisplaytext();
		});
	}

	function closeWebSockets() {
		if (StatWebSocket) {
			StatWebSocket.close();
		}
	}

	onDestroy(() => {
		closeWebSockets();
		mapData = null;
	});

	onMount(() => {
		connectWebSocket(); // Initial connection
	});
</script>

<div>
	{Text}
</div>
