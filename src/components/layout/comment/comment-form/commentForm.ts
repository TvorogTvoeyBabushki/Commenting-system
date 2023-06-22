import { Button } from '@/components/ui/button/button'
import { Field } from '@/components/ui/field/field'

import styles from './commentForm.module.scss'

class CommentForm {
	formElement: HTMLFormElement
	comment: string[]
	field: Field
	button: Button

	constructor() {
		this.formElement = document.createElement('form')

		this.comment = []
		if (localStorage.getItem('comment')) {
			this.comment = [
				...JSON.parse(<string>localStorage.getItem('comment'))
			]
		}

		const fieldProps = {
			type: 'text',
			placeholder: 'Введите текст сообщения...',
			name: 'comment'
		}
		this.field = new Field(fieldProps)
		this.button = new Button('Отправить')

		this.addStyle()
		this.addElementToForm()
		this.handleForm()
	}

	private addStyle() {
		this.formElement.classList.add(styles.form)
	}

	private addElementToForm() {
		this.formElement.append(this.field.inputElement, this.button.buttonElement)
	}

	private onSubmit = (event: Event) => {
		event.preventDefault()

		const eventTarget = event.target as HTMLFormElement
		const inputToForm = eventTarget.querySelector('input')

		if (inputToForm?.value.trim()) {
			this.comment.push(inputToForm.value.trim())
			localStorage.setItem('comment', JSON.stringify(this.comment))

			inputToForm.value = ''
		}
	}

	private handleForm() {
		this.formElement.addEventListener('submit', this.onSubmit)
	}
}

export default CommentForm
