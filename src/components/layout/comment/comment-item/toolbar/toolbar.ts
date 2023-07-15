import { Select } from '@/components/ui/select/select'

import { ICommentInfo } from '../../comment-form/commentForm'

import styles from './toolbar.module.scss'
import { ToolBarUtils } from './utils/toolbarUtils'
import { VoteCount } from './voteCount/voteCount'

class ToolBar extends ToolBarUtils {
	_commentInfo: ICommentInfo
	voteCount: VoteCount

	constructor(commentInfo: ICommentInfo, select: Select) {
		super(commentInfo, select)

		this._commentInfo = commentInfo
		this.voteCount = new VoteCount(this._commentInfo, select)
	}

	private addStyle(toolbarWrapper: HTMLDivElement) {
		toolbarWrapper.classList.add(styles.toolbar)
	}

	public draw(commentsItem: HTMLElement) {
		const toolbarWrapper = document.createElement('div')
		const toolbarItemLeft = document.createElement('div')
		const toolbarItemRight = document.createElement('div')

		const propsIconElement = [
			[
				['src', '/public/answer-to-comment.png'],
				['alt', 'icon']
			],
			[
				['src', '/public/empty-heart.png'],
				['alt', 'icon']
			]
		]
		const [answer, favorite] = ['Ответить', 'В избранное']
		const [decrement, increment] = ['-', '+']

		const fillHeartIconElement = document.createElement('img')
		const propsFillHeartIconElement = [
			['src', '/public/fill-heart.png'],
			['alt', 'icon']
		]

		for (const [attr, val] of propsFillHeartIconElement) {
			fillHeartIconElement.setAttribute(attr, val)
		}
		fillHeartIconElement.classList.add(styles.fill_heart)

		const favoriteSpanElement = document.createElement('span')
		favoriteSpanElement.innerText = favorite

		if (this._commentInfo.isRemoveFavorites) {
			fillHeartIconElement.classList.add(styles.active)

			favoriteSpanElement.innerText = 'В избранном'
			this._isChangeTextFavoriteSpanElement = true
		}

		propsIconElement.forEach((item, index) => {
			const iconElement = document.createElement('img')

			for (const [attr, val] of item) {
				iconElement.setAttribute(attr, val)
			}

			const buttonElementLeft = document.createElement('button')
			const buttonTextLeft = index === 0 ? answer : favoriteSpanElement

			const replyToCommentWrapper = document.createElement('div')

			index === 0
				? buttonElementLeft.addEventListener('click', () => {
						this.replyToComment(
							replyToCommentWrapper,
							commentsItem,
							buttonElementLeft
						)
				  })
				: buttonElementLeft.addEventListener('click', () =>
						this.addCommentToFavorite(
							styles,
							fillHeartIconElement,
							favoriteSpanElement
						)
				  )

			buttonElementLeft.append(
				fillHeartIconElement,
				iconElement,
				buttonTextLeft
			)

			toolbarItemLeft.append(buttonElementLeft)

			if (!this._commentInfo.replies && index === 0)
				toolbarItemLeft.removeChild(buttonElementLeft)

			const buttonElementRight = document.createElement('button')
			const buttonTextRight = index === 0 ? decrement : increment

			index === 0
				? buttonElementRight.addEventListener('click', this.voteCount.decrement)
				: buttonElementRight.addEventListener('click', this.voteCount.increment)

			buttonElementRight.append(buttonTextRight)
			toolbarItemRight.append(buttonElementRight)

			if (index !== 0) {
				buttonElementRight.before(this.voteCount.drawVoteCount())
			}

			toolbarWrapper.append(toolbarItemLeft, toolbarItemRight)
		})

		this.addStyle(toolbarWrapper)

		return toolbarWrapper
	}
}

export default ToolBar
