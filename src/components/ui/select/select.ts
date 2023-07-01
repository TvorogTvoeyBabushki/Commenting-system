import styles from './select.module.scss'

export class Select {
	selectElement: HTMLElement
	optionElement: HTMLElement | undefined

	constructor(selectNameAttr: string, selectOptionValues: string[]) {
		this.selectElement = document.createElement('select')
		this.optionElement

		this.addStyle()
		this.draw(selectOptionValues, selectNameAttr)
	}

	addStyle() {
		this.selectElement.classList.add(styles.select)
	}

	draw(selectOptionValues: string[], selectNameAttr: string) {
		selectOptionValues.forEach(optionValue => {
			this.optionElement = document.createElement('option')
			this.optionElement.innerText = optionValue
			this.optionElement.setAttribute('value', optionValue)

			this.selectElement.append(this.optionElement)
			this.selectElement.setAttribute('name', selectNameAttr)
		})
	}
}
