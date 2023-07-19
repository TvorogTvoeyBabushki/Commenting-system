import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigPaths()],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	},
	server: {
		port: 3000,
		open: true,
		cors: true
	},
	base: './'
})
