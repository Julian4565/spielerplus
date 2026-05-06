import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Deine Runes-Einstellung bleibt erhalten
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			// WICHTIG: Damit GitHub Pages Unterseiten (Routes) versteht
			fallback: '404.html'
		}),
		paths: {
			// WICHTIG: Wenn du auf GitHub baust, nimm fest '/spielerplus'
			base: '/spielerplus'
		}
	}
};

export default config;