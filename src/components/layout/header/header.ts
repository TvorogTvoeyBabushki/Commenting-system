import styles from './header.module.scss'

export class Header {
	header = document.createElement('header')

	private addStyle() {
		this.header.classList.add(styles.header)
	}

	public draw() {
		this.addStyle()

		return this.header
	}
}
