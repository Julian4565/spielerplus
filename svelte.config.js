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
			// Wir nutzen BASE_PATH aus dem GitHub Workflow, falls vorhanden.
			// Falls nicht (lokal), lassen wir es leer für eine normale Dev-Experience.
			base: process.env.NODE_ENV === 'production' ? (process.env.BASE_PATH || '/spielerplus') : ''
		},
		prerender: {
			// WICHTIG: Verhindert den Abbruch des Builds bei "404 / does not begin with base"
			handleHttpError: 'warn',
			// Ignores dynamic routes that aren't crawled during build (for SPA mode)
			handleUnseenRoutes: 'ignore'
		}
	}
};

export default config;