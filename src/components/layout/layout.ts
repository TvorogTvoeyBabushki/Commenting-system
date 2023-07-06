import CommentSystem from './comment/commentSystem'
import Footer from './footer/footer'
import styles from './layout.module.scss'

class Layout {
	sectionElement = document.createElement('section')

	footer = new Footer()
	commentSystem = new CommentSystem()

	private addStyle() {
		this.sectionElement.classList.add(styles.layout)
	}

	public draw(children: HTMLElement) {
		this.sectionElement.append(
			children,
			this.footer.draw(),
			this.commentSystem.draw()
		)

		this.addStyle()

		return this.sectionElement
	}
}

export default Layout
