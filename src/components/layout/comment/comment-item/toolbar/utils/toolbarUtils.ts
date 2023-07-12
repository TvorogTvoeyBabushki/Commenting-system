import { Select } from '@/components/ui/select/select'

import CommentForm, { ICommentInfo } from '../../../comment-form/commentForm'

import { addCommentToFavorite } from './addCommentToFavorite'
import { replyToComment } from './replyToComment'

export class ToolBarUtils {
	commentForm: CommentForm
	replyToCommentForm: HTMLFormElement
	select: Select

	private _favorites: ICommentInfo[] = []
	protected _commentInfo: ICommentInfo

	protected _isChangeTextFavoriteSpanElement = false
	private _isRemoveFavorites = false

	constructor(commentInfo: ICommentInfo, select: Select) {
		this._commentInfo = commentInfo

		this.commentForm = new CommentForm(null, null)
		this.replyToCommentForm = this.commentForm.draw()
		this.select = select

		this.checkingLocalStorageKey()

		this._favorites.forEach(commentInfoOfFavorites => {
			if (commentInfoOfFavorites.date === this._commentInfo.date) {
				this._commentInfo.isRemoveFavorites =
					commentInfoOfFavorites.isRemoveFavorites
			}
		})
	}

	private checkingLocalStorageKey() {
		if (localStorage.getItem('favorites')) {
			this._favorites = [
				...JSON.parse(localStorage.getItem('favorites') as string)
			]
		}
	}

	protected replyToComment(
		replyToCommentWrapper: HTMLDivElement,
		commentItem: HTMLElement,
		buttonElementLeft: HTMLButtonElement
	) {
		replyToComment(
			replyToCommentWrapper,
			commentItem,
			buttonElementLeft,
			this.replyToCommentForm,
			this.commentForm,
			this._commentInfo,
			this.select
		)
	}

	protected addCommentToFavorite(
		styles: CSSModuleClasses,
		fillHeartIconElement: HTMLImageElement,
		favoriteSpanElement: HTMLSpanElement
	) {
		addCommentToFavorite(
			styles,
			fillHeartIconElement,
			favoriteSpanElement,
			this._isChangeTextFavoriteSpanElement,
			this._isRemoveFavorites,
			this._commentInfo,
			this.checkingLocalStorageKey(),
			this._favorites,
			this.select
		)
	}
}
