import { Favorite } from '@/components/ui/favorite/favorite'
import { Select } from '@/components/ui/select/select'

import CommentForm from '../comment-form/commentForm'

import styles from './commentPanel.module.scss'

export class CommentPanel {
	commentPanel = document.createElement('div')
	commentPanelAmountComments = document.createElement('button')

	commentItemsWrapper: HTMLElement

	select: Select
	favorite: Favorite

	constructor(commentItemsWrapper: HTMLElement) {
		this.commentItemsWrapper = commentItemsWrapper

		const selectOptionValues = [
			'По дате',
			'По количеству оценок',
			'По актуальности',
			'По количеству ответов'
		]

		this.favorite = new Favorite()
		this.select = new Select(
			'sortComment',
			selectOptionValues,
			this.commentItemsWrapper,
			styles,
			this.favorite.getStyle()
		)
	}

	public addStyles() {
		this.commentPanel.classList.add(styles.comment_panel)
		this.commentPanelAmountComments.classList.add(styles.active)
	}

	public changeStyles() {
		const nodeListButtons = [...this.commentPanel.querySelectorAll('button')]
		nodeListButtons.at(-1)?.classList.remove(this.favorite.getStyle().active)

		this.addStyles()
	}

	public drawAmountComments(commentsLength: number) {
		this.commentPanelAmountComments.innerHTML = `Комментарии <span>(${commentsLength})</span>`

		this.commentPanelAmountComments.onclick = () => {
			if (this.favorite._isShowAllComments) {
				this.commentItemsWrapper.innerHTML = ''

				this.select.sortComments()
				this.changeStyles()

				this.favorite._isShowAllComments = false
			}
		}

		return this.commentPanelAmountComments
	}

	public drawCommentPanel(commentsLength: number) {
		this.commentPanel.append(
			this.drawAmountComments(commentsLength),
			this.select.selectWrapper,
			this.favorite.draw(
				'Избранное',
				this.commentItemsWrapper,
				this.commentPanelAmountComments,
				styles
			)
		)

		this.addStyles()

		return this.commentPanel
	}
}
