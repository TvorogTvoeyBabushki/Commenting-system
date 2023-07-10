import { Select } from '@/components/ui/select/select'

import { ICommentInfo } from '../../comment-form/commentForm'
import { CommentItems } from '../commentItems'
import styles from '../commentItems.module.scss'

export class RepliesToComment {
	repliesToCommentWrapper: HTMLElement | undefined
	private _commentsInfoOfRepliesToComment: ICommentInfo[] = []

	private addStyle() {
		const nameStyles = [styles.comments_wrapper, styles.replies]
		this.repliesToCommentWrapper?.classList.add(...nameStyles)
	}

	public draw(commentInfoOfPostedComment: ICommentInfo, select: Select) {
		this.repliesToCommentWrapper = document.createElement('div')

		this._commentsInfoOfRepliesToComment = [
			...(commentInfoOfPostedComment.replies as ICommentInfo[])
		]

		this._commentsInfoOfRepliesToComment.forEach(
			commentInfoOfRepliesToComment => {
				const commentItem = document.createElement('div')
				const commentItems = new CommentItems()

				commentItems.addElementsToCommentItem(
					commentInfoOfRepliesToComment,
					commentItem,
					false,
					'replies',
					commentInfoOfPostedComment.author as string,
					select
				)

				const replyButtonOfToolbar = commentItem.querySelector(
					'button'
				) as HTMLButtonElement
				const parentReplyButtonOfToolbar = replyButtonOfToolbar.parentNode

				parentReplyButtonOfToolbar?.removeChild(replyButtonOfToolbar)

				this.repliesToCommentWrapper?.append(commentItem)
			}
		)

		this.addStyle()

		return this.repliesToCommentWrapper
	}
}
