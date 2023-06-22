import styles from './field.module.scss'

interface IFieldProps {
	[s: string]: string
}

export class Field {
	inputElement: HTMLInputElement = document.createElement('input')
	props: [string, string][]

	constructor(props: IFieldProps) {
		this.props = Object.entries(props)

		this.addStyle()
		this.addAttribute()
		// this.handleInput()
	}

	private addStyle() {
		this.inputElement.classList.add(styles.field)
	}

	private addAttribute() {
		for (let [key, value] of this.props) {
			this.inputElement.setAttribute(key, value)
		}
	}

	// private changeValue(event: Event) {
	// 	const eventTarget = event.target as HTMLInputElement | null

	// 	if (eventTarget) this._valueInput = eventTarget.value
	// }

	// private handleInput() {
	// 	this.inputElement.addEventListener('change', this.changeValue)
	// }
}
