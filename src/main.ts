import '@/assets/styles/global.scss'

import styles from './main.module.scss'
import Layout from '@/components/layout/layout'

class Home {
	divElements: HTMLElement[]
	mainElement: HTMLElement
	layout: Layout

	constructor() {
		this.mainElement = document.createElement('main')
		this.divElements = []
		this.appendDivElementInMain()
		this.addStyles()

		this.layout = new Layout(this.mainElement)

		this.draw()
	}

	private addStyles() {
		// this.divElement?.classList.add(styles.divElement)
		this.mainElement.classList.add(styles.main)
	}

	private appendDivElementInMain() {
		for (let i = 0; i < 8; i++) {
			this.divElements.push(document.createElement('div'))
		}

		this.divElements.map(divElement => {
			divElement.classList.add(styles.divElement)
			this.mainElement.append(divElement)
		})
	}

	public draw() {
		this.layout.createAndDraw()
	}
}

new Home()
