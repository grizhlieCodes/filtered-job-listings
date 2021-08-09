<script>
	import { writable, get } from 'svelte/store';
	import { setContext, getContext, onMount } from 'svelte';
	import Header from '$lib/Header.svelte';
	import JobCards from '$lib/JobCards.svelte';
	import data from '/static/assets/data.json';
	import customOpSystem from '$lib/stores/opSystem.js';
	let dataObject = [...data];

	dataObject.forEach((job) => {
		job.tags = [job.role, job.level];
		job.languages.forEach((lang) => {
			job.tags = [...job.tags, lang];
		});
	});

	let tagsArray = [];
	dataObject.forEach((obj) => {
		obj.tags.forEach((tag) => {
			tagsArray = [...tagsArray, tag];
		});
	});
	let tags = Array.from(new Set(tagsArray));

	import updateSize from '$lib/stores/size.js';
	let innerWidth;
	let size = writable();
	setContext('size', size);
	$: updateSize(size, innerWidth);

	let selectedFilters = [];

	const removeFilter = (e) => {
		selectedFilters = selectedFilters.filter((tag) => tag !== e.detail);
	};

	const addFilterTag = (e) => {
		if (selectedFilters.includes(e.detail)) return;
		selectedFilters = [...selectedFilters, e.detail];
	};

	const filterData = () => {
		let newFilteredData = dataObject.filter((job) => {
			const jobTags = job.tags;
			return selectedFilters.every((filter) => jobTags.includes(filter));
		});
		return newFilteredData;
	};

	$: filteredData = selectedFilters.length === 0 ? dataObject : filterData();

	const preventDefaultArrowKeys = () => {
		window.addEventListener(
			'keydown',
			function (e) {
				// if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1)
				const arrowUpPressed = e.key === 'ArrowUp';
				const arrowDownPressed = e.key === 'ArrowDown';
				const arrowLeftPressed = e.key === 'ArrowLeft';
				const arrowRightPressed = e.key === 'ArrowRight';
				const arrowKeyPressed =
					arrowUpPressed || arrowDownPressed || arrowLeftPressed || arrowRightPressed;
				if (arrowKeyPressed) {
					e.preventDefault();
				}
			},
			false
		);
	};

	const findOperatingSystem = () => {
		const appVer = window.navigator.appVersion;

		if (appVer.includes('Windows')) {
			setContext('operating-system', 'windows');
		}
		if (appVer.includes('Macintosh')) {
			setContext('operating-system', 'macintosh');
		}

		console.log(getContext('operating-system'));
	};

	let mounted = false;

	onMount(() => {
		mounted = true;
		if (mounted) {
			preventDefaultArrowKeys();
			customOpSystem.getOpSystem();
		}
	});
</script>

<style lang="scss">
	@import '../styles/mixins';
	.svelte-inner-container {
		width: 100%;
		height: auto;
		@include flex(column nowrap, start, center);
		gap: 3.2rem;
	}
</style>

<svelte:window bind:innerWidth />
<div class="svelte-inner-container">
	<Header
		{selectedFilters}
		on:removeFilter={removeFilter}
		on:addFilterTag={addFilterTag}
		{tags}
		on:addTag={addFilterTag}
		on:removeFilters={() => (selectedFilters = [])} />

	<JobCards dataObject={filteredData} on:addFilterTag={addFilterTag} />

</div>
