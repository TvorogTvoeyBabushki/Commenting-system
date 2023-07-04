import { ICommentInfo } from '../../comment-form/commentForm'
import styles from '../commentItems.module.scss'

class ToolBar {
	spanVoteCount: HTMLElement = document.createElement('span')

	private _voteCount: number
	private _commentInfo: ICommentInfo
	private _favorites: ICommentInfo[] = []

	private _isDecrement: boolean = true
	private _isIncrement: boolean = true

	constructor(commentInfo: ICommentInfo) {
		this._voteCount = commentInfo.voteCount as number
		this._commentInfo = commentInfo

		if (localStorage.getItem('favorites')) {
			this._favorites = [
				...JSON.parse(localStorage.getItem('favorites') as string)
			]
		}
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

		const fillHeartIconElement = document.createElement('img')
		const propsFillHeartIconElement = [
			['src', '/public/fill-heart.png'],
			['alt', 'icon']
		]

		for (const [attr, val] of propsFillHeartIconElement) {
			fillHeartIconElement.setAttribute(attr, val)
		}
		fillHeartIconElement.classList.add(styles.fill_heart)

		let isRemoveFavorites = false
		let isChangeTextFavoriteSpanElement = false

		const favoriteSpanElement = document.createElement('span')
		favoriteSpanElement.innerText = favorite

		propsIconElement.forEach((item, index) => {
			const iconElement = document.createElement('img')

			for (const [attr, val] of item) {
				iconElement.setAttribute(attr, val)
			}

			const buttonElementLeft = document.createElement('button')

			const buttonTextLeft = index === 0 ? answer : favoriteSpanElement

			index === 0
				? buttonElementLeft.addEventListener('click', () => {})
				: buttonElementLeft.addEventListener('click', () => {
						fillHeartIconElement.classList.toggle(styles.active)

						// if (this._favorites.includes(this._commentInfo)) {
						// 	console.log('s')
						// 	fillHeartIconElement.classList.add(styles.active)
						// }

						if (isChangeTextFavoriteSpanElement) {
							favoriteSpanElement.innerText = 'В избранное'

							isChangeTextFavoriteSpanElement = false
						} else {
							favoriteSpanElement.innerText = 'В избранном'

							isChangeTextFavoriteSpanElement = true
						}

						if (isRemoveFavorites) {
							const a = [
								this._favorites.find(item => item === this._commentInfo)
							]
							const b = this._favorites.filter(item => !a.includes(item))
							// проблемма когда добавил 2 коммента в локал и убираешь другой коммент то удаляется все
							this._favorites = [...b]
							localStorage.setItem('favorites', JSON.stringify(this._favorites))

							isRemoveFavorites = false
						} else {
							if (localStorage.getItem('favorites')) {
								this._favorites = [
									...JSON.parse(localStorage.getItem('favorites') as string)
								]
							}

							this._favorites.push(this._commentInfo)

							localStorage.setItem('favorites', JSON.stringify(this._favorites))

							isRemoveFavorites = true
						}
				  })

			buttonElementLeft.append(
				fillHeartIconElement,
				iconElement,
				buttonTextLeft
			)
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
