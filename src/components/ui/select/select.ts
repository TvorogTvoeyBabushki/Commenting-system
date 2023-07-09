import styles from './select.module.scss'
import { CommentItems } from '@/components/layout/comment/comment-item/commentItems'

interface IInfoOfSelectedSortItem {
	[key: string]: string | boolean
}

export class Select {
	selectWrapper = document.createElement('div')
	nameSelectedElement = document.createElement('button')
	arrowSelectedElement = document.createElement('img')
	selectListElements = document.createElement('ul')

	commentItemsWrapper: HTMLElement
	stylesCommentPanel: CSSModuleClasses
	stylesFavorite: CSSModuleClasses

	private _previousSelect: string[] = ['По актуальности']
	private _optionValue = ''
	private _infoOfSelectedSortItems: IInfoOfSelectedSortItem[] = []

	constructor(
		selectNameAttr: string,
		selectOptionValues: string[],
		commentItemsWrapper: HTMLElement,
		stylesCommentPanel: CSSModuleClasses,
		stylesFavorite: CSSModuleClasses
	) {
		this.commentItemsWrapper = commentItemsWrapper
		this.stylesCommentPanel = stylesCommentPanel
		this.stylesFavorite = stylesFavorite

		this.draw(selectOptionValues, selectNameAttr)
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

	public sortComments(isReverseSort: boolean) {
		this.commentItemsWrapper.innerHTML = ''
		const commentItems = new CommentItems().sortComments(
			this.getOptionValue,
			isReverseSort as boolean
		)

		commentItems?.forEach(commentItem => {
			this.commentItemsWrapper.append(commentItem)
		})

		const parentElementSelectWrapper = this.selectWrapper.parentElement
		const nodeListButtons = [
			...parentElementSelectWrapper!.querySelectorAll('button')
		]

		nodeListButtons[0]?.classList.add(this.stylesCommentPanel.active)
		nodeListButtons[nodeListButtons.length - 1].classList.remove(
			this.stylesFavorite.active
		)
	}

	private draw(selectOptionValues: string[], selectNameAttr: string) {
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

			let isPushInfoOfSelectedSortItem = true

			linkElement.addEventListener('click', event => {
				event.preventDefault()

				this.getOptionValue = optionValue

				const infoOfSelectedSortItem = {
					optionValue,
					isReverseSort: false
				}

				if (isPushInfoOfSelectedSortItem) {
					this._infoOfSelectedSortItems.push(infoOfSelectedSortItem)

					this._infoOfSelectedSortItems.forEach(item => {
						item.optionValue === infoOfSelectedSortItem.optionValue
							? this.sortComments(item.isReverseSort as boolean)
							: (item.isReverseSort = true)
					})

					isPushInfoOfSelectedSortItem = false
				} else {
					this._infoOfSelectedSortItems.forEach(item => {
						if (item.optionValue === infoOfSelectedSortItem.optionValue) {
							item.isReverseSort
								? (item.isReverseSort = false)
								: (item.isReverseSort = true)

							this.sortComments(item.isReverseSort)
						} else {
							item.isReverseSort = true
						}
					})
				}

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
			})

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
