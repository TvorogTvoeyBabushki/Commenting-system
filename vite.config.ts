import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigPaths()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	base: './'
})
