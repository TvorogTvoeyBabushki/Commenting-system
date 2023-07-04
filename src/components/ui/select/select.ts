import styles from './select.module.scss'
import { CommentItems } from '@/components/layout/comment/comment-item/commentItems'

export class Select {
	selectWrapper: HTMLElement
	nameSelectedElement: HTMLElement
	arrowSelectedElement: HTMLElement
	selectListElements: HTMLElement

	previousSelect: string[]
	optionValue: string

	constructor(
		selectNameAttr: string,
		selectOptionValues: string[],
		commentItemsWrapper: HTMLElement
	) {
		this.selectWrapper = document.createElement('div')
		this.nameSelectedElement = document.createElement('div')
		this.arrowSelectedElement = document.createElement('img')
		this.selectListElements = document.createElement('ul')

		this.previousSelect = ['По актуальности']
		this.optionValue = ''

		this.addStyles()
		this.addAttrIcon()
		this.draw(selectOptionValues, selectNameAttr, commentItemsWrapper)

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
		return this.optionValue
	}

	private set getOptionValue(optionValue) {
		this.optionValue = optionValue
	}

	public sortComments(commentItemsWrapper: HTMLElement, optionValue: string) {
		commentItemsWrapper.innerHTML = ''
		const commentItems = new CommentItems().sortComments(optionValue)

		commentItems?.forEach(commentItem => {
			commentItemsWrapper.append(commentItem)
		})
	}

	private draw(
		selectOptionValues: string[],
		selectNameAttr: string,
		commentItemsWrapper: HTMLElement
	) {
		const spanNameSelected = document.createElement('span')

		spanNameSelected.innerText = 'По актуальности'
		spanNameSelected.classList.add(styles.active)

		selectOptionValues.forEach(optionValue => {
			const liElement = document.createElement('li')

			const checkMarkElement = document.createElement('img')
			checkMarkElement.classList.add('check_mark')
			checkMarkElement.src = '/public/check-mark.png'

			if (this.previousSelect.at(-1) === optionValue) {
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

			linkElement.addEventListener('click', event => {
				event.preventDefault()
				this.getOptionValue = optionValue

				this.sortComments(commentItemsWrapper, optionValue)

				const eventTargetElement = event.target as HTMLElement
				spanNameSelected.innerText = `${eventTargetElement.textContent}`

				const checkMarkElements: NodeListOf<HTMLElement> =
					document?.querySelectorAll('.check_mark')

				if (this.previousSelect.at(-1) !== eventTargetElement.textContent) {
					checkMarkElements?.forEach(checkMarkElement => {
						checkMarkElement.style.visibility = 'hidden'
					})

					checkMarkElement.style.visibility = 'visible'

					this.previousSelect.pop()
					this.previousSelect.push(eventTargetElement.textContent as string)
				}
			})

			liElement.append(linkElement)
			liElement.classList.add(styles.active)

			this.selectListElements.append(liElement)
		})
		this.selectListElements.setAttribute('name', selectNameAttr)

		this.nameSelectedElement.append(spanNameSelected, this.arrowSelectedElement)
		this.selectWrapper.append(this.nameSelectedElement, this.selectListElements)
	}
}
