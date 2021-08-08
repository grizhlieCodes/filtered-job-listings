/** @type {import('@sveltejs/kit').Config} */

import preprocess from 'svelte-preprocess'

import adapter from '@sveltejs/adapter-netlify'

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter(),
		target: '#svelte'
	},
	preprocess: preprocess()
};

export default config;
