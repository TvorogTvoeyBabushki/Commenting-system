import { ICommentInfo } from '../../../comment-form/commentForm'

export class VoteCount {
	spanVoteCount: HTMLElement = document.createElement('span')

	private _favorites: ICommentInfo[] = []
	private _commentsInfo: ICommentInfo[] = []
	private _commentInfo: ICommentInfo

	private _voteCount: number
	private _isDecrement = true
	private _isIncrement = true

	constructor(commentInfo: ICommentInfo) {
		this._commentInfo = commentInfo
		this._voteCount = this._commentInfo.voteCount as number

		this.checkingLocalStorageKey('favorites')
		this.checkingLocalStorageKey('comments')
	}

	public checkingLocalStorageKey(type: string) {
		if (localStorage.getItem(type)) {
			const parseLocalStorage = [
				...JSON.parse(localStorage.getItem(type) as string)
			]

			type === 'favorites'
				? (this._favorites = parseLocalStorage)
				: (this._commentsInfo = parseLocalStorage)
		}
	}

	public drawVoteCount() {
		this._voteCount > 0
			? (this.spanVoteCount.style.color = '#8AC540')
			: this._voteCount < 0
			? (this.spanVoteCount.style.color = '#F00')
			: (this.spanVoteCount.style.color = '#000')

		this.spanVoteCount.innerText = `${this._voteCount}`

		return this.spanVoteCount
	}

	private conditionsForChangVoteCount(commentInfo: ICommentInfo) {
		const commentsInfoOfRepliesToComment = commentInfo.replies as ICommentInfo[]

		if (commentsInfoOfRepliesToComment) {
			commentsInfoOfRepliesToComment.forEach(commentInfoOfRepliesToComment => {
				if (commentInfoOfRepliesToComment.date === this._commentInfo.date) {
					commentInfoOfRepliesToComment.voteCount = this._voteCount
					this._commentInfo.voteCount = this._voteCount
				}
			})
		}

		if (commentInfo.date === this._commentInfo.date) {
			commentInfo.voteCount = this._voteCount
			this._commentInfo.voteCount = this._voteCount
		}
	}

	private changeVoteCountInLocalStorage() {
		this.checkingLocalStorageKey('comments')
		this.checkingLocalStorageKey('favorites')

		this._commentsInfo.forEach(commentInfo => {
			this.conditionsForChangVoteCount(commentInfo)
		})

		this._favorites.forEach(commentInfoOfFavorites => {
			this.conditionsForChangVoteCount(commentInfoOfFavorites)
		})

		localStorage.setItem('comments', JSON.stringify(this._commentsInfo))
		localStorage.setItem('favorites', JSON.stringify(this._favorites))
	}

	public decrement = (event: MouseEvent) => {
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
		this.changeVoteCountInLocalStorage()
	}

	public increment = (event: MouseEvent) => {
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
		this.changeVoteCountInLocalStorage()
	}
}
