import styles from './footer.module.scss'

class Footer {
	footerElement: HTMLElement = document.createElement('footer')

	constructor() {
		this.footerElement.classList.add(styles.footer)
	}
}

export default Footer
