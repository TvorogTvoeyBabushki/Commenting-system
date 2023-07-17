import styles from './field.module.scss'

interface IFieldProps {
	[s: string]: string
}

export class Field {
	textareaElement = document.createElement('textarea')
	divFieldValidation = document.createElement('div')
	buttonElement: HTMLButtonElement

	private _props: [string, string][]
	private _wordCount: number | undefined

	constructor(props: IFieldProps, buttonElement: HTMLButtonElement) {
		this._props = Object.entries(props)
		this.buttonElement = buttonElement

		this.handleTextarea()
	}

	public draw() {
		const textareaAndFieldValidationWrapper = document.createElement('div')

		textareaAndFieldValidationWrapper.append(
			this.textareaElement,
			this.drawFieldValidation()!
		)
		textareaAndFieldValidationWrapper.classList.add(
			styles.textarea_field_validation_wrapper
		)

		this.addStyle()
		this.addAttribute()

		return textareaAndFieldValidationWrapper
	}

	public resetWordCount() {
		this._wordCount = 0

		this.drawFieldValidation()
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

			firstParagraphElement.innerText = `${this._wordCount}/1000`

			this._wordCount > 1000
				? ((lastParagraphElement.style.visibility = 'visible'),
				  (firstParagraphElement.style.color = 'rgba(255, 0, 0, 1)'))
				: ((lastParagraphElement.style.visibility = 'hidden'),
				  (firstParagraphElement.style.color = 'rgba(0, 0, 0, 0.4)'))

			return
		}

		paragraphContent.forEach(paragraphText => {
			const paragraphElement = document.createElement('p')

			paragraphElement.innerText = paragraphText
			this.divFieldValidation.append(paragraphElement)
		})

		return this.divFieldValidation
	}

	private autoResizeAndChangeWordCount() {
		const numberLineBreaks = this.textareaElement.value.match(/\n/g)

		if (numberLineBreaks) {
			this.textareaElement.rows = numberLineBreaks.length + 1
			this.textareaElement.style.height = 'auto'
		} else {
			this.textareaElement.rows = 1
			this.textareaElement.style.height = '70px'
		}

		this._wordCount = this.textareaElement.value.trim().length
		this.drawFieldValidation()
	}

	private handleTextarea() {
		this.textareaElement.addEventListener(
			'input',
			this.autoResizeAndChangeWordCount.bind(this)
		)
	}
}
