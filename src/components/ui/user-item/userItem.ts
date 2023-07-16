import axios from 'axios'

import styles from './userItem.module.scss'

interface IUser {
	[k: string]: {
		[k: string]: string
	}
}

class UserItem {
	wrapperUser = document.createElement('div')
	imageUser = document.createElement('img')
	authorUser = document.createElement('p')

	private _userInfo: IUser[] = []

	private addStyle() {
		this.wrapperUser.classList.add(styles.user_wrapper)
	}

	public get getUserInfo() {
		return this._userInfo
	}

	private set getUserInfo(user) {
		this._userInfo = user
	}

	public draw() {
		this.getRandomUser((user: IUser[]) => {
			user?.forEach(userInfo => {
				const imageProps = [
					['src', userInfo.picture.large],
					['alt', 'user']
				]

				for (const [attr, val] of imageProps) {
					this.imageUser.setAttribute(attr, val)
				}

				this.authorUser.append(userInfo.name.first, ' ', userInfo.name.last)
				this.wrapperUser.append(this.imageUser, this.authorUser)

				this._userInfo.push(userInfo)
			})
			this.getUserInfo = this._userInfo
		})

		this.addStyle()
		return this.wrapperUser
	}

	private async getRandomUser(onSuccess: (arg: IUser[]) => void) {
		try {
			const { data } = await axios.get('https://randomuser.me/api/', {
				headers: {
					'Access-Control-Allow-Origin': '*',
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
