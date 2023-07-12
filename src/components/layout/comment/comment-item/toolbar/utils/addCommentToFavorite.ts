import { Select } from '@/components/ui/select/select'

import { ICommentInfo } from '../../../comment-form/commentForm'

export const addCommentToFavorite = (
	styles: CSSModuleClasses,
	fillHeartIconElement: HTMLImageElement,
	favoriteSpanElement: HTMLSpanElement,
	isChangeTextFavoriteSpanElement: boolean,
	isRemoveFavorites: boolean,
	commentInfo: ICommentInfo,
	checkingLocalStorageKey: void,
	favorites: ICommentInfo[],
	select: Select
) => {
	fillHeartIconElement.classList.toggle(styles.active)

	if (isChangeTextFavoriteSpanElement) {
		favoriteSpanElement.innerText = 'В избранное'

		isChangeTextFavoriteSpanElement = false
	} else {
		favoriteSpanElement.innerText = 'В избранном'

		isChangeTextFavoriteSpanElement = true
	}

	if (isRemoveFavorites || commentInfo.isRemoveFavorites) {
		checkingLocalStorageKey

		isRemoveFavorites = false
		commentInfo.isRemoveFavorites = isRemoveFavorites

		favorites.forEach(commentInfoOfFavorites => {
			if (commentInfoOfFavorites.replies) {
				const commentsInfoOfRepliesToComment =
					commentInfoOfFavorites.replies as ICommentInfo[]

				commentsInfoOfRepliesToComment.forEach(
					commentInfoOfRepliesToComment => {
						if (commentInfoOfRepliesToComment.date === commentInfo.date) {
							commentInfoOfRepliesToComment.isRemoveFavorites =
								isRemoveFavorites
						}
					}
				)
			}
		})

		const updatedFavorites = favorites.filter(
			commentInfoOfFavorites => commentInfoOfFavorites.date !== commentInfo.date
		)

		localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
	} else {
		checkingLocalStorageKey

		isRemoveFavorites = true

		favorites.push({
			...commentInfo,
			isRemoveFavorites: isRemoveFavorites
		})

		localStorage.setItem('favorites', JSON.stringify(favorites))
	}

	if (select.favorite._isShowAllComments) {
		select.sortComments('Избранное')
	}
}
