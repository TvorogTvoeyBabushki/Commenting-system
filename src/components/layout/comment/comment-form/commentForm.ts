import { Button } from '@/components/ui/button/button'
import { Field } from '@/components/ui/field/field'

import styles from './commentForm.module.scss'
import UserItem from '@/components/ui/user-item/userItem'

interface ICommentInfo {
	[k: string]: string | Date
}

class CommentForm {
	formElement: HTMLFormElement

	divCommentPanel: HTMLElement
	divCommentPanelAmountComments: HTMLElement

	userItem: UserItem

	private _infoComment: ICommentInfo
	private _comments: string[]
	field: Field
	button: Button

	constructor() {
		this.formElement = document.createElement('form')

		this.divCommentPanel = document.createElement('div')
		this.divCommentPanelAmountComments = document.createElement('div')

		this.userItem = new UserItem()

		this._infoComment = {
			...this.userItem.userInfo,
			date: new Date()
		}
		console.log(this._infoComment);
		

		this._comments = []
		if (localStorage.getItem('comment')) {
			this._comments = [
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

		this.addStyles()
		this.addElementToForm()
		this.handleForm()
	}

	private addStyles() {
		this.divCommentPanel.classList.add(styles.comment_panel)
		this.formElement.classList.add(styles.form)
	}

	public drawCommentPanel() {
		this.divCommentPanelAmountComments.innerHTML = `Комментарии <span>(${this._comments.length})</span>`
		this.divCommentPanel.append(this.divCommentPanelAmountComments)

		return this.divCommentPanel
	}

	private addElementToForm() {
		this.formElement.append(this.userItem.wrapperUser ,this.field.inputElement, this.button.buttonElement)
	}

	private onSubmit = (event: Event) => {
		event.preventDefault()

		const eventTarget = event.target as HTMLFormElement
		const inputToForm = eventTarget.querySelector('input')

		if (inputToForm?.value.trim()) {
			this._comments.push(inputToForm.value.trim())
			localStorage.setItem('comment', JSON.stringify(this._comments))

			this.drawCommentPanel()

			inputToForm.value = ''
		}
	}

	private handleForm() {
		this.formElement.addEventListener('submit', this.onSubmit)
	}
}

export default CommentForm
