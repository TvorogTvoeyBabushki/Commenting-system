import moment from 'moment'

import { Select } from '@/components/ui/select/select'

import { ICommentInfo } from '../comment-form/commentForm'

import styles from './commentItems.module.scss'
import { RepliesToComment } from './replies-to-comment/repliesToComment'
import Toolbar from './toolbar/toolbar'

export class CommentItems {
	commentsWrapper = document.createElement('div')

	repliesToComment = new RepliesToComment()

	private _commentsInfo: ICommentInfo[] = []

	constructor() {
		if (localStorage.getItem('comments')) {
			this._commentsInfo = [
				...JSON.parse(localStorage.getItem('comments') as string)
			].sort(
				(a, b) =>
					new Date(b.date as number).valueOf() -
					new Date(a.date as number).valueOf()
			)
		}
	}

	private addStyle() {
		this.commentsWrapper.classList.add(styles.comments_wrapper)
	}

	public sortComments(optionValue: string, select: Select) {
		if (
			optionValue === 'По количеству оценок (по убыв.)' ||
			optionValue === 'По количеству оценок (по возр.)'
		) {
			this._commentsInfo?.sort((a, b) => {
				if (optionValue === 'По количеству оценок (по убыв.)') {
					return (b.voteCount as number) - (a.voteCount as number)
				} else {
					return (a.voteCount as number) - (b.voteCount as number)
				}
			})
		}

		if (optionValue === 'По актуальности') {
			this._commentsInfo?.sort(
				(a, b) =>
					new Date(b.date as number).valueOf() -
					new Date(a.date as number).valueOf()
			)
		}

		if (optionValue === 'По дате') {
			this._commentsInfo?.sort(
				(a, b) =>
					new Date(a.date as number).valueOf() -
					new Date(b.date as number).valueOf()
			)
		}

		if (
			optionValue === 'По количеству ответов (по убыв.)' ||
			optionValue === 'По количеству ответов (по возр.)'
		) {
			this._commentsInfo = [
				...this._commentsInfo.filter(commentInfo => commentInfo.replies)
			]

			this._commentsInfo?.sort((a, b) => {
				const previousCommentInfo = a.replies as ICommentInfo[]
				const nextCommentInfo = b.replies as ICommentInfo[]

				if (optionValue === 'По количеству ответов (по убыв.)') {
					return nextCommentInfo.length - previousCommentInfo.length
				} else {
					return previousCommentInfo.length - nextCommentInfo.length
				}
			})
		}

		if (optionValue === 'Избранное') {
			localStorage.getItem('favorites')
				? (this._commentsInfo = [
						...JSON.parse(localStorage.getItem('favorites') as string)
				  ])
				: (this._commentsInfo = [])
		}

		this.draw(select)

		const commentItems = this.commentsWrapper.querySelectorAll('.comment_item')

		return commentItems
	}

	public addElementsToCommentItem(
		commentInfo: ICommentInfo,
		commentItem: HTMLElement,
		isAddClass: boolean,
		authorPostedComment: string,
		select: Select
	) {
		if (isAddClass) commentItem.classList.add('comment_item')

		const commentItemWrapper = document.createElement('div')
		const commentsItemImage = document.createElement('img')
		const commentsItemInfo = document.createElement('div')
		const commentsItemToolbar = new Toolbar(
			commentInfo as ICommentInfo,
			select
		).draw(commentItem)

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

				if (!commentInfo.replies && elem === 'date') {
					const commentUserNameWrapper = document.createElement('div')
					const iconElement = document.createElement('img')
					const propsIconElement = [
						['src', '/public/answer-to-comment.png'],
						['alt', 'icon']
					]

					for (const [attr, val] of propsIconElement) {
						iconElement.setAttribute(attr, val)
					}

					if (commentInfo.mainPostAuthor)
						authorPostedComment = commentInfo.mainPostAuthor as string

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

		commentsItemInfo.append(commentsItemInfoWrapper)
		commentItemWrapper.append(commentsItemImage, commentsItemInfo)
		commentItem.append(commentItemWrapper, commentsItemToolbar)
	}

	public draw(select: Select) {
		this._commentsInfo?.forEach(commentInfo => {
			const commentItem = document.createElement('div')

			this.addElementsToCommentItem(commentInfo, commentItem, true, '', select)

			if (commentInfo.replies) {
				commentItem.append(this.repliesToComment.draw(commentInfo, select))
			}

			this.commentsWrapper.append(commentItem)
		})

		this.addStyle()

		return this.commentsWrapper
	}
}
