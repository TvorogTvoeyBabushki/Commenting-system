import styles from './footer.module.scss'

class Footer {
	footerElement: HTMLElement = document.createElement('footer')

	public draw() {
		this.footerElement.classList.add(styles.footer)

		return this.footerElement
	}
}

export default Footer
