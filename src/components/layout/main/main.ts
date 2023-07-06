import styles from './main.module.scss'

export class Main {
	mainElement = document.createElement('main')
	divElements: HTMLElement[] = []

	private addStyle() {
		this.mainElement.classList.add(styles.main)
	}

	public draw() {
		for (let i = 0; i < 8; i++) {
			this.divElements.push(document.createElement('div'))
		}

		this.divElements.map(divElement => {
			divElement.classList.add(styles.divElement)

			this.mainElement.append(divElement)
		})

		this.addStyle()

		return this.mainElement
	}
}
