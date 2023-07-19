import '@/assets/styles/global.scss'

import { Main } from './components/layout/main/main'
import Layout from '@/components/layout/layout'

class Home {
	mainElement = document.createElement('main')
	divElements: HTMLElement[] = []
	appRoot = document.getElementById('app')

	main = new Main().draw()
	layout = new Layout().draw(this.main)

	constructor() {
		this.draw()
	}

	public draw() {
		this.appRoot?.append(this.layout)
	}
}

new Home()
