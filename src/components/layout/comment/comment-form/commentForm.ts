import { Button } from '@/components/ui/button/button'
import { Favorite } from '@/components/ui/favorite/favorite'
import { Field } from '@/components/ui/field/field'
import { Select } from '@/components/ui/select/select'
import UserItem from '@/components/ui/user-item/userItem'

import styles from './commentForm.module.scss'

export interface ICommentInfo {
	[k: string]: string | Date | number | boolean
}

class CommentForm {
	formElement = document.createElement('form')
	commentPanel = document.createElement('div')
	commentPanelAmountComments = document.createElement('button')

	userItem: UserItem = new UserItem()
	commentItemsWrapper: HTMLElement

	private _commentInfo: ICommentInfo = {}
	private _comments: ICommentInfo[] = []

	field: Field
	button: Button
	select: Select
	favorite: Favorite

	isDrawSpanNoInternetConnectionElement = true

	constructor(commentItemsWrapper: HTMLElement) {
		this.commentItemsWrapper = commentItemsWrapper

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
		this.select = new Select(
			'sortComment',
			selectOptionValues,
			this.commentItemsWrapper
		)
		this.favorite = new Favorite()

		this.addStyles()
		this.addElementToForm()
		this.handleForm()
	}

	private addStyles() {
		this.commentPanel.classList.add(styles.comment_panel)
		this.formElement.classList.add(styles.form)
		this.commentPanelAmountComments.classList.add(styles.active)
	}

	private drawAmountComments() {
		this.commentPanelAmountComments.innerHTML = `Комментарии <span>(${this._comments.length})</span>`
		this.commentPanelAmountComments.onclick = () => {
			if (this.favorite._isShowAllComments) {
				this.commentItemsWrapper.innerHTML = ''
				this.select.sortComments()

				const nodeListButtons = [
					...this.commentPanel.querySelectorAll('button')
				]
				nodeListButtons
					.at(-1)
					?.classList.remove(this.favorite.getStyle().active)

				this.commentPanelAmountComments.classList.add(styles.active)
				this.favorite._isShowAllComments = false
			}
		}
	}

	public drawCommentPanel() {
		this.drawAmountComments()

		this.commentPanel.append(
			this.commentPanelAmountComments,
			this.select.selectWrapper,
			this.favorite.draw(
				'Избранное',
				this.commentItemsWrapper,
				this.commentPanelAmountComments,
				styles
			)
		)

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

				this.select.sortComments()

				this.drawAmountComments()
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
