import { Select } from '../select/select'

import styles from './favorite.module.scss'
import { CommentItems } from '@/components/layout/comment/comment-item/commentItems'

export class Favorite {
	public _isFavorite = false

	public getStyle() {
		return styles
	}

	private addStyles(favoriteButtonElement: HTMLButtonElement) {
		favoriteButtonElement.classList.add(styles.favorite)
	}

	private handleClick(
		favoriteButtonElement: HTMLButtonElement,
		commentItemsWrapper: HTMLElement,
		commentPanelAmountComments: HTMLButtonElement,
		stylesCommentForm: CSSModuleClasses,
		select: Select,
		commentItemsStyle: CSSModuleClasses
	) {
		favoriteButtonElement.onclick = () => {
			favoriteButtonElement.classList.add(styles.active)
			commentPanelAmountComments.classList.remove(stylesCommentForm.active)

			this._isFavorite = true

			commentItemsWrapper.innerHTML = ''
			const commentItems = new CommentItems().sortComments('Избранное', select)

			commentItemsWrapper.classList.remove(commentItemsStyle.load)

			commentItems?.forEach(commentItem => {
				commentItemsWrapper.append(commentItem)
			})

			const lastCommentItem = commentItemsWrapper.querySelector('.last_comment')
			lastCommentItem?.classList.remove('last_comment')
		}
	}

	public draw(
		children: string,
		commentItemsWrapper: HTMLElement,
		commentPanelAmountComments: HTMLButtonElement,
		stylesCommentForm: CSSModuleClasses,
		select: Select,
		commentItemsStyle: CSSModuleClasses
	) {
		const favoriteButtonElement = document.createElement('button')
		const favoriteButtonText = document.createElement('span')
		const favoriteIconElement = document.createElement('img')
		const favoriteIconElementProps = [
			['src', '/public/favorites.png'],
			['alt', 'icon']
		]

		favoriteButtonText.innerText = children

		for (const [attr, val] of favoriteIconElementProps) {
			favoriteIconElement.setAttribute(attr, val)
		}

		favoriteButtonElement.append(favoriteButtonText, favoriteIconElement)

		this.addStyles(favoriteButtonElement)
		this.handleClick(
			favoriteButtonElement,
			commentItemsWrapper,
			commentPanelAmountComments,
			stylesCommentForm,
			select,
			commentItemsStyle
		)

		return favoriteButtonElement
	}
}
