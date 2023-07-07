import moment from 'moment'

import { ICommentInfo } from '../../comment-form/commentForm'
import ToolBar from '../toolbar/toolbar'

import styles from './repliesToComment.module.scss'

export class RepliesToComment {
	repliesToCommentWrapper: HTMLElement | undefined
	private _commentsInfoOfRepliesToComment: ICommentInfo[] = []

	private addStyle() {
		this.repliesToCommentWrapper?.classList.add(styles.replies)
	}

	public draw(commentInfo: ICommentInfo) {
		this.repliesToCommentWrapper = document.createElement('div')

		this._commentsInfoOfRepliesToComment = [
			...(commentInfo.replies as ICommentInfo[])
		]

		this._commentsInfoOfRepliesToComment.forEach(
			commentInfoOfRepliesToComment => {
				const commentsItem = document.createElement('div')

				const commentsItemImage = document.createElement('img')
				const commentsItemInfo = document.createElement('div')

				const imageProps = [
					['src', `${commentInfoOfRepliesToComment?.image}`],
					['alt', 'user']
				]

				for (const [attr, val] of imageProps) {
					commentsItemImage.setAttribute(attr, val)
				}

				const commentsItemInfoWrapper = document.createElement('div')
				const commentsItemInfoNameAndDate = document.createElement('div')
				const commentsItemToolbar = new ToolBar(
					commentInfo as ICommentInfo
				).draw(commentsItem)

				for (const elem in commentInfoOfRepliesToComment) {
					const paragraphElement = document.createElement('p')

					if (elem === 'author' || elem === 'date') {
						elem === 'author'
							? (paragraphElement.innerText = `${commentInfoOfRepliesToComment[elem]}`)
							: (paragraphElement.innerText = `${moment(
									commentInfoOfRepliesToComment[elem] as number
							  ).format('DD.MM HH:mm')}`)

						commentsItemInfoNameAndDate.append(paragraphElement)
						commentsItemInfoWrapper.append(commentsItemInfoNameAndDate)
					}

					if (elem === 'comment') {
						paragraphElement.innerText = `${commentInfoOfRepliesToComment[elem]}`

						commentsItemInfoWrapper.append(paragraphElement)
					}
				}

				commentsItemInfo.append(commentsItemInfoWrapper, commentsItemToolbar)
				commentsItem.append(commentsItemImage, commentsItemInfo)
				this.repliesToCommentWrapper?.append(commentsItem)
			}
		)

		this.addStyle()

		return this.repliesToCommentWrapper
	}
}
