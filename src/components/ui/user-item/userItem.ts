import styles from './userItem.module.scss'
import UserService from '@/services/user/user.service'

interface IUser {
	picture: {
		large: string
	}
	name: {
		first: string
		last: string
	}
}
interface IUserInfo {
	image: string
	author: string
}

class UserItem {
	wrapperUser: HTMLElement
	imageUser: HTMLElement
	authorUser: HTMLElement

	user: IUser[] | undefined
	userInfo: IUserInfo

	constructor() {
		this.wrapperUser = document.createElement('div')
		this.imageUser = document.createElement('img')
		this.authorUser = document.createElement('p')
		this.userInfo = {
			image: '',
			author: ''
		}

		this.getRandomUser()
		this.addStyle()
	}

	private addStyle() {
		this.wrapperUser.classList.add(styles.wrapper_user)
	}

	public draw(user: IUser[] | undefined) {
		user?.forEach(item => {
			this.imageUser.setAttribute('src', item.picture.large)
			this.authorUser.append(item.name.first, ' ', item.name.last)
			this.wrapperUser.append(this.imageUser, this.authorUser)

			this.userInfo = {
				image: item.picture.large,
				author: `${item.name.first} ${item.name.last}`
			}
		})

		console.log(this.userInfo)
	}

	private async getRandomUser() {
		try {
			const { data } = await UserService.getAllUser()

			this.user = data.results
		} catch (error) {
			console.error(error)
		}

		this.draw(this.user)
	}
}

export default UserItem
