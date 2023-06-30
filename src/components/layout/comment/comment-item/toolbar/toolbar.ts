class ToolBar {
	spanVoteCount: HTMLElement
	private _voteCount: number

	private _isDecrement: boolean
	private _isIncrement: boolean

	constructor(voteCount: number) {
		this.spanVoteCount = document.createElement('span')
		this._voteCount = voteCount

		this._isDecrement = true
		this._isIncrement = true
	}

	private drawVoteCount() {
		this._voteCount > 0
			? (this.spanVoteCount.style.color = '#8AC540')
			: this._voteCount < 0
			? (this.spanVoteCount.style.color = '#F00')
			: (this.spanVoteCount.style.color = '#000')

		this.spanVoteCount.innerText = `${this._voteCount}`

		return this.spanVoteCount
	}

	private decrement = (event: MouseEvent) => {
		event.preventDefault()
		const buttonElement = event.target as HTMLButtonElement

		if (this._isDecrement && !this._isIncrement) {
			this._voteCount--
			this._isIncrement = true
		} else if (this._isDecrement) {
			this._voteCount--
			this._isDecrement = false
		} else {
			buttonElement.disabled = true
		}

		buttonElement.disabled = false

		this.drawVoteCount()
	}

	private increment = (event: MouseEvent) => {
		event.preventDefault()
		const buttonElement = event.target as HTMLButtonElement

		if (!this._isDecrement && this._isIncrement) {
			this._voteCount++
			this._isDecrement = true
		} else if (this._isIncrement) {
			this._voteCount++
			this._isIncrement = false
		} else {
			buttonElement.disabled = true
		}

		buttonElement.disabled = false

		this.drawVoteCount()
	}

	public draw() {
		const toolbar = document.createElement('div')
		const toolbarWrapper = document.createElement('div')
		const toolbarItemLeft = document.createElement('div')
		const toolbarItemRight = document.createElement('div')

		const propsIconElement = [
			[
				['src', '/public/answer-to-comment.png'],
				['alt', 'icon']
			],
			[
				['src', '/public/empty-heart.png'],
				['alt', 'icon']
			]
		]
		const [answer, favorite] = ['Ответить', 'В избранное']
		const [decrement, increment] = ['-', '+']

		propsIconElement.forEach((item, index) => {
			const iconElement = document.createElement('img')

			for (const [attr, val] of item) {
				iconElement.setAttribute(attr, val)
			}

			const buttonElementLeft = document.createElement('button')
			const buttonTextLeft = index === 0 ? answer : favorite

			buttonElementLeft.append(iconElement, buttonTextLeft)
			toolbarItemLeft.append(buttonElementLeft)

			const buttonElementRight = document.createElement('button')
			const buttonTextRight = index === 0 ? decrement : increment

			index === 0
				? buttonElementRight.addEventListener('click', this.decrement)
				: buttonElementRight.addEventListener('click', this.increment)

			buttonElementRight.append(buttonTextRight)
			toolbarItemRight.append(buttonElementRight)

			const previousButton = buttonElementRight.previousElementSibling
			previousButton?.nextElementSibling?.before(this.drawVoteCount())

			toolbarWrapper.append(toolbarItemLeft, toolbarItemRight)
			toolbar.append(toolbarWrapper)
		})

		return toolbar
	}
}

export default ToolBar
