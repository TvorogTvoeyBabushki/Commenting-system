import { Button } from '@/components/ui/button/button'
import { Field } from '@/components/ui/field/field'
import UserItem from '@/components/ui/user-item/userItem'

import { CommentPanel } from '../comment-panel/commentPanel'

import styles from './commentForm.module.scss'

export interface ICommentInfo {
	[k: string]: string | Date | number | boolean | ICommentInfo[]
}

class CommentForm {
	formElement = document.createElement('form')

	userItem = new UserItem()
	commentPanel: CommentPanel
	commentItemsWrapper: HTMLElement

	private _commentInfo: ICommentInfo = {}
	private _comments: ICommentInfo[] = []
	private _repliesToComment: ICommentInfo[] = []

	field: Field
	button = new Button()

	isDrawSpanNoInternetConnectionElement = true

	constructor(
		commentPanel: CommentPanel | null,
		commentItemsWrapper: HTMLElement | null
	) {
		this.commentPanel = commentPanel!
		this.commentItemsWrapper = commentItemsWrapper!

		this.parseCommentsOfLocalStorage()

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

	private parseCommentsOfLocalStorage() {
		if (localStorage.getItem('comments')) {
			this._comments = [
				...JSON.parse(localStorage.getItem('comments') as string)
			]
		}
	}

	public onSubmit = (
		event: Event,
		type: string,
		updatedСommentInfo: ICommentInfo | null
	) => {
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
					voteCount: Math.round(Math.random() * 200 - 100),
					isDecrement: true,
					isIncrement: true,
					replies: []
				}
			})

			if (this._commentInfo.author && type === 'publication') {
				this.parseCommentsOfLocalStorage()

				this._comments.push(this._commentInfo)
				localStorage.setItem('comments', JSON.stringify(this._comments))

				this.getCommentsLength = this._comments.length

				this.commentPanel.drawAmountComments(this._comments.length)
				this.commentPanel.select.sortComments()
			} else if (this._commentInfo.author && type === 'reply') {
				this.parseCommentsOfLocalStorage()

				this._comments.forEach(comment => {
					if (comment.date === updatedСommentInfo!.date) {
						this._repliesToComment = [...(comment.replies as ICommentInfo[])]

						delete this._commentInfo.replies
						this._repliesToComment.push(this._commentInfo)

						comment.replies = this._repliesToComment
					}

					if (localStorage.getItem('favorites')) {
						const commentsInfoOfFavorites = [
							...JSON.parse(localStorage.getItem('favorites') as string)
						]

						commentsInfoOfFavorites.forEach(commentInfoOfFavorites => {
							if (commentInfoOfFavorites.date === comment.date) {
								commentInfoOfFavorites.replies = comment.replies
							}
						})

						localStorage.setItem(
							'favorites',
							JSON.stringify(commentsInfoOfFavorites)
						)
					}
				})

				localStorage.setItem('comments', JSON.stringify(this._comments))
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
		this.formElement.addEventListener('submit', e =>
			this.onSubmit(e, 'publication', null)
		)
	}
}

export default CommentForm
