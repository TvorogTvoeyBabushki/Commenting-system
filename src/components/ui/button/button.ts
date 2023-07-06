import styles from './button.module.scss'

export class Button {
	buttonElement = document.createElement('button')

	private addStyle() {
		this.buttonElement.classList.add(styles.button)
	}

	private addText(children: string) {
		this.buttonElement.innerText = `${children}`
	}

	public draw(children: string) {
		this.addStyle()
		this.addText(children)

		return this.buttonElement
	}
}
