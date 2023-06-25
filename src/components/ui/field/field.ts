import styles from './field.module.scss'

interface IFieldProps {
	[s: string]: string
}

export class Field {
	inputElement: HTMLInputElement = document.createElement('input')
	props: [string, string][]
	wordCount: number | undefined

	constructor(props: IFieldProps) {
		this.props = Object.entries(props)
		this.wordCount = 0

		this.addStyle()
		this.addAttribute()
		this.handleInput()
	}

	private addStyle() {
		this.inputElement.classList.add(styles.field)
	}

	private addAttribute() {
		for (let [key, value] of this.props) {
			this.inputElement.setAttribute(key, value)
		}
	}

	private changeValue = (event: Event) => {
		const eventTarget = event.target as HTMLInputElement | null
		this.wordCount = eventTarget?.value.length
		return this
	}

	private handleInput() {
		this.inputElement.addEventListener('input', this.changeValue)
	}
}
const fieldProps = {
	type: 'text',
	placeholder: 'Введите текст сообщения...',
	name: 'comment'
}
console.log(new Field(fieldProps).wordCount)
