import { Button } from '@/components/ui/button/button'
import { Field } from '@/components/ui/field/field'
import UserItem from '@/components/ui/user-item/userItem'

import { CommentPanel } from '../comment-panel/commentPanel'

import styles from './commentForm.module.scss'

export interface ICommentInfo {
	[k: string]: string | Date | number | boolean
}

class CommentForm {
	formElement = document.createElement('form')

	userItem = new UserItem()
	commentItemsWrapper: HTMLElement
	commentPanel: CommentPanel

	private _commentInfo: ICommentInfo = {}
	private _comments: ICommentInfo[] = []

	field: Field
	button = new Button()

	isDrawSpanNoInternetConnectionElement = true

	constructor(
		commentItemsWrapper: HTMLElement | null = null,
		commentPanel: CommentPanel
	) {
		this.commentItemsWrapper = commentItemsWrapper as HTMLElement
		this.commentPanel = commentPanel

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
		this.field = new Field(fieldProps, this.button.buttonElement)
	}

	private addStyles() {
		this.formElement.classList.add(styles.form)
	}

	public draw() {
		this.formElement.append(
			this.userItem.draw(),
			this.field.draw(),
			this.button.draw('Отправить'),
			this.field.drawFieldValidation() as HTMLDivElement
		)

		this.button.buttonElement.onclick = () => {
			this.handleForm()
		}

		this.addStyles()

		return this.formElement
	}

	public get getCommentsLength() {
		return this._comments.length
	}

	private set getCommentsLength(commentsLength) {
		this._comments.length = commentsLength
	}

	private onSubmit = (event: Event) => {
		event.preventDefault()

		const eventTarget = event.target as HTMLFormElement
		const textareaToForm = eventTarget.querySelector('textarea')

		if (textareaToForm?.value.trim()) {
			this.userItem.getUserInfo.forEach(userInfo => {
				this._commentInfo = {
					id: userInfo.id.value,
					author: `${userInfo.name.first} ${userInfo.name.last}`,
					image: userInfo.picture.large,
					date: new Date(),
					comment: textareaToForm.value.trim(),
					voteCount: Math.round(Math.random() * 200 - 100)
				}
			})

			if (this._commentInfo.author) {
				this._comments.push(this._commentInfo)
				localStorage.setItem('comment', JSON.stringify(this._comments))

				this.getCommentsLength = this._comments.length

				this.commentPanel.drawAmountComments(this._comments.length)
				this.commentPanel.select.sortComments()
			} else {
				const spanNoInternetConnectionElement = document.createElement('span')

				spanNoInternetConnectionElement.classList.add('no_internet_connection')
				spanNoInternetConnectionElement.innerText = 'No internet connection'

				if (this.isDrawSpanNoInternetConnectionElement) {
					this.commentItemsWrapper.insertAdjacentElement(
						'afterbegin',
						spanNoInternetConnectionElement
					)

					this.isDrawSpanNoInternetConnectionElement = false
				}
			}

			textareaToForm.value = ''
			this.field.resetWordCount()
		}
	}

	private handleForm() {
		this.formElement.addEventListener('submit', this.onSubmit)
	}
}

export default CommentForm
