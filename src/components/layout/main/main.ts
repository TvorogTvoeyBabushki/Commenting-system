import CommentSystem from '../comment/commentSystem'

import styles from './main.module.scss'

export class Main {
	mainElement = document.createElement('main')
	divElements: HTMLElement[] = []

	private commentSystem = new CommentSystem()

	private addStyle() {
		this.mainElement.classList.add(styles.main)
	}

	public draw() {
		const sidebar = document.createElement('aside')
		const container = document.createElement('div')
		const wrapperDivElements = document.createElement('section')

		for (let i = 0; i < 9; i++) {
			this.divElements.push(document.createElement('div'))
		}

		this.divElements.map(divElement => {
			wrapperDivElements.append(divElement)
		})

		container.append(wrapperDivElements, this.commentSystem.draw())

		this.mainElement.append(sidebar, container)

		this.addStyle()

		return this.mainElement
	}
}
