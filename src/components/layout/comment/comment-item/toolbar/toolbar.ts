import { Button } from '@/components/ui/button/button'

import CommentForm, { ICommentInfo } from '../../comment-form/commentForm'
import styles from '../commentItems.module.scss'

import { ToolBarUtils } from './toolbarUtils'

class ToolBar extends ToolBarUtils {
	constructor(commentInfo: ICommentInfo) {
		super(commentInfo)
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
						const replyToCommentForm = new CommentForm().formElement
						const buttonReplyToCommentForm = replyToCommentForm.querySelector(
							'button'
						) as HTMLButtonElement
						const cancelReplyToComment = new Button().draw('Отмена')

						replyToCommentWrapper.style.marginTop = '50px'

						replyToCommentWrapper.append(
							replyToCommentForm,
							cancelReplyToComment
						)
						commentsItem.append(replyToCommentWrapper)

						buttonElementLeft.disabled = true

						buttonReplyToCommentForm.onclick = e => {
							e.preventDefault()
							console.log(new CommentForm())
						}

						cancelReplyToComment.onclick = () => {
							replyToCommentWrapper.style.marginTop = '0'
							replyToCommentWrapper.innerHTML = ''

							buttonElementLeft.disabled = false
						}
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

			const buttonElementRight = document.createElement('button')
			const buttonTextRight = index === 0 ? decrement : increment

			index === 0
				? buttonElementRight.addEventListener('click', this.decrement)
				: buttonElementRight.addEventListener('click', this.increment)

			buttonElementRight.append(buttonTextRight)
			toolbarItemRight.append(buttonElementRight)

			const previousButton = buttonElementRight.previousElementSibling
			previousButton?.nextElementSibling?.before(this.drawVoteCount())

			toolbarWrapper.append(toolbarItemLeft, toolbarItemRight)
		})

		return toolbarWrapper
	}
}

export default ToolBar
