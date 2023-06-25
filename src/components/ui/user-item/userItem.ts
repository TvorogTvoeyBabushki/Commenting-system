import axios from 'axios'

import styles from './userItem.module.scss'

interface IUser {
	[k: string]: string | number
}

class UserItem {
	wrapperUser: HTMLElement
	imageUser: HTMLElement
	authorUser: HTMLElement

	userInfo: IUser

	constructor() {
		this.wrapperUser = document.createElement('div')
		this.imageUser = document.createElement('img')
		this.authorUser = document.createElement('p')

		this.userInfo = {}

		// this.draw()
		this.addStyle()
	}

	private addStyle() {
		this.wrapperUser.classList.add(styles.wrapper_user)
	}

	public get getUserInfo() {
		return this.userInfo
	}

	public set getUserInfo(user) {
		this.userInfo = user
	}

	public draw() {
		this.getRandomUser((user: IUser[]) => {
			user?.forEach(item => {
				this.imageUser.setAttribute('src', item.picture.large)
				this.authorUser.append(item.name.first, ' ', item.name.last)
				this.wrapperUser.append(this.imageUser, this.authorUser)

				this.userInfo = item
			})
			console.log(this.userInfo)
			return (this.getUserInfo = this.userInfo)
		})

		return this
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
