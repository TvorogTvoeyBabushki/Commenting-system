import { Favorite } from '../favorite/favorite'

import styles from './select.module.scss'
import { CommentItems } from '@/components/layout/comment/comment-item/commentItems'

export class Select {
	selectWrapper = document.createElement('div')
	nameSelectedElement = document.createElement('button')
	arrowSelectedElement = document.createElement('img')
	selectListElements = document.createElement('ul')

	commentItemsWrapper: HTMLElement
	stylesCommentPanel: CSSModuleClasses
	stylesFavorite: CSSModuleClasses
	favorite: Favorite
	commentItemsStyle: CSSModuleClasses

	private _previousSelect: string[] = ['По актуальности']
	private _optionValue = ''

	constructor(
		selectNameAttr: string,
		selectOptionValues: string[],
		commentItemsWrapper: HTMLElement,
		stylesCommentPanel: CSSModuleClasses,
		favorite: Favorite,
		commentPanel: HTMLElement,
		commentItemsStyle: CSSModuleClasses
	) {
		this.commentItemsWrapper = commentItemsWrapper
		this.stylesCommentPanel = stylesCommentPanel
		this.favorite = favorite
		this.stylesFavorite = this.favorite.getStyle()
		this.commentItemsStyle = commentItemsStyle

		this.draw(selectOptionValues, selectNameAttr, commentPanel)
		this.showSortList()
		this.closeSortList()
	}

	private addStyles() {
		this.selectWrapper.classList.add(styles.select)
		this.nameSelectedElement.classList.add(styles.name)
	}

	private addAttrIcon() {
		const propsIconElement = [
			['src', '/public/arrow.png'],
			['alt', 'arrow-icon']
		]

		for (const [attr, val] of propsIconElement) {
			this.arrowSelectedElement.setAttribute(attr, val)
		}
	}

	private showSortList() {
		this.nameSelectedElement.onclick = () => {
			this.arrowSelectedElement.classList.toggle(styles.active)
			this.selectListElements.classList.toggle(styles.active)
		}
	}

	private closeSortList() {
		document.onclick = event => {
			const eventTargetElement = event.target as HTMLElement

			if (!eventTargetElement.classList.contains(styles.active)) {
				this.arrowSelectedElement.classList.remove(styles.active)
				this.selectListElements.classList.remove(styles.active)
			}
		}
	}

	public get getOptionValue() {
		return this._optionValue
	}

	private set getOptionValue(optionValue) {
		this._optionValue = optionValue
	}

	public sortComments(favorites: string = '') {
		this.commentItemsWrapper.innerHTML = ''

		const commentItems = new CommentItems().sortComments(
			!favorites ? this.getOptionValue : favorites,
			this
		)

		commentItems?.forEach(commentItem => {
			this.commentItemsWrapper.append(commentItem)
		})

		this.commentItemsWrapper.classList.remove(this.commentItemsStyle.load)

		if (this.favorite._isFavorite) {
			const lastCommentItem =
				this.commentItemsWrapper.querySelector('.last_comment')
			lastCommentItem?.classList.remove('last_comment')
		}
	}

	public changeStylesFavorite() {
		const parentSelect = this.selectWrapper.parentNode as HTMLElement
		const nodeButtons = [...parentSelect.querySelectorAll('button')]
		const buttonFavorite = nodeButtons.reverse()[0]

		buttonFavorite?.classList.remove(this.favorite.getStyle().active)
	}

	private handleClickLink(
		event: MouseEvent,
		optionValue: string,
		commentPanel: HTMLElement,
		spanNameSelected: HTMLSpanElement,
		checkMarkElement: HTMLImageElement
	) {
		event.preventDefault()

		this.getOptionValue = optionValue

		this.sortComments()

		if (this.favorite._isFavorite) {
			const buttonAmountComments = commentPanel.querySelector(
				'button'
			) as HTMLButtonElement

			buttonAmountComments.classList.add(this.stylesCommentPanel.active)
			this.changeStylesFavorite()

			this.favorite._isFavorite = false
		}

		const lastCommentItem =
			this.commentItemsWrapper.querySelector('.last_comment')
		lastCommentItem?.classList.remove('last_comment')

		const eventTargetElement = event.target as HTMLElement
		spanNameSelected.innerText = `${eventTargetElement.textContent}`

		const checkMarkElements: NodeListOf<HTMLElement> =
			document?.querySelectorAll('.check_mark')

		if (this._previousSelect[0] !== eventTargetElement.textContent) {
			checkMarkElements?.forEach(checkMarkElement => {
				checkMarkElement.style.visibility = 'hidden'
			})

			checkMarkElement.style.visibility = 'visible'

			this._previousSelect.pop()
			this._previousSelect.push(eventTargetElement.textContent as string)
		}
	}

	private draw(
		selectOptionValues: string[],
		selectNameAttr: string,
		commentPanel: HTMLElement
	) {
		const spanNameSelected = document.createElement('span')

		spanNameSelected.innerText = 'По актуальности'
		spanNameSelected.classList.add(styles.active)

		selectOptionValues.forEach(optionValue => {
			const liElement = document.createElement('li')

			const checkMarkElement = document.createElement('img')
			checkMarkElement.classList.add('check_mark')
			checkMarkElement.src = '/public/check-mark.png'

			if (this._previousSelect[0] === optionValue) {
				checkMarkElement.style.visibility = 'visible'
			}

			const linkElement = document.createElement('a')
			const linkProps = [
				['href', '#'],
				['value', optionValue]
			]

			for (const [attr, val] of linkProps) {
				linkElement.setAttribute(attr, val)
			}

			linkElement.innerText = optionValue
			linkElement.insertAdjacentElement('afterbegin', checkMarkElement)

			linkElement.addEventListener('click', event =>
				this.handleClickLink(
					event,
					optionValue,
					commentPanel,
					spanNameSelected,
					checkMarkElement
				)
			)

			liElement.append(linkElement)
			liElement.classList.add(styles.active)

			this.selectListElements.append(liElement)
		})
		this.selectListElements.setAttribute('name', selectNameAttr)

		this.nameSelectedElement.append(spanNameSelected, this.arrowSelectedElement)
		this.selectWrapper.append(this.nameSelectedElement, this.selectListElements)

		this.addStyles()
		this.addAttrIcon()
	}
}
