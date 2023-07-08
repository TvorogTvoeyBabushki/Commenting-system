import { Button } from '@/components/ui/button/button'

import CommentForm, { ICommentInfo } from '../../comment-form/commentForm'

export class ToolBarUtils {
	spanVoteCount: HTMLElement = document.createElement('span')

	private _favorites: ICommentInfo[] = []
	protected _commentInfo: ICommentInfo

	private _voteCount: number

	private _isDecrement = true
	private _isIncrement = true
	protected _isChangeTextFavoriteSpanElement = false
	private _isRemoveFavorites = false

	constructor(commentInfo: ICommentInfo) {
		this._commentInfo = commentInfo
		this._voteCount = commentInfo.voteCount as number

		this.checkingLocalStorageKey()

		this._favorites.forEach(commentInfoOfFavorites => {
			if (commentInfoOfFavorites.date === this._commentInfo.date) {
				this._commentInfo.isRemoveFavorites =
					commentInfoOfFavorites.isRemoveFavorites
			}
		})
	}

	protected checkingLocalStorageKey() {
		if (localStorage.getItem('favorites')) {
			this._favorites = [
				...JSON.parse(localStorage.getItem('favorites') as string)
			]
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
	}

	protected replyToComment(
		replyToCommentForm: HTMLFormElement,
		replyToCommentWrapper: HTMLDivElement,
		commentsItem: HTMLElement,
		buttonElementLeft: HTMLButtonElement,
		commentForm: CommentForm
	) {
		const buttonReplyToCommentForm = replyToCommentForm.querySelector(
			'button'
		) as HTMLButtonElement
		const cancelReplyToComment = new Button().draw('Отмена')

		replyToCommentWrapper.append(replyToCommentForm, cancelReplyToComment)

		commentsItem.append(replyToCommentWrapper)

		buttonElementLeft.disabled = true

		buttonReplyToCommentForm.onclick = () => {
			replyToCommentForm.onsubmit = e =>
				commentForm.onSubmit(e, 'reply', this._commentInfo)
		}

		cancelReplyToComment.onclick = () => {
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
			this.checkingLocalStorageKey()

			const updatedFavorites = this._favorites.filter(
				commentInfoOfFavorites =>
					commentInfoOfFavorites.date !== this._commentInfo.date
			)

			localStorage.setItem('favorites', JSON.stringify(updatedFavorites))

			this._isRemoveFavorites = false
			this._commentInfo.isRemoveFavorites = this._isRemoveFavorites
		} else {
			this.checkingLocalStorageKey()

			this._isRemoveFavorites = true

			this._favorites.push({
				...this._commentInfo,
				isRemoveFavorites: this._isRemoveFavorites
			})

			localStorage.setItem('favorites', JSON.stringify(this._favorites))
		}
	}
}
