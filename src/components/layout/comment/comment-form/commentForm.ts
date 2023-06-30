import { Button } from '@/components/ui/button/button'
import { Field } from '@/components/ui/field/field'

import styles from './commentForm.module.scss'
import UserItem from '@/components/ui/user-item/userItem'
import moment from 'moment'

export interface ICommentInfo {
	[k: string]: string | Date | number
}

class CommentForm {
	formElement: HTMLFormElement

	divCommentPanel: HTMLElement
	divCommentPanelAmountComments: HTMLElement

	userItem: UserItem

	private _commentInfo: ICommentInfo
	private _comments: ICommentInfo[]
	field: Field
	button: Button

	constructor() {
		this.formElement = document.createElement('form')

		this.divCommentPanel = document.createElement('div')
		this.divCommentPanelAmountComments = document.createElement('div')

		this.userItem = new UserItem()

		this._commentInfo = {}
		
		this._comments = []
		if (localStorage.getItem('comment')) {
			this._comments = [
				...JSON.parse(<string>localStorage.getItem('comment'))
			]
		}

		const fieldProps = {
			rows: '1',
			placeholder: 'Введите текст сообщения...',
			name: 'comment'
		}
		this.button = new Button('Отправить')
		this.field = new Field(fieldProps, this.button.buttonElement)
		
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
		this.field.drawFieldValidation()

		this.formElement.append(
			this.userItem.wrapperUser, 
			this.field.textareaElement, 
			this.button.buttonElement,
			this.field.divFieldValidation
			)
	}

	private onSubmit = (event: Event) => {
		event.preventDefault()

		const eventTarget = event.target as HTMLFormElement
		const textareaToForm = eventTarget.querySelector('textarea')

		if (textareaToForm?.value.trim()) {
			this.userItem.getUserInfo.forEach(item => {
				this._commentInfo = {
					author: `${item.name.first} ${item.name.last}`,
					image: item.picture.large,
					date: moment(new Date()).format('DD.MM HH:mm'),
					comment: textareaToForm.value.trim(),
					voteCount: Math.round(Math.random() * 200 - 100)
				}
			})

			this._comments.push(this._commentInfo)
			localStorage.setItem('comment', JSON.stringify(this._comments))

			this.drawCommentPanel()
			location.reload()

			textareaToForm.value = ''
		}
	}

	private handleForm() {
		this.formElement.addEventListener('submit', this.onSubmit)
	}
}

export default CommentForm
