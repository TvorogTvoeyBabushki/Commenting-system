import { Select } from '@/components/ui/select/select'

import { ICommentInfo } from '../../../comment-form/commentForm'

export const addCommentToFavorite = (
	styles: CSSModuleClasses,
	fillHeartIconElement: HTMLImageElement,
	favoriteSpanElement: HTMLSpanElement,
	isChangeTextFavoriteSpanElement: boolean,
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

	if (commentInfo.isRemoveFavorites) {
		checkingLocalStorageKey

		commentInfo.isRemoveFavorites = false

		favorites.forEach(commentInfoOfFavorites => {
			if (commentInfoOfFavorites.replies) {
				const commentsInfoOfRepliesToComment =
					commentInfoOfFavorites.replies as ICommentInfo[]

				commentsInfoOfRepliesToComment.forEach(
					commentInfoOfRepliesToComment => {
						if (
							commentInfoOfRepliesToComment.date === commentInfo.date &&
							commentInfoOfRepliesToComment.author === commentInfo.author
						) {
							commentInfoOfRepliesToComment.isRemoveFavorites =
								commentInfo.isRemoveFavorites
						}
					}
				)
			}

			if (
				commentInfoOfFavorites.date === commentInfo.date &&
				commentInfoOfFavorites.author === commentInfo.author
			)
				commentInfoOfFavorites.isRemoveFavorites = commentInfo.isRemoveFavorites
		})

		const updatedFavorites = favorites.filter(
			commentInfoOfFavorites => commentInfoOfFavorites.isRemoveFavorites
		)

		localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
	} else {
		checkingLocalStorageKey

		commentInfo.isRemoveFavorites = true

		const commentsInfo = [
			...JSON.parse(localStorage.getItem('comments') as string)
		]

		commentsInfo.forEach(mainCommentInfo => {
			const commentsInfoOfRepliesToComment =
				mainCommentInfo.replies as ICommentInfo[]

			if (commentsInfoOfRepliesToComment.length) {
				commentsInfoOfRepliesToComment.forEach(
					commentInfoOfRepliesToComment => {
						if (
							commentInfoOfRepliesToComment.date === commentInfo.date &&
							commentInfoOfRepliesToComment.author === commentInfo.author
						) {
							commentInfo.mainPostAuthor = mainCommentInfo.author
						}
					}
				)
			}
		})

		favorites.push(commentInfo)

		localStorage.setItem('favorites', JSON.stringify(favorites))
	}

	if (select.favorite._isFavorite) {
		select.sortComments('Избранное')
	}
}
