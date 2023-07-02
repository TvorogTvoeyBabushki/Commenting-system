import styles from './select.module.scss'
import { ICommentInfo } from '@/components/layout/comment/comment-form/commentForm'
import { CommentItems } from '@/components/layout/comment/comment-item/commentItems'

export class Select {
	selectWrapper: HTMLElement
	nameSelectedElement: HTMLElement
	arrowSelectedElement: HTMLElement
	selectListElements: HTMLElement

	previousSelect: string[]

	constructor(selectNameAttr: string, selectOptionValues: string[]) {
		this.selectWrapper = document.createElement('div')
		this.nameSelectedElement = document.createElement('div')
		this.arrowSelectedElement = document.createElement('img')
		this.selectListElements = document.createElement('ul')

		this.previousSelect = ['По количеству оценок']
		this._commentsInfo = new CommentItems()._commentsInfo

		this.addStyles()
		this.addAttrIcon()
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

	private draw(selectOptionValues: string[], selectNameAttr: string) {
		const spanNameSelected = document.createElement('span')

		spanNameSelected.innerText = 'По количеству оценок'
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

				const comments = JSON.parse(
					localStorage.getItem('comment') as string
				) as ICommentInfo[]

				comments.sort((a, b) => a.voteCount - b.voteCount)
				// console.log(comments.reverse())
				this._commentsInfo = comments.reverse()
				new CommentItems().draw()
				console.log(new CommentItems().commentsWrapper)

				const eventTargetElement = event.target as HTMLElement
				spanNameSelected.innerText = `${eventTargetElement.textContent}`

				const checkMarkElements: NodeListOf<HTMLElement> =
					document?.querySelectorAll('.check_mark')

				if (this.previousSelect.at(-1) !== eventTargetElement.textContent) {
					checkMarkElements?.forEach(item => {
						item.style.visibility = 'hidden'
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
