import { Button } from '@/components/ui/button/button'
import { Select } from '@/components/ui/select/select'

import CommentForm, { ICommentInfo } from '../../../comment-form/commentForm'

export const replyToComment = (
	replyToCommentWrapper: HTMLDivElement,
	commentItem: HTMLElement,
	buttonElementLeft: HTMLButtonElement,
	replyToCommentForm: HTMLFormElement,
	commentForm: CommentForm,
	commentInfo: ICommentInfo,
	select: Select
) => {
	const buttonReplyToCommentForm = replyToCommentForm.querySelector(
		'button'
	) as HTMLButtonElement
	const cancelReplyToComment = new Button().draw('Отмена')
	const parentButtonNode = buttonReplyToCommentForm.parentNode

	parentButtonNode?.append(cancelReplyToComment)
	replyToCommentWrapper.append(replyToCommentForm)
	commentItem.append(replyToCommentWrapper)

	buttonElementLeft.disabled = true

	buttonReplyToCommentForm.onclick = () => {
		replyToCommentForm.onsubmit = e => {
			commentForm.onSubmit(e, 'reply', commentInfo)

			let typeSelectFavorites = ''

			if (select.favorite._isFavorite) {
				typeSelectFavorites = 'Избранное'
			}

			select.sortComments(typeSelectFavorites)

			const lastCommentItem = document.querySelector('.last_comment') // попробовать ещё через метод draw

			lastCommentItem?.classList.remove('last_comment')
		}
	}

	cancelReplyToComment.onclick = () => {
		const field = replyToCommentForm.querySelector('textarea')
		field!.value = ''
		field!.style.height = '65px'

		parentButtonNode?.removeChild(cancelReplyToComment)
		commentItem?.removeChild(replyToCommentWrapper)

		buttonElementLeft.disabled = false
	}
}
