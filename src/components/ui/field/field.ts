import styles from './field.module.scss'

interface IFieldProps {
	[s: string]: string
}

export class Field {
	textareaElement: HTMLTextAreaElement = document.createElement('textarea')
	divFieldValidation: HTMLElement
	buttonElement: HTMLButtonElement

	private _props: [string, string][]
	private _wordCount: number | undefined

	constructor(props: IFieldProps, buttonElement: HTMLButtonElement) {
		this._props = Object.entries(props)
		this.divFieldValidation = document.createElement('div')
		this.buttonElement = buttonElement

		this.addStyle()
		this.addAttribute()
		this.handleTextarea()
	}

	private addStyle() {
		this.textareaElement.classList.add(styles.field)
	}

	private addAttribute() {
		for (let [key, value] of this._props) {
			this.textareaElement.setAttribute(key, value)
		}
	}

	public drawFieldValidation() {
		const paragraphContent = [
			'Макс. 1000 символов',
			'Слишком длинное сообщение'
		]

		this._wordCount && this._wordCount < 1000
			? (this.buttonElement.disabled = false)
			: (this.buttonElement.disabled = true)

		if (this._wordCount || this._wordCount === 0) {
			const firstParagraphElement = this.divFieldValidation.querySelector(
				'p'
			) as HTMLElement
			const lastParagraphElement =
				firstParagraphElement?.nextElementSibling as HTMLElement

			firstParagraphElement!.innerText = `${this._wordCount}/1000`

			this._wordCount > 1000
				? ((lastParagraphElement.style.visibility = 'visible'),
				  (firstParagraphElement.style.color = 'rgba(255, 0, 0, 1)'))
				: ((lastParagraphElement.style.visibility = 'hidden'),
				  (firstParagraphElement.style.color = 'rgba(0, 0, 0, 0.4)'))

			return
		}

		paragraphContent.forEach(item => {
			const paragraphElement = document.createElement('p')

			paragraphElement.innerText = item
			this.divFieldValidation.append(paragraphElement)
		})
	}

	private autoResizeAndChangeWordCount(event: Event) {
		this.textareaElement.style.height = 'auto'
		this.textareaElement.style.height = `${this.textareaElement.scrollHeight}px`

		const textareaElement = event.target as HTMLTextAreaElement

		this._wordCount = textareaElement.value.trim().length
		this.drawFieldValidation()
	}

	private handleTextarea() {
		this.textareaElement.addEventListener(
			'input',
			this.autoResizeAndChangeWordCount.bind(this)
		)
	}
}
