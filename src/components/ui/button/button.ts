import styles from './button.module.scss'

export class Button {
	buttonElement: HTMLButtonElement

	constructor(children: string) {
		this.buttonElement = document.createElement('button')

		this.addStyle()
		this.addText(children)
	}

	private addStyle() {
		this.buttonElement.classList.add(styles.button)
	}

	private addText(children: string) {
		this.buttonElement.innerText = `${children}`
	}
}
