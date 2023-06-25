import { Button } from '@/components/ui/button/button'
import { Field } from '@/components/ui/field/field'

import styles from './commentForm.module.scss'
import UserItem from '@/components/ui/user-item/userItem'
import moment from 'moment'

export interface ICommentInfo {
	[k: string]: string | Date
}

class CommentForm {
	formElement: HTMLFormElement

	divCommentPanel: HTMLElement
	divCommentPanelAmountComments: HTMLElement

	divFieldValidation: HTMLElement

	userItem: UserItem

	private _commentInfo: ICommentInfo
	private _comments: ICommentInfo[]
	field: Field
	button: Button

	constructor() {
		this.formElement = document.createElement('form')

		this.divCommentPanel = document.createElement('div')
		this.divCommentPanelAmountComments = document.createElement('div')
		this.divFieldValidation = document.createElement('div')

		this.userItem = new UserItem()			

		this._commentInfo = {}
		
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

	private drawFieldValidation() {
		const paragraphContent = ['Макс. 1000 символов', 'Слишком длинное сообщение']
		
		for (const item of paragraphContent) {
			const paragraph = document.createElement('p')
			paragraph.innerText = item
			this.divFieldValidation.append(paragraph)
		}

	}

	public drawCommentPanel() {
		this.divCommentPanelAmountComments.innerHTML = `Комментарии <span>(${this._comments.length})</span>`
		this.divCommentPanel.append(this.divCommentPanelAmountComments)

		return this.divCommentPanel
	}

	private addElementToForm() {
		this.drawFieldValidation()

		this.formElement.append(this.userItem.wrapperUser ,this.field.inputElement, this.button.buttonElement,this.divFieldValidation)
	}

	private onSubmit = (event: Event) => {
		event.preventDefault()

		const eventTarget = event.target as HTMLFormElement
		const inputToForm = eventTarget.querySelector('input')

		if (inputToForm?.value.trim()) {
			this.userItem.getUserInfo.forEach(item => {
				this._commentInfo = {
					author: `${item.name.first} ${item.name.last}`,
					image: item.picture.large,
					date: moment(new Date()).format('DD.MM HH:mm'),
					comment: inputToForm.value.trim()
				}
			})

			this._comments.push(this._commentInfo)
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
