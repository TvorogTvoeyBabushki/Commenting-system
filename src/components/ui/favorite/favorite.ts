import styles from './favorite.module.scss'
import { CommentItems } from '@/components/layout/comment/comment-item/commentItems'

export class Favorite {
	public _isShowAllComments = false

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
		stylesCommentForm: CSSModuleClasses
	) {
		favoriteButtonElement.onclick = () => {
			commentItemsWrapper.innerHTML = ''
			const commentItems = new CommentItems().sortComments('Избранное')

			commentItems?.forEach(commentItem => {
				commentItemsWrapper.append(commentItem)
			})

			favoriteButtonElement.classList.add(styles.active)

			commentPanelAmountComments.classList.remove(stylesCommentForm.active)
			this._isShowAllComments = true
		}
	}

	public draw(
		children: string,
		commentItemsWrapper: HTMLElement,
		commentPanelAmountComments: HTMLButtonElement,
		stylesCommentForm: CSSModuleClasses
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
			stylesCommentForm
		)

		return favoriteButtonElement
	}
}
