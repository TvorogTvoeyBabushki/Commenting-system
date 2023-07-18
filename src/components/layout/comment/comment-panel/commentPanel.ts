import { Favorite } from '@/components/ui/favorite/favorite'
import { Select } from '@/components/ui/select/select'

import { CommentItems } from '../comment-item/commentItems'

import styles from './commentPanel.module.scss'

export class CommentPanel {
	commentPanel = document.createElement('div')
	commentPanelAmountComments = document.createElement('button')

	commentItemsWrapper: HTMLElement
	commentItemsStyle: CSSModuleClasses

	select: Select
	favorite: Favorite

	constructor(commentItems: CommentItems) {
		this.commentItemsWrapper = commentItems.commentsWrapper
		this.commentItemsStyle = commentItems.getStyle()

		const selectOptionValues = [
			'По дате',
			'По количеству оценок (по убыв.)',
			'По количеству оценок (по возр.)',
			'По актуальности',
			'По количеству ответов (по убыв.)',
			'По количеству ответов (по возр.)'
		]

		this.favorite = new Favorite()
		this.select = new Select(
			'sortComment',
			selectOptionValues,
			this.commentItemsWrapper,
			styles,
			this.favorite,
			this.commentPanel,
			this.commentItemsStyle
		)
	}

	private addStyles() {
		this.commentPanel.classList.add(styles.comment_panel)
		this.commentPanelAmountComments.classList.add(styles.active)
	}

	public changeStyles() {
		this.select.changeStylesFavorite()
		this.addStyles()
	}

	public drawAmountComments(commentsLength: number) {
		this.commentPanelAmountComments.innerHTML = `Комментарии <span>(${commentsLength})</span>`

		this.commentPanelAmountComments.onclick = () => {
			if (this.favorite._isFavorite) {
				this.select.sortComments()
				this.changeStyles()

				const lastCommentItem =
					this.commentItemsWrapper.querySelector('.last_comment')
				lastCommentItem?.classList.remove('last_comment')

				this.favorite._isFavorite = false
			}
		}

		return this.commentPanelAmountComments
	}

	public drawCommentPanel(commentsLength: number) {
		const wrapperSelectAndFavorite = document.createElement('div')

		wrapperSelectAndFavorite.append(
			this.select.selectWrapper,
			this.favorite.draw(
				'Избранное',
				this.commentItemsWrapper,
				this.commentPanelAmountComments,
				styles,
				this.select,
				this.commentItemsStyle
			)
		)
		this.commentPanel.append(
			this.drawAmountComments(commentsLength),
			wrapperSelectAndFavorite
		)

		this.addStyles()

		return this.commentPanel
	}
}
