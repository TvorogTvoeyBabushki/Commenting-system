import { Button } from '@/components/ui/button/button'
import { Select } from '@/components/ui/select/select'

import CommentForm, { ICommentInfo } from '../../comment-form/commentForm'

export class ToolBarUtils {
	spanVoteCount: HTMLElement = document.createElement('span')

	commentForm: CommentForm
	replyToCommentForm: HTMLFormElement
	select: Select

	private _favorites: ICommentInfo[] = []
	private _commentsItemInfo: ICommentInfo[] = []
	protected _commentInfo: ICommentInfo

	private _voteCount: number

	private _isDecrement = true
	private _isIncrement = true
	protected _isChangeTextFavoriteSpanElement = false
	private _isRemoveFavorites = false

	constructor(commentInfo: ICommentInfo, select: Select) {
		this._commentInfo = commentInfo
		this._voteCount = commentInfo.voteCount as number

		this.commentForm = new CommentForm(null, null)
		this.replyToCommentForm = this.commentForm.draw()
		this.select = select

		this.checkingLocalStorageKey('favorites')
		this.checkingLocalStorageKey('comments')

		this._favorites.forEach(commentInfoOfFavorites => {
			if (commentInfoOfFavorites.date === this._commentInfo.date) {
				this._commentInfo.isRemoveFavorites =
					commentInfoOfFavorites.isRemoveFavorites
			}
		})
	}

	protected checkingLocalStorageKey(type: string) {
		if (localStorage.getItem(type)) {
			const parseLocalStorage = [
				...JSON.parse(localStorage.getItem(type) as string)
			]

			type === 'favorites'
				? (this._favorites = parseLocalStorage)
				: (this._commentsItemInfo = parseLocalStorage)
		}
	}

	protected drawVoteCount() {
		this._voteCount > 0
			? (this.spanVoteCount.style.color = '#8AC540')
			: this._voteCount < 0
			? (this.spanVoteCount.style.color = '#F00')
			: (this.spanVoteCount.style.color = '#000')

		this.spanVoteCount.innerText = `${this._voteCount}`

		return this.spanVoteCount
	}

	private conditionsForChangVoteCount(commentItemInfo: ICommentInfo) {
		const commentsInfoOfRepliesToComment =
			commentItemInfo.replies as ICommentInfo[]

		commentsInfoOfRepliesToComment.forEach(commentInfoOfRepliesToComment => {
			if (commentInfoOfRepliesToComment.date === this._commentInfo.date) {
				commentInfoOfRepliesToComment.voteCount = this._voteCount
				this._commentInfo.voteCount = this._voteCount
			}
		})

		if (commentItemInfo.date === this._commentInfo.date) {
			commentItemInfo.voteCount = this._voteCount
			this._commentInfo.voteCount = this._voteCount
		}
	}

	private onunload() {
		this.checkingLocalStorageKey('comments')
		this.checkingLocalStorageKey('favorites')

		this._commentsItemInfo.forEach(commentItemInfo => {
			this.conditionsForChangVoteCount(commentItemInfo)
		})

		this._favorites.forEach(commentItemInfoOfFavorites => {
			this.conditionsForChangVoteCount(commentItemInfoOfFavorites)
		})

		localStorage.setItem('comments', JSON.stringify(this._commentsItemInfo))
		localStorage.setItem('favorites', JSON.stringify(this._favorites))
	}

	protected decrement = (event: MouseEvent) => {
		event.preventDefault()
		const buttonElement = event.target as HTMLButtonElement

		if (this._isDecrement && !this._isIncrement) {
			this._voteCount--
			this._isIncrement = true
		} else if (this._isDecrement) {
			this._voteCount--
			this._isDecrement = false
		} else {
			buttonElement.disabled = true
		}

		buttonElement.disabled = false

		this.drawVoteCount()
		this.onunload()
	}

	protected increment = (event: MouseEvent) => {
		event.preventDefault()
		const buttonElement = event.target as HTMLButtonElement

		if (!this._isDecrement && this._isIncrement) {
			this._voteCount++
			this._isDecrement = true
		} else if (this._isIncrement) {
			this._voteCount++
			this._isIncrement = false
		} else {
			buttonElement.disabled = true
		}

		buttonElement.disabled = false

		this.drawVoteCount()
		this.onunload()
	}

	protected replyToComment(
		replyToCommentWrapper: HTMLDivElement,
		commentsItem: HTMLElement,
		buttonElementLeft: HTMLButtonElement
	) {
		const buttonReplyToCommentForm = this.replyToCommentForm.querySelector(
			'button'
		) as HTMLButtonElement
		const cancelReplyToComment = new Button().draw('Отмена')

		replyToCommentWrapper.append(this.replyToCommentForm, cancelReplyToComment)

		commentsItem.append(replyToCommentWrapper)

		buttonElementLeft.disabled = true

		buttonReplyToCommentForm.onclick = () => {
			this.replyToCommentForm.onsubmit = e => {
				this.commentForm.onSubmit(e, 'reply', this._commentInfo)
				this.select.sortComments()
			}
		}

		cancelReplyToComment.onclick = () => {
			const field = this.replyToCommentForm.querySelector('textarea')
			field!.value = ''
			replyToCommentWrapper.innerHTML = ''

			commentsItem?.removeChild(replyToCommentWrapper)

			buttonElementLeft.disabled = false
		}
	}

	protected addCommentToFavorite(
		styles: CSSModuleClasses,
		fillHeartIconElement: HTMLImageElement,
		favoriteSpanElement: HTMLSpanElement
	) {
		fillHeartIconElement.classList.toggle(styles.active)

		if (this._isChangeTextFavoriteSpanElement) {
			favoriteSpanElement.innerText = 'В избранное'

			this._isChangeTextFavoriteSpanElement = false
		} else {
			favoriteSpanElement.innerText = 'В избранном'

			this._isChangeTextFavoriteSpanElement = true
		}

		if (this._isRemoveFavorites || this._commentInfo.isRemoveFavorites) {
			this.checkingLocalStorageKey('favorites')

			const updatedFavorites = this._favorites.filter(
				commentInfoOfFavorites =>
					commentInfoOfFavorites.date !== this._commentInfo.date
			)

			this._isRemoveFavorites = false
			this._commentInfo.isRemoveFavorites = this._isRemoveFavorites

			// посмотреть завтра этот момент по другому
			// добавляешь ответ на коммент в избранное, потом коммент, убираешь коммент и он не убирается
			updatedFavorites.forEach(item => {
				item.replies.forEach(itemTwo => {
					if (itemTwo.date === this._commentInfo.date) {
						itemTwo.isRemoveFavorites = this._isRemoveFavorites
					}
				})
			})
			//

			localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
		} else {
			this.checkingLocalStorageKey('favorites')

			this._isRemoveFavorites = true

			this._favorites.push({
				...this._commentInfo,
				isRemoveFavorites: this._isRemoveFavorites
			})

			localStorage.setItem('favorites', JSON.stringify(this._favorites))
		}
	}
}
