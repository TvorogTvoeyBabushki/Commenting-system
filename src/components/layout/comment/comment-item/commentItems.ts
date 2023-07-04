import { ICommentInfo } from '../comment-form/commentForm'

import styles from './commentItems.module.scss'
import Toolbar from './toolbar/toolbar'

export class CommentItems {
	commentsWrapper: HTMLElement
	commentsItem: HTMLElement | undefined

	private _commentsInfo: ICommentInfo[] | undefined

	constructor() {
		this.commentsWrapper = document.createElement('div')
		this.commentsItem

		if (localStorage.getItem('comment')) {
			this._commentsInfo = [
				...JSON.parse(localStorage.getItem('comment') as string)
			].reverse()
		}

		this.addStyle()
	}

	private addStyle() {
		this.commentsWrapper.classList.add(styles.comments_wrapper)
	}

	public sortComments(optionValue: string) {
		if (optionValue === 'По количеству оценок') {
			this._commentsInfo
				?.sort((a, b) => (a.voteCount as number) - (b.voteCount as number))
				.reverse()
		}

		if (optionValue === 'По актуальности') {
			this._commentsInfo?.sort(
				(a, b) => (a.date as number) - (b.date as number)
			)
		}

		if (optionValue === 'По дате') {
			this._commentsInfo
				?.sort((a, b) => (a.date as number) - (b.date as number))
				.reverse()
		}

		if (optionValue === 'По количеству ответов') {
			// this._commentsInfo
			// 	?.sort((a, b) => (a.date as number) - (b.date as number))
			// 	.reverse()
			return
		}

		this.draw()

		const commentItems = this.commentsWrapper.querySelectorAll('.comment_item')

		return commentItems
	}

	public draw() {
		this._commentsInfo?.forEach(commentInfo => {
			this.commentsItem = document.createElement('div')
			this.commentsItem.classList.add('comment_item')
			const commentsItemImage = document.createElement('img')
			const commentsItemInfo = document.createElement('div')
			const commentsItemToolbar = new Toolbar(
				commentInfo as ICommentInfo
			).draw()

			const imageProps = [
				['src', `${commentInfo?.image}`],
				['alt', 'user']
			]

			for (const [attr, val] of imageProps) {
				commentsItemImage.setAttribute(attr, val)
			}

			const commentsItemInfoWrapper = document.createElement('div')
			const commentsItemInfoNameAndDate = document.createElement('div')

			for (const elem in commentInfo) {
				const paragraphElement = document.createElement('p')

				if (elem === 'author' || elem === 'date') {
					paragraphElement.innerText = `${commentInfo[elem]}`
					commentsItemInfoNameAndDate.append(paragraphElement)
					commentsItemInfoWrapper.append(commentsItemInfoNameAndDate)
				}

				if (elem === 'comment') {
					paragraphElement.innerText = `${commentInfo[elem]}`

					commentsItemInfoWrapper.append(paragraphElement)
				}
			}

			commentsItemInfo.append(commentsItemInfoWrapper, commentsItemToolbar)
			this.commentsItem.append(commentsItemImage, commentsItemInfo)
			this.commentsWrapper.append(this.commentsItem)
		})

		return this.commentsWrapper
	}
}