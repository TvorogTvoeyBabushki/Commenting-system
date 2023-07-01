import styles from './select.module.scss'

export class Select {
	selectWrapper: HTMLElement
	nameSelectedElement: HTMLElement
	selectListElements: HTMLElement

	constructor(selectNameAttr: string, selectOptionValues: string[]) {
		this.selectWrapper = document.createElement('div')
		this.nameSelectedElement = document.createElement('div')
		this.selectListElements = document.createElement('ul')

		this.addStyle()
		this.draw(selectOptionValues, selectNameAttr)
	}

	addStyle() {
		this.selectWrapper.classList.add(styles.select)
	}

	createIcon() {
		const iconElement = document.createElement('img')
		const propsIconElement = [
			['src', '/public/arrow.png'],
			['alt', 'icon']
		]

		for (const [attr, val] of propsIconElement) {
			iconElement.setAttribute(attr, val)
		}

		this.toggleArrow(iconElement)

		return iconElement
	}

	toggleArrow(iconElement: HTMLElement) {
		iconElement.onclick = () => iconElement.classList.toggle(styles.active)
	}

	draw(selectOptionValues: string[], selectNameAttr: string) {
		this.nameSelectedElement.append('text', this.createIcon())

		selectOptionValues.forEach(optionValue => {
			const liElement = document.createElement('li')
			const linkElement = document.createElement('a')
			const linkProps = [
				['href', '#'],
				['value', optionValue]
			]

			for (const [attr, val] of linkProps) {
				linkElement.setAttribute(attr, val)
			}

			linkElement.innerText = optionValue

			linkElement.addEventListener('click', event => {
				event.preventDefault()
				alert('w')
			})

			liElement.append(linkElement)

			this.selectListElements.append(liElement)
			this.selectListElements.setAttribute('name', selectNameAttr)
		})

		this.selectWrapper.append(this.nameSelectedElement, this.selectListElements)
	}
}
