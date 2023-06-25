import axios from 'axios'

import styles from './userItem.module.scss'

interface IUser {
	[k: string]: {
		[k: string]: string
	}
}

class UserItem {
	wrapperUser: HTMLElement
	imageUser: HTMLElement
	authorUser: HTMLElement

	private _userInfo: IUser[]

	constructor() {
		this.wrapperUser = document.createElement('div')
		this.imageUser = document.createElement('img')
		this.authorUser = document.createElement('p')

		this._userInfo = []

		this.draw()
		this.addStyle()
	}

	private addStyle() {
		this.wrapperUser.classList.add(styles.wrapper_user)
	}

	public get getUserInfo() {
		return this._userInfo
	}

	private set getUserInfo(user) {
		this._userInfo = user
	}

	private draw() {
		this.getRandomUser((user: IUser[]) => {
			user?.forEach(item => {
				const imageProps = [
					['src', item.picture.large],
					['alt', 'user']
				]

				for (const [attr, val] of imageProps) {
					this.imageUser.setAttribute(attr, val)
				}

				this.authorUser.append(item.name.first, ' ', item.name.last)
				this.wrapperUser.append(this.imageUser, this.authorUser)

				this._userInfo.push(item)
			})
			this.getUserInfo = this._userInfo
		})
	}

	private async getRandomUser(onSuccess: (arg: IUser[]) => void) {
		try {
			const { data } = await axios.get('https://randomuser.me/api/', {
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (data) onSuccess(data.results)
		} catch (error) {
			console.error(error)
		}
	}
}

export default UserItem
