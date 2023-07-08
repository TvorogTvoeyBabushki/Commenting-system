import moment from 'moment'

import { ICommentInfo } from '../comment-form/commentForm'

import styles from './commentItems.module.scss'
import { RepliesToComment } from './replies-to-comment/repliesToComment'
import Toolbar from './toolbar/toolbar'

export class CommentItems {
	commentsWrapper = document.createElement('div')

	repliesToComment = new RepliesToComment()

	private _commentsInfo: ICommentInfo[] = []

	constructor() {
		if (localStorage.getItem('comment')) {
			this._commentsInfo = [
				...JSON.parse(localStorage.getItem('comment') as string)
			].reverse()
		}
	}

	private addStyle() {
		this.commentsWrapper.classList.add(styles.comments_wrapper)
	}

	public sortComments(optionValue: string, isReverseSort: boolean) {
		if (optionValue === 'По количеству оценок') {
			this._commentsInfo
				?.sort((a, b) => (a.voteCount as number) - (b.voteCount as number))
				.reverse()

			if (isReverseSort) this._commentsInfo.reverse()
		}

		if (optionValue === 'По актуальности') {
			this._commentsInfo?.sort(
				(a, b) => (a.date as number) - (b.date as number)
			)

			if (isReverseSort) this._commentsInfo.reverse()
		}

		if (optionValue === 'По дате') {
			this._commentsInfo
				?.sort((a, b) => (a.date as number) - (b.date as number))
				.reverse()

			if (isReverseSort) this._commentsInfo.reverse()
		}

		if (optionValue === 'По количеству ответов') {
			this._commentsInfo = [
				...this._commentsInfo.filter(commentInfo => commentInfo.replies)
			]

			this._commentsInfo
				?.sort((a, b) => {
					const previousCommentInfo = a.replies as ICommentInfo[]
					const nextCommentInfo = b.replies as ICommentInfo[]

					return previousCommentInfo.length - nextCommentInfo.length
				})
				.reverse()

			if (isReverseSort) this._commentsInfo.reverse()
		}

		// один общий флаг на все сортировки(нужно сделать для каждого свой)
		//  при клике на другую сортировку сбрасывать флаг предыдущего

		if (optionValue === 'Избранное') {
			this._commentsInfo = [
				...JSON.parse(localStorage.getItem('favorites') as string)
			]
		}

		this.draw()

		const commentItems = this.commentsWrapper.querySelectorAll('.comment_item')

		return commentItems
	}

	public addElementsToCommentItem(
		commentInfo: ICommentInfo,
		commentItem: HTMLElement,
		isAddClass: boolean,
		type: string,
		authorPostedComment: string
	) {
		if (isAddClass) commentItem.classList.add('comment_item')

		const commentsItemImage = document.createElement('img')
		const commentsItemInfo = document.createElement('div')
		const commentsItemToolbar = new Toolbar(commentInfo as ICommentInfo).draw(
			commentItem
		)

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
				elem === 'author'
					? (paragraphElement.innerText = `${commentInfo[elem]}`)
					: (paragraphElement.innerText = `${moment(
							commentInfo[elem] as number
					  ).format('DD.MM HH:mm')}`)

				if (type === 'replies' && elem === 'date') {
					const commentUserNameWrapper = document.createElement('div')
					const iconElement = document.createElement('img')
					const propsIconElement = [
						['src', '/public/answer-to-comment.png'],
						['alt', 'icon']
					]

					for (const [attr, val] of propsIconElement) {
						iconElement.setAttribute(attr, val)
					}

					commentUserNameWrapper.append(iconElement, authorPostedComment)
					commentsItemInfoNameAndDate.append(commentUserNameWrapper)
				}

				commentsItemInfoNameAndDate.append(paragraphElement)
				commentsItemInfoWrapper.append(commentsItemInfoNameAndDate)
			}

			if (elem === 'comment') {
				paragraphElement.innerText = `${commentInfo[elem]}`

				commentsItemInfoWrapper.append(paragraphElement)
			}
		}

		commentsItemInfo.append(commentsItemInfoWrapper, commentsItemToolbar)
		commentItem.append(commentsItemImage, commentsItemInfo)
	}

	public draw() {
		this._commentsInfo?.forEach(commentInfo => {
			const commentItem = document.createElement('div')

			this.addElementsToCommentItem(commentInfo, commentItem, true, '', '')

			if (commentInfo.replies) {
				commentItem.append(this.repliesToComment.draw(commentInfo))
			}

			this.commentsWrapper.append(commentItem)
		})

		this.addStyle()

		return this.commentsWrapper
	}
}
