import { Select } from '@/components/ui/select/select'

import { ICommentInfo } from '../../../comment-form/commentForm'

export class VoteCount {
	spanVoteCount: HTMLElement = document.createElement('span')

	private _favorites: ICommentInfo[] = []
	private _commentsInfo: ICommentInfo[] = []
	private _commentInfo: ICommentInfo
	select: Select

	private _voteCount: number

	constructor(commentInfo: ICommentInfo, select: Select) {
		this._commentInfo = commentInfo
		this.select = select

		this.checkingLocalStorageKey('favorites')
		this.checkingLocalStorageKey('comments')

		this._voteCount = this._commentInfo.voteCount as number
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

		if (this._voteCount < 0) {
			this._voteCount *= -1
		}

		this.spanVoteCount.innerText = `${this._voteCount}`

		this._commentsInfo.forEach(commentInfo => {
			const commentsInfoOfRepliesToComment =
				commentInfo.replies as ICommentInfo[]

			if (commentsInfoOfRepliesToComment.length) {
				commentsInfoOfRepliesToComment.forEach(
					commentInfoOfRepliesToComment => {
						if (
							commentInfoOfRepliesToComment.date === this._commentInfo.date &&
							commentInfoOfRepliesToComment.author === this._commentInfo.author
						) {
							if ((commentInfoOfRepliesToComment.voteCount as number) < 0)
								this._voteCount *= -1
						}
					}
				)
			}
			if (
				commentInfo.date === this._commentInfo.date &&
				commentInfo.author === this._commentInfo.author
			) {
				if ((commentInfo.voteCount as number) < 0) this._voteCount *= -1
			}
		})

		return this.spanVoteCount
	}

	private checkChangeAndPushValueInLocalStorage(
		conditions: (commentInfo: ICommentInfo) => void
	) {
		this.checkingLocalStorageKey('comments')
		this.checkingLocalStorageKey('favorites')

		this._commentsInfo.forEach(commentInfo => {
			conditions(commentInfo)
		})

		this._favorites.forEach(commentInfoOfFavorites => {
			conditions(commentInfoOfFavorites)
		})

		localStorage.setItem('comments', JSON.stringify(this._commentsInfo))
		localStorage.setItem('favorites', JSON.stringify(this._favorites))
	}

	private conditionsForChangVoteCount = (commentInfo: ICommentInfo) => {
		const commentsInfoOfRepliesToComment = commentInfo.replies as ICommentInfo[]

		if (commentsInfoOfRepliesToComment) {
			commentsInfoOfRepliesToComment.forEach(commentInfoOfRepliesToComment => {
				if (
					commentInfoOfRepliesToComment.date === this._commentInfo.date &&
					commentInfoOfRepliesToComment.author === this._commentInfo.author
				) {
					commentInfoOfRepliesToComment.voteCount = this._voteCount
					this._commentInfo.voteCount = this._voteCount

					commentInfoOfRepliesToComment.isDecrement =
						this._commentInfo.isDecrement
					commentInfoOfRepliesToComment.isIncrement =
						this._commentInfo.isIncrement
				}
			})
		}

		if (
			commentInfo.date === this._commentInfo.date &&
			commentInfo.author === this._commentInfo.author
		) {
			commentInfo.voteCount = this._voteCount
			this._commentInfo.voteCount = this._voteCount

			commentInfo.isDecrement = this._commentInfo.isDecrement
			commentInfo.isIncrement = this._commentInfo.isIncrement
		}
	}

	private changeVoteCountInLocalStorage() {
		this.checkChangeAndPushValueInLocalStorage(this.conditionsForChangVoteCount)

		if (
			this.select.favorite._isFavorite &&
			!this._commentInfo.replies &&
			this._commentInfo.isRemoveFavorites
		) {
			this.select.commentItemsWrapper.innerHTML = ''

			this.select.sortComments('Избранное')
		}
	}

	private conditionsForUpdateVoteCount = (commentInfo: ICommentInfo) => {
		commentInfo.isDecrement = true
		commentInfo.isIncrement = true

		const commentsInfoOfRepliesToComment = commentInfo.replies as ICommentInfo[]

		if (commentsInfoOfRepliesToComment) {
			commentsInfoOfRepliesToComment.forEach(commentInfoOfRepliesToComment => {
				commentInfoOfRepliesToComment.isDecrement = true
				commentInfoOfRepliesToComment.isIncrement = true
			})
		}
	}

	private updateVoteCount() {
		onunload = () => {
			this.checkChangeAndPushValueInLocalStorage(
				this.conditionsForUpdateVoteCount
			)
		}
	}

	public decrement = (event: MouseEvent) => {
		event.preventDefault()

		if (this._commentInfo.isDecrement && !this._commentInfo.isIncrement) {
			this._voteCount--

			this._commentInfo.isIncrement = true
		} else if (this._commentInfo.isDecrement) {
			this._voteCount--

			this._commentInfo.isDecrement = false
		} else {
			return
		}

		this.changeVoteCountInLocalStorage()
		this.drawVoteCount()
		this.updateVoteCount()
	}

	public increment = (event: MouseEvent) => {
		event.preventDefault()

		if (!this._commentInfo.isDecrement && this._commentInfo.isIncrement) {
			this._voteCount++

			this._commentInfo.isDecrement = true
		} else if (this._commentInfo.isIncrement) {
			this._voteCount++

			this._commentInfo.isIncrement = false
		} else {
			return
		}

		this.changeVoteCountInLocalStorage()
		this.drawVoteCount()
		this.updateVoteCount()
	}
}
