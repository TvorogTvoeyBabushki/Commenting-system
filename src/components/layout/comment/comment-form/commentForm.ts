import moment from 'moment'

import { Button } from '@/components/ui/button/button'
import { Field } from '@/components/ui/field/field'
import { Select } from '@/components/ui/select/select'
import UserItem from '@/components/ui/user-item/userItem'

import { CommentItems } from '../comment-item/commentItems'

import styles from './commentForm.module.scss'

export interface ICommentInfo {
	[k: string]: string | Date | number
}

class CommentForm {
	formElement: HTMLFormElement
	commentPanel: HTMLElement
	commentPanelAmountComments: HTMLElement

	userItem: UserItem
	commentItemsWrapper

	private _commentInfo: ICommentInfo
	private _comments: ICommentInfo[]
	field: Field
	button: Button
	select: Select

	constructor(commentItems: HTMLElement) {
		this.formElement = document.createElement('form')
		this.commentPanel = document.createElement('div')
		this.commentPanelAmountComments = document.createElement('div')

		this.userItem = new UserItem()
		this.commentItemsWrapper = commentItems

		this._commentInfo = {}
		this._comments = []

		if (localStorage.getItem('comment')) {
			this._comments = [
				...JSON.parse(localStorage.getItem('comment') as string)
			]
		}

		const fieldProps = {
			rows: '1',
			placeholder: 'Введите текст сообщения...',
			name: 'comment'
		}
		const selectOptionValues = [
			'По дате',
			'По количеству оценок',
			'По актуальности',
			'По количеству ответов'
		]

		this.button = new Button('Отправить')
		this.field = new Field(fieldProps, this.button.buttonElement)
		this.select = new Select('sortComment', selectOptionValues)

		this.addStyles()
		this.addElementToForm()
		this.handleForm()
	}

	private addStyles() {
		this.commentPanel.classList.add(styles.comment_panel)
		this.formElement.classList.add(styles.form)
	}

	public drawCommentPanel() {
		this.commentPanelAmountComments.innerHTML = `Комментарии <span>(${this._comments.length})</span>`

		const commentPanelSortComments = document.createElement('div')
		const propsIconElement = [
			[
				['src', '/public/arrow.png'],
				['alt', 'icon']
			],
			[
				['src', '/public/favorites.png'],
				['alt', 'icon']
			]
		]

		propsIconElement.forEach(item => {
			const iconElement = document.createElement('img')

			for (const [attr, val] of item) {
				iconElement.setAttribute(attr, val)
			}
		})

		commentPanelSortComments.append(this.select.selectElement)
		this.commentPanel.append(this.commentPanelAmountComments)

		return this.commentPanel
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
			// location.reload()
			this.commentItemsWrapper.insertAdjacentElement(
				'afterbegin',
				new CommentItems().update() as HTMLElement
			)

			textareaToForm.value = ''
		}
	}

	private handleForm() {
		this.formElement.addEventListener('submit', this.onSubmit)
	}
}

export default CommentForm
