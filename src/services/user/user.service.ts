import axios from 'axios'

export class UserService {
	async getAllUser() {
		return axios.get('https://randomuser.me/api/')
	}
}

// export default new UserService()
